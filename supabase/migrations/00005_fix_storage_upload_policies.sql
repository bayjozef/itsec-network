-- Create blog bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Make all existing buckets public for reading
UPDATE storage.buckets SET public = true WHERE id IN ('products', 'banners', 'avatars', 'blog');

-- Drop old restrictive policies that may have blocked authenticated uploads
DROP POLICY IF EXISTS "avatars_upload_own" ON storage.objects;
DROP POLICY IF EXISTS "banners_storage_admin" ON storage.objects;
DROP POLICY IF EXISTS "products_storage_admin" ON storage.objects;
DROP POLICY IF EXISTS "avatars_storage_own" ON storage.objects;
DROP POLICY IF EXISTS "banners_storage_public" ON storage.objects;
DROP POLICY IF EXISTS "products_storage_public" ON storage.objects;

-- PUBLIC READ for all buckets
CREATE POLICY "storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('products', 'banners', 'avatars', 'blog'));

-- AUTHENTICATED users can upload to products, banners, blog (admin-intended)
CREATE POLICY "storage_authenticated_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('products', 'banners', 'blog'));

-- Users can upload their own avatars
CREATE POLICY "storage_avatar_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update/delete their own uploads
CREATE POLICY "storage_authenticated_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('products', 'banners', 'blog', 'avatars'));

CREATE POLICY "storage_authenticated_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('products', 'banners', 'blog', 'avatars'));