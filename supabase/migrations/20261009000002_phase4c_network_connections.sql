-- Phase 4C Migration: Network & Connections Foundation
-- Relational model for peer connections, request states, and strict RLS

-- 1. Create Connections Table
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT connections_status_check CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    CONSTRAINT connections_no_self CHECK (requester_id <> recipient_id)
);

-- 2. Indexes for Lookups and Unique Pair Enforcements
CREATE INDEX IF NOT EXISTS idx_connections_requester_id ON public.connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_recipient_id ON public.connections(recipient_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);

-- Enforce unique active/pending relationship between any two users regardless of direction
CREATE UNIQUE INDEX IF NOT EXISTS idx_connections_active_pair 
    ON public.connections (LEAST(requester_id, recipient_id), GREATEST(requester_id, recipient_id))
    WHERE status IN ('PENDING', 'ACCEPTED');

-- 3. Automatic Pre-Insert Cleanup for Legitimate Retries after Rejection
CREATE OR REPLACE FUNCTION public.handle_new_connection_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If a previous request between this pair was REJECTED, remove it so the new request can be created
    DELETE FROM public.connections
    WHERE status = 'REJECTED'
      AND ((requester_id = NEW.requester_id AND recipient_id = NEW.recipient_id)
        OR (requester_id = NEW.recipient_id AND recipient_id = NEW.requester_id));

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_connection_request_insert ON public.connections;
CREATE TRIGGER on_connection_request_insert
    BEFORE INSERT ON public.connections
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_connection_request();

-- 4. Secure State Transition Enforcement Trigger
CREATE OR REPLACE FUNCTION public.handle_connection_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Disallow altering participants
    IF NEW.requester_id <> OLD.requester_id OR NEW.recipient_id <> OLD.recipient_id THEN
        RAISE EXCEPTION 'Cannot modify connection participants';
    END IF;

    -- Only permit transitions from PENDING
    IF OLD.status <> 'PENDING' THEN
        RAISE EXCEPTION 'Cannot update a connection with status %', OLD.status;
    END IF;

    -- Only allow transitioning to ACCEPTED or REJECTED
    IF NEW.status NOT IN ('ACCEPTED', 'REJECTED') THEN
        RAISE EXCEPTION 'Invalid status transition to %', NEW.status;
    END IF;

    -- Recipient-only response
    IF auth.uid() <> OLD.recipient_id THEN
        RAISE EXCEPTION 'Only the recipient can accept or reject a connection request';
    END IF;

    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_connection_update ON public.connections;
CREATE TRIGGER on_connection_update
    BEFORE UPDATE ON public.connections
    FOR EACH ROW EXECUTE FUNCTION public.handle_connection_update();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- 6. Connections RLS Policies

-- SELECT: Participants can view their own connections and requests
CREATE POLICY "Connections are viewable by participants"
    ON public.connections
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = requester_id
        OR auth.uid() = recipient_id
    );

-- INSERT: Authenticated users can create requests only for themselves
CREATE POLICY "Users can create connection requests for themselves"
    ON public.connections
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = requester_id
        AND requester_id <> recipient_id
        AND status = 'PENDING'
    );

-- UPDATE: Only recipients can respond to pending requests
CREATE POLICY "Recipients can respond to pending connection requests"
    ON public.connections
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = recipient_id
        AND status = 'PENDING'
    )
    WITH CHECK (
        auth.uid() = recipient_id
        AND status IN ('ACCEPTED', 'REJECTED')
    );

-- DELETE: Requesters can withdraw pending; participants can remove accepted or clean up rejected
CREATE POLICY "Participants can delete their connections or requests"
    ON public.connections
    FOR DELETE
    TO authenticated
    USING (
        (auth.uid() = requester_id AND status = 'PENDING')
        OR ((auth.uid() = requester_id OR auth.uid() = recipient_id) AND status IN ('ACCEPTED', 'REJECTED'))
    );
