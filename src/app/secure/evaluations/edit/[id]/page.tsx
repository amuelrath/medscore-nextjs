import { db } from "@/db";
import EvaluationEditor from "./_components/Editor";
import { desc, eq } from "drizzle-orm";
import { forms } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ClientForm, ClientSubcompetency } from "@/db/client-types";
export default async function EditorPage({
  params,
}: {
  params: { id: string };
}) {
  const query = await db.transaction(async (tx) => {
    // first we must find what the newest form version is
    const currentVersion = (
      await tx
        .select()
        .from(forms)
        .where(eq(forms.id, params.id))
        .orderBy(desc(forms.version))
    ).at(0)?.version;
    console.log("Current Version: ", currentVersion);
    if (!currentVersion)
      throw new Error("Something went wrong fetching the most recent version!");
    // then we find the form data for that version
    const formQuery: ClientForm | undefined = await tx.query.forms.findFirst({
      where: (f, { and, eq, isNull }) =>
        and(
          eq(f.id, params.id),
          isNull(f.deletedAt),
          eq(f.version, currentVersion)
        ),
      with: {
        programs: {
          with: {
            specialties: true,
          },
        },
        questions: {
          where: (q, { eq, isNull, and }) =>
            and(isNull(q.deletedAt), eq(q.version, currentVersion)),
          with: {
            options: {
              where: (o, { eq, isNull, and }) =>
                and(eq(o.version, currentVersion), isNull(o.deletedAt)),
            },
            milestones: {
              where: (m, { eq, isNull, and }) =>
                and(eq(m.version, currentVersion), isNull(m.deletedAt)),
              columns: {
                milestoneId: true,
              },
            },
          },
        },
      },
    });
    if (!formQuery) throw new Error("Form not found!");

    const subcompetencyQuery: ClientSubcompetency[] =
      await tx.query.subcompetencies.findMany({
        where: (sc, { eq }) =>
          eq(sc.specialtyId, formQuery.programs?.specialtyId || ""),
        with: {
          milestones: true,
          competencies: true,
        },
      });
    return { formQuery, subcompetencyQuery };
  });

  // update last opened
  db.update(forms)
    .set({
      lastOpenedAt: new Date(),
    })
    .where(eq(forms.id, params.id))
    .finally(() => revalidatePath("layout"));

  if (query.formQuery.creatorId !== process.env.DEV_USER_ID!) {
    return new Error("Unauthorized");
  }

  return (
    <EvaluationEditor
      form={query.formQuery}
      subcompetencies={query.subcompetencyQuery}
    />
  );
}
