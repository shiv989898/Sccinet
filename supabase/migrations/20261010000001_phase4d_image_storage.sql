-- Phase 4D: Image Upload & Optimization (Storage Buckets & RLS)
-- Creates 'avatars' and 'project-covers' buckets with least-privilege security policies.

-- 1. Create 'avatars' bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Create 'project-covers' bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-covers',
  'project-covers',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Storage Policies for 'avatars'
-- Anyone can view avatars (public read)
CREATE POLICY "Public avatars access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Users can upload only their own avatar to avatars/{user_id}/...
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- Users can update only their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (auth.uid())::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- Users can delete only their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 4. Storage Policies for 'project-covers'
-- Anyone can view project covers (public read)
CREATE POLICY "Public project covers access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-covers');

-- Only project owners can upload project covers to project-covers/{owner_id}/{project_id}/...
CREATE POLICY "Project owners can upload project covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-covers'
  AND (storage.foldername(name))[1] = (auth.uid())::text
  AND (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = ((storage.foldername(name))[2])::uuid
      AND owner_id = auth.uid()
  )
);

-- Only project owners can update project covers
CREATE POLICY "Project owners can update project covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-covers'
  AND (storage.foldername(name))[1] = (auth.uid())::text
  AND (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = ((storage.foldername(name))[2])::uuid
      AND owner_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'project-covers'
  AND (storage.foldername(name))[1] = (auth.uid())::text
  AND (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = ((storage.foldername(name))[2])::uuid
      AND owner_id = auth.uid()
  )
);

-- Only project owners can delete project covers
CREATE POLICY "Project owners can delete project covers"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-covers'
  AND (storage.foldername(name))[1] = (auth.uid())::text
  AND (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = ((storage.foldername(name))[2])::uuid
      AND owner_id = auth.uid()
  )
);
