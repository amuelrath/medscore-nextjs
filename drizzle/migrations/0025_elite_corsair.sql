DROP TABLE "multi_choice_questions";--> statement-breakpoint
ALTER TABLE "options" RENAME COLUMN "multi_choice_question_id" TO "question_id";--> statement-breakpoint
ALTER TABLE "options" DROP CONSTRAINT "options_multi_choice_question_id_multi_choice_questions_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "options" ADD CONSTRAINT "options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
