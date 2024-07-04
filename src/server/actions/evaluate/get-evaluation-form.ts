"use server";
import { db } from "@/db";
import { formCodes } from "@/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { dateToSQLDate } from "@/lib/date-to-sql-date";

class FormError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "FormError";
  }
}

export async function getEvaluationForm({
  formCodeId,
}: {
  formCodeId: string;
}) {
  try {
    const now = dateToSQLDate(new Date());
    const formCode = await db.query.formCodes.findFirst({
      where: and(
        eq(formCodes.id, formCodeId),
        isNull(formCodes.canceledAt),
        sql`${formCodes.expiresAt} > ${now}::timestamp`,
        sql`${formCodes.startsAt} <= ${now}::timestamp`,
      ),
      columns: {
        formId: true,
      },
    });

    if (!formCode) {
      return {
        error: new FormError(
          "Form code not found, expired, or not yet valid",
          "INVALID_FORM_CODE",
        ),
      };
    }

    const form = await db.query.forms.findFirst({
      where: (f, { eq }) => eq(f.id, formCode.formId),
      columns: {
        id: true,
        title: true,
      },
      with: {
        formCodes: {
          limit: 1,
          where: (fc, { eq }) => eq(fc.id, formCodeId),
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

    if (!form) {
      return { error: new FormError("Form not found", "FORM_NOT_FOUND") };
    }

    return { form };
  } catch (error) {
    console.error("Error in getEvaluationForm:", error);
    return {
      error: new FormError("An unexpected error occurred", "UNEXPECTED_ERROR"),
    };
  }
}

export type EvaluationFormResult = Awaited<
  ReturnType<typeof getEvaluationForm>
>;
