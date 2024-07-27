'use server'
import { db } from '@/db'
import { responses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteResponse(responseId: string) {
  return db.delete(responses).where(eq(responses.id, responseId))
}