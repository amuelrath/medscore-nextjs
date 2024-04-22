DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('ADMIN', 'STUDENT', 'FACULTY', 'NONE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answers" (
	"id" uuid DEFAULT gen_random_uuid(),
	"option_id" uuid NOT NULL,
	"response_id" uuid NOT NULL,
	"version" integer NOT NULL,
	CONSTRAINT "answers_response_id_option_id_version_pk" PRIMARY KEY("response_id","option_id","version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "competencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "competencies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedback" (
	"id" uuid DEFAULT gen_random_uuid(),
	"text" text NOT NULL,
	"deleted_at" timestamp,
	"question_id" uuid NOT NULL,
	"version" integer NOT NULL,
	CONSTRAINT "feedback_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "forms" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"title" text NOT NULL,
	"last_opened_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"program_id" uuid NOT NULL,
	"creator_id" uuid,
	CONSTRAINT "forms_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"level" smallint NOT NULL,
	"sublevel" smallint NOT NULL,
	"subcompetency_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestones_on_questions" (
	"question_id" uuid NOT NULL,
	"milestone_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "milestones_on_questions_question_id_milestone_id_version_pk" PRIMARY KEY("question_id","milestone_id","version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "options" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"text" text,
	"deleted_at" timestamp,
	"position" integer,
	"point_value" numeric,
	"question_id" uuid NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "options_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"specialty_id" uuid,
	CONSTRAINT "programs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" uuid DEFAULT gen_random_uuid(),
	"version" integer DEFAULT 1 NOT NULL,
	"deleted_at" timestamp,
	"text" text,
	"feedback" boolean DEFAULT false NOT NULL,
	"position" integer,
	"form_id" uuid NOT NULL,
	CONSTRAINT "questions_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "responses" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"form_id" uuid NOT NULL,
	"version" integer NOT NULL,
	CONSTRAINT "responses_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "specialties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "specialties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subcompetencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"level" smallint NOT NULL,
	"competency_id" uuid NOT NULL,
	"specialty_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"role" "role" DEFAULT 'NONE' NOT NULL,
	"program_id" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answers" ADD CONSTRAINT "answer_response_reference" FOREIGN KEY ("response_id","version") REFERENCES "responses"("id","version") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_version_options_id_version_fk" FOREIGN KEY ("option_id","version") REFERENCES "options"("id","version") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_question_id_version_questions_id_version_fk" FOREIGN KEY ("question_id","version") REFERENCES "questions"("id","version") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forms" ADD CONSTRAINT "forms_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forms" ADD CONSTRAINT "forms_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "milestones" ADD CONSTRAINT "milestones_subcompetency_id_subcompetencies_id_fk" FOREIGN KEY ("subcompetency_id") REFERENCES "subcompetencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "milestones_on_questions" ADD CONSTRAINT "milestones_on_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "milestones_on_questions" ADD CONSTRAINT "milestones_on_questions_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "milestones_on_questions" ADD CONSTRAINT "milestone_question_reference" FOREIGN KEY ("question_id","version") REFERENCES "questions"("id","version") ON DELETE no action ON UPDATE no action;
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
DO $$ BEGIN
 ALTER TABLE "options" ADD CONSTRAINT "options_question_id_version_questions_id_version_fk" FOREIGN KEY ("question_id","version") REFERENCES "questions"("id","version") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "programs" ADD CONSTRAINT "programs_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_form_id_version_forms_id_version_fk" FOREIGN KEY ("form_id","version") REFERENCES "forms"("id","version") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "responses" ADD CONSTRAINT "responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_form_id_version_forms_id_version_fk" FOREIGN KEY ("form_id","version") REFERENCES "forms"("id","version") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcompetencies" ADD CONSTRAINT "subcompetencies_competency_id_competencies_id_fk" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcompetencies" ADD CONSTRAINT "subcompetencies_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
