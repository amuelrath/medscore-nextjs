"use server";

import { ColorOption } from "@/components/(admin)/forms/home/form-tags";
import { db } from "@/db";
import { formTags } from "@/db/schema";

export async function createTag({
  id,
  variant,
  tag,
  formId,
}: {
  id: string;
  variant: ColorOption;
  tag: string;
  formId: string;
}) {
  await db.insert(formTags).values({
    id,
    tag,
    variant,
    formId,
  });
}
