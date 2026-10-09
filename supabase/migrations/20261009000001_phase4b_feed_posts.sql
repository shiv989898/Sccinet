-- Phase 4B Migration: Feed Foundation & Posts Table
-- Deterministic schema for chronological feed posts with strict RLS

-- 1. Create Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT post_content_not_empty CHECK (trim(content) <> ''),
    CONSTRAINT post_content_length_check CHECK (char_length(content) <= 1000)
);

-- 2. Indexes for Feed Browsing & Author Lookups
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at_desc ON public.posts(created_at DESC);

-- 3. Automatic Updated At Timestamp Trigger
CREATE OR REPLACE FUNCTION public.handle_post_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_post_updated_at ON public.posts;
CREATE TRIGGER on_post_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_post_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 5. Posts RLS Policies

-- Anyone can read posts for public feed browsing
CREATE POLICY "Posts are readable by everyone"
    ON public.posts
    FOR SELECT
    USING (true);

-- Authenticated users can insert posts only as themselves
CREATE POLICY "Users can create their own posts"
    ON public.posts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

-- Authors can update only their own posts
CREATE POLICY "Users can update their own posts"
    ON public.posts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Authors can delete only their own posts
CREATE POLICY "Users can delete their own posts"
    ON public.posts
    FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);
