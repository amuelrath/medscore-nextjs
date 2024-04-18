CREATE TABLE IF NOT EXISTS "publications" (
	"id" uuid,
	"evaluation_id" uuid NOT NULL,
	"published_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "evaluations" DROP COLUMN IF EXISTS "published";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publications" ADD CONSTRAINT "publications_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
