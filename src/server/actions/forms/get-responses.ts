"use server";
import { db } from "@/db";
import { TResponse } from "@/db/types";

export async function getResponses(
  formVersionId: string,
): Promise<TResponse[]> {
  return db.query.responses.findMany({
    where: (response, { eq }) => eq(response.formVersionId, formVersionId),
    with: {
      answers: true,
      creator: true,
      evaluatee: true,
    },
    orderBy: (response, { asc }) => asc(response.createdAt),
  });
}
