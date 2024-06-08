"use server";
import { db } from "@/db";

export async function getFormStatus({ formId }: { formId: string | undefined }) {
  if (!formId) throw new Error("Form Id is required");
  const allFormVersions = await db.query.formVersions.findMany({
    where: (form, { eq }) => eq(form.formId, formId),
    with: { code: true },
  });

  const formVersion = allFormVersions
    .flatMap((f) => f.code)
    .filter((c) => c && !c.deletedAt)
    .sort(
      (a, b) =>
        new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime(),
    )[0];

  if (!formVersion) return null;

  if (formVersion.expiresAt < new Date()) return null;

  return {
    code: formVersion.code,
    expiresAt: formVersion.expiresAt,
  };
}
