ALTER TABLE "publications" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "publications" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "publications" ALTER COLUMN "id" SET NOT NULL;