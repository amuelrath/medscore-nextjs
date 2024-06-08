"use server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createForm(title: string, programId: string) {
    const result =  await db
      .insert(forms)
      .values({
        title,
        programId,
        creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      })
      .returning();

    revalidatePath("/forms");
    return result[0]
}
