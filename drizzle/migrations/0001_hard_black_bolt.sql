ALTER TABLE "questions" RENAME COLUMN "evaluation_version_id" TO "evaluation_id";--> statement-breakpoint
ALTER TABLE "options" DROP CONSTRAINT "options_question_id_version_number_pk";--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_evaluation_version_id_version_number_pk";--> statement-breakpoint
ALTER TABLE "evaluation_versions" ALTER COLUMN "version_number" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "evaluation_versions" ALTER COLUMN "version_number" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "options" ALTER COLUMN "version_number" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "version_number" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "evaluation_versions" ADD CONSTRAINT "evaluation_versions_version_number_evaluation_id_pk" PRIMARY KEY("version_number","evaluation_id");--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "version_number" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "version_number" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "options" ADD CONSTRAINT "options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "evaluation_versions" DROP COLUMN IF EXISTS "id";