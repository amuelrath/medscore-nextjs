"use server";
import { db } from "@/db";
import { NonNullable } from "@/server/actions/forms/get-one-form";
import { DateToString } from "@/db/utils";

export async function getOneVersion(formVersionId: string) {
  return db.query.formVersions.findFirst({
    where: (version, { eq }) => eq(version.id, formVersionId),
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
          deletedAt: false,
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
            with: {
              milestone: {
                columns: {
                  level: false,
                  sublevel: false,
                  subcompetencyId: false,
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
          deletedAt: false,
          updatedAt: false,
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
          answers: {
            columns: {
              id: true,
              deletedAt: false,
              createdAt: false,
              questionVersionId: true,
              optionVersionId: true,
              updatedAt: false,
              responseId: false,
              feedback: true,
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
  });
}

export type FormVersionResult = NonNullable<
  DateToString<Awaited<ReturnType<typeof getOneVersion>>>
>;
