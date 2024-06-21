"use server";

import { db } from "@/db";
import { formCodes, formVersions } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function cancelAdministerForm({
  formId,
}: {
  formId: string | undefined;
}) {
  // grab all versions of this form
  if (!formId) throw new Error("Form Id is required");
  const allVersions = await db.query.formVersions.findMany({
    where: (fv, { eq }) => eq(fv.formId, formId),
    with: {
      code: true,
    },
  });

  // find all codes for this form
  const allCodes = allVersions
    .flatMap((fv) => fv.code)
    .filter((c) => c !== null && c !== undefined);

  // get the most recent code
  const newestCode = allCodes.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];


  if (newestCode) {
    // check if the form has been responded to
    const response = await db.query.responses.findFirst({
      where: (r, { eq }) => eq(r.formVersionId, newestCode.formVersionId),
    });

    // if it has no responses, delete the form version
    if (!response) {
      await db
        .delete(formVersions)
        .where(eq(formVersions.id, newestCode.formVersionId));

      // also delete the code itself
      return db.delete(formCodes).where(eq(formCodes.formVersionId, newestCode.id));
    }


    // deactivate the form code if there are responses
    await db
      .update(formCodes)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(formCodes.id, newestCode.id));
  }


}
