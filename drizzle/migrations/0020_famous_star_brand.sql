ALTER TABLE "answers" ALTER COLUMN "response_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "evaluations" DROP COLUMN IF EXISTS "updated_at";