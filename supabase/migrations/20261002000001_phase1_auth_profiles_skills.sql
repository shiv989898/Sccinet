-- Phase 1 Migration: Authentication, Profiles, and Skills Foundation
-- Deterministic and reproducible schema for Sccinet

-- 1. Create Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    avatar_url TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$')
);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. Create Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for skill slugs and search
CREATE INDEX IF NOT EXISTS idx_skills_slug ON public.skills(slug);
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);

-- 3. Create Profile Skills Junction Table
CREATE TABLE IF NOT EXISTS public.profile_skills (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (profile_id, skill_id)
);

-- Index for querying skills by user or users by skill
CREATE INDEX IF NOT EXISTS idx_profile_skills_skill ON public.profile_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_profile_skills_profile ON public.profile_skills(profile_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;

-- 5. Profiles RLS Policies
-- Anyone can view profiles for discovery
CREATE POLICY "Public profiles are readable by everyone"
    ON public.profiles
    FOR SELECT
    USING (true);

-- Authenticated users can insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Authenticated users can only update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 6. Skills RLS Policies
-- Anyone can view available skills
CREATE POLICY "Skills are readable by everyone"
    ON public.skills
    FOR SELECT
    USING (true);

-- Only authenticated users can contribute a new skill
CREATE POLICY "Authenticated users can insert new skills"
    ON public.skills
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 7. Profile Skills RLS Policies
-- Anyone can read profile skill mappings
CREATE POLICY "Profile skills are readable by everyone"
    ON public.profile_skills
    FOR SELECT
    USING (true);

-- Users can link skills to their own profile
CREATE POLICY "Users can add skills to their own profile"
    ON public.profile_skills
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = profile_id);

-- Users can remove skills from their own profile
CREATE POLICY "Users can remove skills from their own profile"
    ON public.profile_skills
    FOR DELETE
    TO authenticated
    USING (auth.uid() = profile_id);

-- 8. Safe Automatic Profile Creation Trigger
-- When a user registers through auth.users, create their profile safely
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    derived_username TEXT;
    derived_full_name TEXT;
BEGIN
    derived_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
    );

    -- Generate a clean, unique initial username
    derived_username := LOWER(
        REGEXP_REPLACE(
            COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
            '[^a-zA-Z0-9_]',
            '',
            'g'
        )
    );

    IF char_length(derived_username) < 3 THEN
        derived_username := 'user_' || substr(NEW.id::text, 1, 8);
    END IF;

    -- Avoid collisions on fallback usernames
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = derived_username) THEN
        derived_username := derived_username || '_' || substr(NEW.id::text, 1, 4);
    END IF;

    INSERT INTO public.profiles (id, username, full_name)
    VALUES (NEW.id, derived_username, derived_full_name)
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Seed Initial Curated Skills
INSERT INTO public.skills (name, slug) VALUES
    ('React', 'react'),
    ('React Native', 'react-native'),
    ('TypeScript', 'typescript'),
    ('JavaScript', 'javascript'),
    ('Python', 'python'),
    ('Node.js', 'node-js'),
    ('Next.js', 'next-js'),
    ('PostgreSQL', 'postgresql'),
    ('Supabase', 'supabase'),
    ('Docker', 'docker'),
    ('Kubernetes', 'kubernetes'),
    ('UI/UX', 'ui-ux'),
    ('Machine Learning', 'machine-learning'),
    ('Artificial Intelligence', 'artificial-intelligence'),
    ('GraphQL', 'graphql'),
    ('Rust', 'rust'),
    ('Go', 'go'),
    ('Figma', 'figma'),
    ('Tailwind CSS', 'tailwind-css')
ON CONFLICT (name) DO NOTHING;
