import { db } from "@/db";
import FormEditorSection from "@/components/(evaluations)/sections/form-editor";
import { eq } from "drizzle-orm";
import { forms } from "@/db/schema";
import { revalidatePath } from "next/cache";
export default async function EditorPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: query to get forms and subcompetencies and students?
  const formQuery = await db.query.forms.findFirst({
    with: {
      programs: {
        with: {
          users: {
            with: {
              user: true,
            },
          },
        },
      },
      questions: {
        with: {
          options: true,
          milestones: {
            with: {
              milestone: true,
            },
          },
        },
      },
    },
  });
  const subcompetencyQuery = await db.query.subcompetencies.findMany({
    with: {
      milestones: true,
      competencies: true,
    },
  });
  // update last opened
  db.update(forms)
    .set({
      lastOpenedAt: new Date(),
    })
    .where(eq(forms.id, params.id));

  if (formQuery?.creatorId !== process.env.DEV_USER_ID!) {
    return new Error("Unauthorized");
  }

  return (
    <FormEditorSection form={formQuery} subcompetencies={subcompetencyQuery} />
  );
}
