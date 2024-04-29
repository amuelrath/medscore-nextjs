"use server";
import { db } from "@/db";

export async function getFormStatus(formId: string) {
  const allFormVersions = await db.query.formVersions.findMany({
    where: (form, { eq }) => eq(form.formId, formId),
    with: {
      code: true,
    },
  });
  const formVersion = allFormVersions
    .flatMap((f) => f.code)
    .filter((c) => c.deletedAt === null || undefined)
    .sort(
      (a, b) =>
        new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
    )
    .reverse()[0];
  if (!formVersion) return null;
  if (formVersion.expiresAt < new Date()) return null;
  return { code: formVersion.code, expiresAt: formVersion.expiresAt };
}
