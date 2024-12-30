ALTER TABLE "campaigns" ALTER COLUMN "project_id" SET DEFAULT 'milanote_project_001';--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "project_id" SET DEFAULT 'milanote_project_001';--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "brief_id" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brief_id_briefs_id_fk" FOREIGN KEY ("brief_id") REFERENCES "public"."briefs"("id") ON DELETE no action ON UPDATE no action;