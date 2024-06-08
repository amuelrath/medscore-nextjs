"use server";

import { db } from "@/db";
import { formCodes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function cancelAdministerForm({ formId }: { formId: string | undefined }) {
  if (!formId) throw new Error("Form Id is required");
  const allVersions = await db.query.formVersions.findMany({
    where: (fv, { eq }) => eq(fv.formId, formId),
    with: {
      code: true,
    },
  });

  const allCodes = allVersions
    .flatMap((fv) => fv.code)
    .filter((c) => c !== null && c !== undefined);
  const newestCode = allCodes.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  if (newestCode) {
    await db
      .update(formCodes)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(formCodes.id, newestCode.id));
  }
}
