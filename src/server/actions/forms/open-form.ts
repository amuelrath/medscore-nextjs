"use server";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function openForm({ formId }: { formId: string }) {
  await db
    .update(forms)
    .set({
      lastOpenedAt: new Date(),
    })
    .where(eq(forms.id, formId));
}
