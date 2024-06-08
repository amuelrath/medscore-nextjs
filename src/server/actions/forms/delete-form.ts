"use server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteForm(formId: string) {
  await db.delete(forms).where(eq(forms.id, formId));
  revalidatePath("/forms")

}
