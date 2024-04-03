ALTER TABLE "evaluations" ADD COLUMN "client_id" uuid;--> statement-breakpoint
ALTER TABLE "options" ADD COLUMN "client_id" uuid;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "client_id" uuid;