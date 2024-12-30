-- Drop the existing table
DROP TABLE IF EXISTS "submissions";

-- Create the new table
CREATE TABLE IF NOT EXISTS "submissions" (
  "id" text PRIMARY KEY NOT NULL,
  "campaign_id" text REFERENCES "campaigns"("id"),
  "type" text,
  "content" text NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
); 