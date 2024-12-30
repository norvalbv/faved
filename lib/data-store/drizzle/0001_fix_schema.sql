-- Drop existing tables
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS briefs;
DROP TABLE IF EXISTS users;

-- Create tables with correct schema
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY NOT NULL,
  clerk_id text NOT NULL UNIQUE,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  metadata jsonb NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS briefs (
  id text PRIMARY KEY NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  type text CHECK (type IN ('game_design', 'visual_creator', 'filmmaking', 'logo_design', 'booktuber')) NOT NULL,
  metadata jsonb NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id text PRIMARY KEY NOT NULL,
  brief_id text NOT NULL REFERENCES briefs(id),
  influencer_id text NOT NULL REFERENCES users(id),
  type text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
  id text PRIMARY KEY NOT NULL,
  submission_id text NOT NULL REFERENCES submissions(id),
  type text NOT NULL,
  content text NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
); 