ALTER TABLE "answers" DROP CONSTRAINT "answers_option_id_version_number_options_id_version_number_fk";
--> statement-breakpoint
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_question_id_version_number_questions_id_version_number_fk";
--> statement-breakpoint
ALTER TABLE "options" DROP CONSTRAINT "options_id_version_number_pk";--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_id_version_number_pk";--> statement-breakpoint
ALTER TABLE "feedback" ALTER COLUMN "version_number" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "options" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "options" ALTER COLUMN "version_number" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "questions" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "version_number" SET DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "options" ADD CONSTRAINT "options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "answers" DROP COLUMN IF EXISTS "version_number";