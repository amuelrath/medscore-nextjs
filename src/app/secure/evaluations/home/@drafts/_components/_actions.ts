"use server";
import { db } from "@/db";
import { milestonesOnQuestions, options, questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// TODO GET ACTUAL USER DATA FROM SESSION
export async function createNewEvaluation() {}

export async function softDeleteEvaluation(formId: string) {}
