-- Phase 2A Migration: Projects Foundation
-- Deterministic schema for projects, skills, roles, and membership

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    repository_url TEXT,
    live_url TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT project_status_check CHECK (status IN ('ACTIVE', 'COMPLETED', 'ARCHIVED')),
    CONSTRAINT project_slug_format CHECK (slug ~ '^[a-z0-9_-]{2,80}$')
);

-- Indexes for projects
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- 2. Create Project Skills Junction Table
CREATE TABLE IF NOT EXISTS public.project_skills (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (project_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_project_skills_skill_id ON public.project_skills(skill_id);

-- 3. Create Project Roles Table
CREATE TABLE IF NOT EXISTS public.project_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_roles_project_id ON public.project_roles(project_id);

-- 4. Create Project Role Skills Junction Table
CREATE TABLE IF NOT EXISTS public.project_role_skills (
    role_id UUID NOT NULL REFERENCES public.project_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (role_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_project_role_skills_skill_id ON public.project_role_skills(skill_id);

-- 5. Create Project Members Junction Table
CREATE TABLE IF NOT EXISTS public.project_members (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.project_roles(id) ON DELETE SET NULL,
    joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (project_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_project_members_profile_id ON public.project_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_project_members_role_id ON public.project_members(role_id);

-- 6. Automatic Project Owner Membership Trigger
CREATE OR REPLACE FUNCTION public.handle_new_project_owner_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.project_members (project_id, profile_id, joined_at)
    VALUES (NEW.id, NEW.owner_id, timezone('utc'::text, now()))
    ON CONFLICT (project_id, profile_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_project_created_owner_member ON public.projects;
CREATE TRIGGER on_project_created_owner_member
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_project_owner_member();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- 8. Projects RLS Policies
CREATE POLICY "Projects are readable by everyone"
    ON public.projects
    FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own projects"
    ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects"
    ON public.projects
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can delete their projects"
    ON public.projects
    FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

-- 9. Project Skills RLS Policies
CREATE POLICY "Project skills are readable by everyone"
    ON public.project_skills
    FOR SELECT
    USING (true);

CREATE POLICY "Project owners can add project skills"
    ON public.project_skills
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_skills.project_id
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can remove project skills"
    ON public.project_skills
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_skills.project_id
            AND projects.owner_id = auth.uid()
        )
    );

-- 10. Project Roles RLS Policies
CREATE POLICY "Project roles are readable by everyone"
    ON public.project_roles
    FOR SELECT
    USING (true);

CREATE POLICY "Project owners can create project roles"
    ON public.project_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_roles.project_id
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can update project roles"
    ON public.project_roles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_roles.project_id
            AND projects.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_roles.project_id
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can delete project roles"
    ON public.project_roles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_roles.project_id
            AND projects.owner_id = auth.uid()
        )
    );

-- 11. Project Role Skills RLS Policies
CREATE POLICY "Project role skills are readable by everyone"
    ON public.project_role_skills
    FOR SELECT
    USING (true);

CREATE POLICY "Project owners can add project role skills"
    ON public.project_role_skills
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.project_roles
            JOIN public.projects ON projects.id = project_roles.project_id
            WHERE project_roles.id = project_role_skills.role_id
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can remove project role skills"
    ON public.project_role_skills
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.project_roles
            JOIN public.projects ON projects.id = project_roles.project_id
            WHERE project_roles.id = project_role_skills.role_id
            AND projects.owner_id = auth.uid()
        )
    );

-- 12. Project Members RLS Policies
CREATE POLICY "Project members are readable by everyone"
    ON public.project_members
    FOR SELECT
    USING (true);

CREATE POLICY "Project owners can add project members"
    ON public.project_members
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_members.project_id
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can update project members"
    ON public.project_members
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_members.project_id
            AND projects.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_members.project_id
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can remove project members"
    ON public.project_members
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_members.project_id
            AND projects.owner_id = auth.uid()
        )
    );
