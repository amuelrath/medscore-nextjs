"use server";

import { db } from "@/db";

export async function getAllFormsLite({ userId }: { userId: string }) {
  return db.query.forms.findMany({
    where: (f, { eq }) => eq(f.creatorId, userId),
    columns: {
      id: true,
      title: true,
      programId: false,
      creatorId: false,
      lastOpenedAt: true,
    },
    with: {
      tags: {
        columns: {
          formId: false,
          variant: true,
          tag: true,
          id: true,
        },
      },
      programs: {
        columns: {
          id: true,
          name: true,
          specialtyId: true,
          description: false,
        },
        with: {
          users: {
            columns: {
              userId: false,
              programId: false,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  role: false,
                  password: false,
                  email: false,
                  lastName: true,
                  firstName: true
                },
                // todo somehow get only the users whose role is "STUDENT"
              }
            }
          }
        }
      },
    },
  });
}

export type FormsLiteResult = NonNullable<
  Awaited<ReturnType<typeof getAllFormsLite>>
>;

export async function getFormLiteById({ formId }: { formId: string }) {
  return db.query.forms.findFirst({
    where: (f, { eq }) => eq(f.id, formId),
    columns: {
      id: true,
      title: true,
      programId: false,
      creatorId: false,
      lastOpenedAt: true,
    },
    with: {
      tags: {
        columns: {
          formId: false,
          variant: true,
          tag: true,
          id: true,
        },
      },
      programs: {
        columns: {
          id: true,
          name: true,
          specialtyId: true,
          description: false,
        },
      },
    },
  });
}

export type FormLiteResult = NonNullable<
  Awaited<ReturnType<typeof getFormLiteById>>
>;
