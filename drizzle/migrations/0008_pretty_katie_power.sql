ALTER TABLE "answers" DROP CONSTRAINT "answers_option_id_options_id_fk";
--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "version_number" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_version_number_options_id_version_number_fk" FOREIGN KEY ("option_id","version_number") REFERENCES "options"("id","version_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
