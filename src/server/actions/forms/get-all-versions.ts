"use server";
import { db } from "@/db";

export async function getAllVersions({ formId }: { formId: string }) {
  return db.query.formVersions.findMany({
    where: (version, { eq }) => eq(version.formId, formId),
    columns: {
      id: true,
      formId: true,
      createdAt: true,
      title: true,
      programId: false,
    },
    with: {
      questions: {
        columns: {
          id: true,
          position: true,
          text: true,
          formVersionId: false,
          feedback: true
        },
        with: {
          options: {
            columns: {
              id: true,
              text: true,
              position: true,
              pointValue: false,
              questionVersionId: false,
            },
          },
        },
      },
      responses: {
        columns: {
          id: true,
          formVersionId: true,
          createdAt: true,
          creatorId: false,
          evaluateeId: false
        },
        with: {
          creator: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              password: false,
              role: true,
              email: false
            },
          },
          evaluatee: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              password: false,
              role: true,
              email: false
            },
          },
          answers: {
            columns: {
              id: true,
              optionVersionId: true,
              questionVersionId: true,
              createdAt: false,
              responseId: false,
              feedback: true,
            },
          },
        },
      },
    },
    orderBy: (v, { desc }) => desc(v.createdAt),
  });
}

export type FormVersionsResult = NonNullable<
  Awaited<ReturnType<typeof getAllVersions>>
>;
