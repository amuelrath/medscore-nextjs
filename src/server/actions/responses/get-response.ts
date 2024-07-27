"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {  responses } from "@/db/schema";

export async function getResponse(responseId: string) {
  return db.query.responses.findFirst({
    where: eq(responses.id, responseId),
    with: {
      answers: {
        columns: {
          responseId: false,
          formItemId: false,
          id: true,
          textValue: true,
          selectedOptionIds: true,
        },
        with: {
          formItem: {
            columns: {
              id: true,
              createdAt: true,
              text: true,
              type: true,
              position: true,
              isScored: true,

              formId: false,
              isRequired: false,
              description: false,
            },
            with: {
              milestones: {
                columns: {
                  milestoneId: true,

                  formItemId: false,
                }
              },
              options: {
                orderBy: (o, { asc }) => asc(o.position),
                columns: {
                  id: true,
                  position: true,
                  createdAt: true,
                  text: true,

                  formItemId: false,
                  isNa: true,
                  pointValue: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export type ResponseResult = NonNullable<Awaited<ReturnType<typeof getResponse>>>
