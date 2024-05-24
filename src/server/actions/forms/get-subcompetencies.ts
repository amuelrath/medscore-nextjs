"use server";
import { db } from "@/db";

export async function getSubcompetencies(formId: string) {
  return await db.transaction(async (tx) => {
    const form = await tx.query.forms.findFirst({
      with: {
        programs: true,
      },
      where: (f, { eq }) => eq(f.id, formId),
    });

    return tx.query.subcompetencies.findMany({
      with: {
        milestones: true,
        competencies: true,
      },
      where: (s, { eq }) => eq(s.specialtyId, form?.programs.specialtyId || ""),
    });
  });
}
