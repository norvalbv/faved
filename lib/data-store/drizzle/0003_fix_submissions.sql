-- Drop existing submissions table
DROP TABLE IF EXISTS submissions;

-- Recreate submissions table with metadata
CREATE TABLE IF NOT EXISTS submissions (
  id text PRIMARY KEY NOT NULL,
  brief_id text NOT NULL REFERENCES briefs(id),
  type text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  metadata jsonb,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
); 