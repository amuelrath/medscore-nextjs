"use sever";

import { db } from "@/db";
import { formCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function cancelAdministerForm(formId: string) {
  const allVersions = await db.query.formVersions.findMany({
    where: (fv, { eq }) => eq(fv.formId, formId),
    with: {
      code: true,
    },
  });

  const allCodes = allVersions
    .flatMap((fv) => fv.code)
    .filter((c) => c.deletedAt === null || undefined);
  const newestCode = allCodes.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  await db
    .update(formCodes)
    .set({
      deletedAt: new Date(),
    })
    .where(eq(formCodes.id, newestCode.id));
}
