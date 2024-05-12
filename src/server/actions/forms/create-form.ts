"use server";
import { db } from "@/db";
import { forms } from "@/db/schema";

export async function createForm(title: string, programId: string) {
  try {
    const newForm = await db
      .insert(forms)
      .values({
        title,
        programId,
        creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      })
      .returning();
    return newForm;
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error("Error creating form:", error);
    throw error;
  }
}
