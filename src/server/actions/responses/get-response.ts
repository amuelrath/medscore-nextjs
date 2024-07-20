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
          id: false,
          textValue: true,
          selectedOptionIds: true,
        },
        with: {
          formItem: {
            columns: {
              id: true,
              createdAt: true,
              text: true,
              formId: false,
              type: true,
              position: true,
              isScored: false,
              isRequired: false,
              description: false,
            },
            with: {
              options: {
                orderBy: (o, { asc }) => asc(o.position),
                columns: {
                  id: true,
                  position: true,
                  createdAt: true,
                  formItemId: false,
                  text: true,
                  isNa: true,
                  pointValue: false,
                },
              },
            },
          },
        },
      },
    },
  });
}
