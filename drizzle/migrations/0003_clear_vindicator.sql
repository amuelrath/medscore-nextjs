ALTER TABLE "answers" DROP CONSTRAINT "answers_response_id_option_id_pk";--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "option_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;