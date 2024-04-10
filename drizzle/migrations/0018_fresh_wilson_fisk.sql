ALTER TABLE "answers" DROP CONSTRAINT "answers_response_id_unique";--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "response_id" SET NOT NULL;