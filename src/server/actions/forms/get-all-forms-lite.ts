"use server";

import { db } from "@/db";
import { dateToSQLDate } from "@/lib/helpers/date-to-sql-date";
import { sql } from "drizzle-orm";

export async function getAllFormsLite({ userId }: { userId: string }) {
  const now = dateToSQLDate(new Date());
  return db.query.forms.findMany({
    where: (f, { eq }) => eq(f.creatorId, userId),
    columns: {
      id: true,
      title: true,
      programId: false,
      creatorId: false,
      lastOpenedAt: true,
    },
    // TODO maybe fetch this sep. ? this is used in only the upcoming assessments card
    with: {
      assessments: {
        where: (fc, { and, isNull }) =>
          and(sql`${fc.startsAt} > ${now}::timestamp`, isNull(fc.canceledAt)),
        columns: {
          formId: false,
          title: true,
          id: true,
          createdAt: false,
          code: false,
          isDirectObservation: false,
          startsAt: true,
          expiresAt: true,
        },
      },
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
                  role: true,
                  password: false,
                  email: false,
                  lastName: true,
                  firstName: true,
                },
                // todo somehow get only the users whose role is "STUDENT"
              },
            },
          },
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
