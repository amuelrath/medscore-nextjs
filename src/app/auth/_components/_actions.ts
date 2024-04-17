"use server";

import { registerSchema } from "@/app/auth/_components/RegisterForm";
import { z } from "zod";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export type FormState = {
  message: string;
};

export async function registerUser(data: FormData) {
  const formData = Object.fromEntries(data);
  const parsed = registerSchema.safeParse(formData);

  if (!parsed.success) {
    return { message: "Invalid form data" };
  }

  const userExists = await db.query.user.findFirst({
    where: (users, { eq }) => eq(user.email, parsed.data.email),
  });

  if (userExists) {
    return { message: "User already exists" };
  }

  // create the user
}
