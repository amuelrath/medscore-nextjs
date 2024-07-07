"use server";
import { db } from "@/db";
import { responses } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { dateToSQLDate } from "@/lib/helpers/date-to-sql-date";
import { isAfter, isBefore } from "date-fns";

export async function getEvaluationForm({
  responseId,
}: {
  responseId: string;
}) {
  console.log("Received responseId:", responseId);
  const now = dateToSQLDate(new Date());
  const response = await db.query.responses.findFirst({
    where: eq(responses.id, responseId),
    with: {
      formCode: {
        with: {
          form: {
            columns: {
              id: true,
              title: false,
              programId: false,
              creatorId: false,
              lastOpenedAt: false,
            },
          },
        },
      },
    },
  });
  console.log("Query result:", response);

  if (!response)
    throw new Error("Form code not found, expired, or not yet valid");

  if (
    isBefore(now, response.formCode.startsAt) ||
    !isAfter(now, response.formCode.expiresAt) ||
    response.formCode.canceledAt
  )
    throw new Error("Form code has expired or not yet valid");

  const form = await db.query.forms.findFirst({
    where: (f, { eq }) => eq(f.id, response.formCode.formId),
    columns: {
      id: true,
      title: true,
    },
    with: {
      formCodes: {
        limit: 1,
        where: (fc, { eq }) => eq(fc.id, response.formCode.id),
        columns: {
          formId: false,
          code: false,
          id: false,
          title: false,
          isDirectObservation: true,
          canceledAt: true,
          startsAt: true,
          expiresAt: true,
          createdAt: false,
        },
        with: {
          usersWithCode: {
            columns: {
              userId: false,
              formCodeId: false,
              deletedAt: false,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                  email: false,
                  password: false,
                },
              },
            },
          },
        },
      },
      questions: {
        columns: {
          id: true,
          position: true,
          text: true,
          feedback: true,
        },
        with: {
          options: {
            columns: {
              id: true,
              questionId: true,
              text: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!form) throw new Error("form not found");

  return { form, response };
}

export type EvaluationFormResult = Awaited<
  ReturnType<typeof getEvaluationForm>
>;
