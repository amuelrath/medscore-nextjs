"use server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteForm({ formId }: { formId: string }) {
  return db.delete(forms).where(eq(forms.id, formId));
}
