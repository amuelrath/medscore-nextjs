"use server";
import { db } from "@/db";
import { responsesView } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getResponseData(responseId: string) {
  return db
    .select()
    .from(responsesView)
    .where(eq(responsesView.responseId, responseId));
}

export type AllResponsesResult = Awaited<ReturnType<typeof getResponseData>>;
