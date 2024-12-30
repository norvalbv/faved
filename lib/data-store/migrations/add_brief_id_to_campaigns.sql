-- Add briefId column to campaigns table
ALTER TABLE campaigns
ADD COLUMN brief_id text REFERENCES briefs(id); 