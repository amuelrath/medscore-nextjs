"use server";
import { db } from "@/db";
import { responsesView } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllResponses({ formId }: { formId: string }) {
  return db
    .select()
    .from(responsesView)
    .where(eq(responsesView.formId, formId));
}

export type AllResponsesResult = Awaited<ReturnType<typeof getAllResponses>>;
