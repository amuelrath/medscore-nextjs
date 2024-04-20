import { db } from "@/db";
import EvaluationsViewer from "./_components/EvaluationsViewer";

export default async function SecureEvaluationsHomePage() {
  const data = await db.transaction(async (tx) => {
    const allUndeletedEvaluationsOwnedByCurrentUser =
      await tx.query.forms.findMany({
        where: (form, { eq, isNull, and }) =>
          and(
            eq(form.creatorId, process.env.DEV_USER_ID!),
            isNull(form.deletedAt)
          ),
        with: {
          versions: true,
        },
      });

    const result = await Promise.all(
      allUndeletedEvaluationsOwnedByCurrentUser.map(async (e) => {
        const newestVersionNumber = e.versions.length;
        const versionedEvaluation = await tx.query.forms.findFirst({
          where: (form, { eq }) => eq(form.id, e.id),
          with: {
            programs: {
              with: {
                specialties: {
                  with: {
                    subcompetencies: {
                      with: {
                        milestones: true,
                      },
                    },
                  },
                },
              },
            },
            versions: {
              where: (version, { eq }) =>
                eq(version.versionNumber, newestVersionNumber),
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
          },
        });
        return versionedEvaluation!;
      })
    );

    return result;
  });

  return <EvaluationsViewer data={data} />;
}
