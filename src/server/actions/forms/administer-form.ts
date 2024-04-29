"use server";
import { db } from "@/db";
import {
  formCodes,
  formCodesOnUsers,
  formVersions,
  milestoneOnQuestionVersions,
  optionVersions,
  questionVersions,
} from "@/db/schema";
export async function administerForm(
  formId: string,
  userIds: string[],
  expiresAt: Date
) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const form = await db.query.forms.findFirst({
    where: (f, { eq }) => eq(f.id, formId),
    with: {
      questions: {
        with: {
          options: true,
          milestones: {
            with: {
              milestone: true,
            },
          },
        },
      },
    },
  });

  if (!form) {
    console.error("Form not found!");
    throw new Error("Form not found!");
  }

  try {
    // deep copy the form
    const formCopy = await db
      .insert(formVersions)
      .values({
        formId: form.id,
        title: form.title,
        createdAt: new Date(),
        programId: form.programId,
      })
      .returning();

    if (!formCopy) {
      console.error("Form did not copy!");
      throw new Error("Form did not copy!");
    }

    // copy the questions and their associated options and milestones
    const copiedQuestions = await Promise.all(
      form.questions.map(async (q) => {
        const questionCopy = await db
          .insert(questionVersions)
          .values({
            formVersionId: formCopy[0].id,
            text: q.text,
            feedback: q.feedback,
            position: q.position,
          })
          .returning();

        if (!questionCopy) {
          console.error("Question did not copy!");
          throw new Error("Question did not copy!");
        }

        await Promise.all([
          // copy the options
          ...q.options.map((o) =>
            db.insert(optionVersions).values({
              questionVersionId: questionCopy[0].id,
              text: o.text,
              pointValue: o.pointValue,
              position: o.position,
            })
          ),
          // copy the milestones
          ...q.milestones.map((m) =>
            db.insert(milestoneOnQuestionVersions).values({
              questionVersionId: questionCopy[0].id,
              milestoneId: m.milestoneId,
            })
          ),
        ]);

        return questionCopy[0];
      })
    );

    // create the form code
    const formCode = await db
      .insert(formCodes)
      .values({
        formVersionId: formCopy[0].id,
        code,
        expiresAt,
      })
      .returning();

    // link the form code to the users
    await Promise.all(
      userIds.map((u) =>
        db.insert(formCodesOnUsers).values({
          formCodeId: formCode[0].id,
          userId: u,
        })
      )
    );

    return {
      code: formCode[0].code,
      expiresAt: formCode[0].expiresAt,
    };
  } catch (error) {
    console.error("Error in administerForm:", error);
    throw error;
  }
}
