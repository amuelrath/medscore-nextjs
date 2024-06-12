'use server'

import { db } from "@/db";
import { formTags } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteTag({ tagId}: { tagId: string}) {
  await db.delete(formTags).where(eq(formTags.id, tagId))
}