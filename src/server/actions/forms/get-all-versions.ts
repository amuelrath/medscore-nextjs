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
      code: {
        columns: {
          code: true,
          createdAt: true,
          expiresAt: false,
          formVersionId: false,
          id: true,
        },
      },
      questions: {
        columns: {
          formVersionId: false,
          id: true,
          position: true,
          text: true,
          feedback: true,
        },
        with: {
          options: {
            columns: {
              questionVersionId: false,
              id: true,
              text: true,
              position: true,
              pointValue: true,
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
          evaluateeId: false,
        },
        with: {
          creator: {
            columns: {
              id: true,
              password: false,
              role: true,
              lastName: true,
              firstName: true,
              email: false,
            },
          },
          evaluatee: {
            columns: {
              id: true,
              password: false,
              role: true,
              lastName: true,
              firstName: true,
              email: false,
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
