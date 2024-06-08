"use server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteForm({ formId }: { formId: string }) {
  await db.delete(forms).where(eq(forms.id, formId));
}
