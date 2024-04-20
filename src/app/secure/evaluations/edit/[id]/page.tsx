import { db } from "@/db";
import EvaluationEditor from "./_components/Editor";
import { VersionedEvaluation } from "@/db/client-types";
import { eq } from "drizzle-orm";
import { forms } from "@/db/schema";
import { revalidatePath } from "next/cache";
export default async function EditorPage({
  params,
}: {
  params: { id: string };
}) {
  const data: VersionedEvaluation = await db.transaction(async (tx) => {
    const formIsValid = await tx.query.forms.findFirst({
      where: (form, { eq, isNull, and }) =>
        and(
          eq(form.creatorId, process.env.DEV_USER_ID!),
          isNull(form.deletedAt),
          eq(form.id, params.id)
        ),
      with: {
        versions: true,
      },
    });

    if (!formIsValid) throw new Error("Something went wrong!");
    const newestVersionNumber = formIsValid.versions.length;
    const result = await tx.query.forms.findFirst({
      where: (form, { eq }) => eq(form.id, params.id),
      with: {
        programs: {
          with: {
            specialties: {
              with: {
                subcompetencies: {
                  with: {
                    milestones: true,
                    competencies: true,
                  },
                },
              },
            },
          },
        },
        questions: {
          where: (question, { eq }) =>
            eq(question.versionNumber, newestVersionNumber),
          with: {
            options: {
              where: (option, { eq }) =>
                eq(option.versionNumber, newestVersionNumber),
            },
            milestones: {
              where: (milestone, { eq }) =>
                eq(milestone.versionNumber, newestVersionNumber),
            },
          },
        },
        versions: true,
      },
    });
    if (!result) throw new Error("Something went wrong!");
    return result;
  });

  // update last opened
  db.update(forms)
    .set({
      lastOpenedAt: new Date(),
    })
    .where(eq(forms.id, params.id))
    .finally(() => revalidatePath("layout"));

  if (data.creatorId !== process.env.DEV_USER_ID!) {
    return new Error("Unauthorized");
  }

  return <EvaluationEditor defaultValues={data} />;
}
