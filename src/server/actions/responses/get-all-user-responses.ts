"use server";
import { db } from "@/db";

export async function getAllUserResponses() {
  const USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID!;

  return db.query.responses.findMany({
    where: (r, { eq }) => eq(r.creatorId, USER_ID),
    columns: {
      id: true,
      creatorId: false,
      status: true,
      assessmentId: false,
      evaluateeId: false,
      createdAt: true,
      duration: false,
    },
    with: {
      evaluatee: {
        columns: {
          id: true,
          email: false,
          password: false,
          lastName: true,
          firstName: true,
          role: false,
        },
      },
      assessment: {
        with: {
          form: {
            columns: {
              id: true,
              creatorId: false,
              type: true,
              lastOpenedAt: false,
              programId: false,
              settings: false,
              title: true,
            },
          },
        },
      },
    },
  });
}
