CREATE TABLE IF NOT EXISTS "campaigns" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('active', 'completed', 'draft')),
  "metadata" jsonb,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
); 