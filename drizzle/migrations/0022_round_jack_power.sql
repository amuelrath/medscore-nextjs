DROP TABLE "published_evaluations";--> statement-breakpoint
DROP TABLE "published_milestones_on_questions";--> statement-breakpoint
DROP TABLE "published_options";--> statement-breakpoint
DROP TABLE "published_questions";--> statement-breakpoint
ALTER TABLE "answers" DROP CONSTRAINT "answers_published_option_id_published_options_id_fk";
--> statement-breakpoint
ALTER TABLE "responses" DROP CONSTRAINT "responses_published_evaluation_id_published_evaluations_id_fk";
--> statement-breakpoint
ALTER TABLE "responses" DROP CONSTRAINT "responses_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "answers" DROP CONSTRAINT "answers_published_option_id_response_id_pk";--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "response_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "evaluations" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_response_id_option_id_pk" PRIMARY KEY("response_id","option_id");--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "option_id" uuid;--> statement-breakpoint
ALTER TABLE "evaluations" ADD COLUMN "published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "creator_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "evaluation_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "answers" DROP COLUMN IF EXISTS "published_option_id";--> statement-breakpoint
ALTER TABLE "responses" DROP COLUMN IF EXISTS "published_evaluation_id";--> statement-breakpoint
ALTER TABLE "responses" DROP COLUMN IF EXISTS "user_id";