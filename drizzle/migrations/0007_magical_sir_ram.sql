ALTER TABLE "feedback" DROP CONSTRAINT "feedback_question_id_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "feedback" ALTER COLUMN "version_number" DROP DEFAULT;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_question_id_version_number_questions_id_version_number_fk" FOREIGN KEY ("question_id","version_number") REFERENCES "questions"("id","version_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
