ALTER TABLE "options" DROP CONSTRAINT "options_question_id_questions_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'options'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "options" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "options" ALTER COLUMN "id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "options" ALTER COLUMN "version_number" DROP DEFAULT;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'questions'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "questions" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "version_number" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "options" ADD CONSTRAINT "options_id_version_number_pk" PRIMARY KEY("id","version_number");--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_id_version_number_pk" PRIMARY KEY("id","version_number");