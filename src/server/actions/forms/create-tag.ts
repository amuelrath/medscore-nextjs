"use server";

import { ColorOption } from "@/components/(admin)/forms/home/form-tags";
import { db } from "@/db";
import { formTags } from "@/db/schema";

export async function createTag({
  id,
  color,
  tag,
  formId,
}: {
  id: string;
  color: ColorOption;
  tag: string;
  formId: string;
}) {
  await db.insert(formTags).values({
    id,
    tag,
    color,
    formId,
  });
}
