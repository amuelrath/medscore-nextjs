"use server";
import { db } from "@/db";
import { ResponseColumn } from "@/db/types";

export async function getResponses(formId: string) {
  const query = await db.query.formVersions.findMany({
    where: (formVersion, { eq }) => eq(formVersion.formId, formId),
    with: {
      responses: {
        with: {
          formVersions: {
            with: {
              program: true,
            },
          },
          answers: true,
          creator: true,
          evaluatee: true,
        },
        where: (response, { isNull }) => isNull(response.deletedAt),
      },
    },
  });

  const responses = query.flatMap((f) => f.responses);

  const transformData = (d: typeof responses): ResponseColumn[] => {
    let result: ResponseColumn[] = [];

    d.forEach((response) => {
      const transformedResponse = {
        id: response.id,
        creatorFullName: `${response.creator.firstName} ${response.creator.lastName}`,
        evaluateeFullName: `${response.evaluatee.firstName} ${response.evaluatee.lastName}`,
        formName: response.formVersions.title,
        formProgramName: response.formVersions.program.name,
        createdAt: response.createdAt,
        deletedAt: null,
      };

      result.push(transformedResponse);
    });

    return result;
  };

  return { columns: transformData(responses), responses: responses };
}
