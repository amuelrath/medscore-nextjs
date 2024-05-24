"use server";
import { db } from "@/db";
import { DateToString } from "@/db/utils";

export async function getAllVersions(formId: string) {
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
          milestones: {
            columns: { questionVersionId: false, milestoneId: false },
            with: {
              milestone: {
                columns: {
                  level: false,
                  sublevel: false,
                  subcompetencyId: false,
                },
                with: {
                  subcompetencies: {
                    columns: {
                      level: false,
                      specialtyId: false,
                      competencyId: false,
                    },
                    with: {
                      competencies: true,
                    },
                  },
                },
              },
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
          answers: {
            columns: {
              id: true,
              optionVersionId: true,
              questionVersionId: true,
              feedback: true,
              createdAt: false,
              responseId: false,
            },
          },
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
  DateToString<Awaited<ReturnType<typeof getAllVersions>>>
>;
