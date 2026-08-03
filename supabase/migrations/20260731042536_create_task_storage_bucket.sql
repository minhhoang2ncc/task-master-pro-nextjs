-- Create the 'task' storage bucket if it does not already exist.
-- Bucket is public so uploaded files are accessible via the public URL.
INSERT INTO storage.buckets (id, name, public)
VALUES ('task', 'task', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files into the 'task' bucket.
CREATE POLICY "Authenticated users can upload task files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'task');

-- Allow authenticated users to update (overwrite) files in the 'task' bucket.
CREATE POLICY "Authenticated users can update task files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'task');

-- Allow authenticated users to delete files from the 'task' bucket.
CREATE POLICY "Authenticated users can delete task files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'task');

-- Allow anyone (including unauthenticated) to read files since the bucket is public.
CREATE POLICY "Public read access for task files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'task');
