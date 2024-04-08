CREATE TABLE IF NOT EXISTS "published_evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"program_id" uuid NOT NULL,
	"creator_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "published_milestones_on_questions" (
	"published_question_id" uuid NOT NULL,
	"milestone_id" uuid NOT NULL,
	CONSTRAINT "published_milestones_on_questions_milestone_id_published_question_id_pk" PRIMARY KEY("milestone_id","published_question_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "published_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text,
	"position" integer,
	"point_value" numeric,
	"published_question_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "published_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text,
	"position" integer,
	"published_evaluation_id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "published_evaluations" ADD CONSTRAINT "published_evaluations_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "published_evaluations" ADD CONSTRAINT "published_evaluations_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "published_milestones_on_questions" ADD CONSTRAINT "published_milestones_on_questions_published_question_id_published_questions_id_fk" FOREIGN KEY ("published_question_id") REFERENCES "published_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "published_milestones_on_questions" ADD CONSTRAINT "published_milestones_on_questions_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "published_options" ADD CONSTRAINT "published_options_published_question_id_published_questions_id_fk" FOREIGN KEY ("published_question_id") REFERENCES "published_questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "published_questions" ADD CONSTRAINT "published_questions_published_evaluation_id_published_evaluations_id_fk" FOREIGN KEY ("published_evaluation_id") REFERENCES "published_evaluations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
