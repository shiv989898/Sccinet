-- Phase 3 Migration: Project Collaboration
-- Adds collaboration requests, automated membership creation on acceptance, and strict security RLS

-- 1. Create Collaboration Requests Table
CREATE TABLE IF NOT EXISTS public.project_collaboration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.project_roles(id) ON DELETE SET NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT collab_request_status_check CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    CONSTRAINT collab_request_message_check CHECK (message IS NULL OR length(message) <= 500)
);

-- 2. Indexes for Collaboration Requests
CREATE INDEX IF NOT EXISTS idx_collab_requests_project_id ON public.project_collaboration_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_collab_requests_user_id ON public.project_collaboration_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_collab_requests_status ON public.project_collaboration_requests(status);

-- Prevent duplicate pending requests from the same user to the same project
CREATE UNIQUE INDEX IF NOT EXISTS idx_collab_requests_unique_pending 
    ON public.project_collaboration_requests(project_id, user_id) 
    WHERE status = 'PENDING';

-- 3. Automatic Membership on Request Acceptance Trigger
CREATE OR REPLACE FUNCTION public.handle_collaboration_request_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- When transitioning from PENDING to ACCEPTED, add requester to project_members
    IF NEW.status = 'ACCEPTED' AND OLD.status = 'PENDING' THEN
        INSERT INTO public.project_members (project_id, profile_id, role_id, joined_at)
        VALUES (NEW.project_id, NEW.user_id, NEW.role_id, timezone('utc'::text, now()))
        ON CONFLICT (project_id, profile_id) DO UPDATE
        SET role_id = COALESCE(EXCLUDED.role_id, public.project_members.role_id);
    END IF;

    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_collaboration_request_status_change ON public.project_collaboration_requests;
CREATE TRIGGER on_collaboration_request_status_change
    BEFORE UPDATE ON public.project_collaboration_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_collaboration_request_status_change();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.project_collaboration_requests ENABLE ROW LEVEL SECURITY;

-- 5. Collaboration Requests RLS Policies

-- SELECT: Requesters can see their own requests; Project owners can see all requests for their projects
CREATE POLICY "Collaboration requests are viewable by requester and project owner"
    ON public.project_collaboration_requests
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_collaboration_requests.project_id
            AND projects.owner_id = auth.uid()
        )
    );

-- INSERT: Authenticated users can request to collaborate if:
-- 1. They are inserting for themselves (auth.uid() = user_id)
-- 2. They are NOT the project owner
-- 3. They are NOT already a member of the project
CREATE POLICY "Users can create collaboration requests for themselves"
    ON public.project_collaboration_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND NOT EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_collaboration_requests.project_id
            AND projects.owner_id = auth.uid()
        )
        AND NOT EXISTS (
            SELECT 1 FROM public.project_members
            WHERE project_members.project_id = project_collaboration_requests.project_id
            AND project_members.profile_id = auth.uid()
        )
    );

-- UPDATE: Project owners can accept or reject requests for their projects
CREATE POLICY "Project owners can update collaboration request status"
    ON public.project_collaboration_requests
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_collaboration_requests.project_id
            AND projects.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_collaboration_requests.project_id
            AND projects.owner_id = auth.uid()
        )
    );

-- DELETE: Requesters can withdraw their pending requests; Project owners can delete requests for their projects
CREATE POLICY "Users can withdraw their pending requests or owners can delete"
    ON public.project_collaboration_requests
    FOR DELETE
    TO authenticated
    USING (
        (auth.uid() = user_id AND status = 'PENDING')
        OR EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_collaboration_requests.project_id
            AND projects.owner_id = auth.uid()
        )
    );

-- 6. Project Members Policy Update: Allow non-owner members to leave a project
CREATE POLICY "Project members can leave project"
    ON public.project_members
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = profile_id
        AND NOT EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_members.project_id
            AND projects.owner_id = auth.uid()
        )
    );
