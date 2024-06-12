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
          color: true,
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
          color: true,
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
