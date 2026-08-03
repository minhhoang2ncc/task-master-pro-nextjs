-- 1. Make the bucket private so public URLs no longer bypass RLS
UPDATE storage.buckets
SET public = false
WHERE id = 'task';

-- 2. Drop the overly permissive policies you previously created
DROP POLICY IF EXISTS "Authenticated users can update task files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete task files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for task files" ON storage.objects;

-- 3. Create the new, secure policies restricted to the owner
CREATE POLICY "Users can update their own task files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'task' AND owner = auth.uid());

CREATE POLICY "Users can delete their own task files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'task' AND owner = auth.uid());

CREATE POLICY "Users can read their own task files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'task' AND owner = auth.uid());
