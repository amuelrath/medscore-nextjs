"use server";

import { db } from "@/db";
import {
  CompetencyNumbers,
  generateClassification,
  NewQuestionClassification,
  questionClassifications,
  recommendedMilestones,
} from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function addTrainingData({
  recommendationId,
  isPositiveClassification,
}: {
  recommendationId: string;
  isPositiveClassification: boolean;
}) {
  // get the recommendation
  const recData = await db.query.recommendedMilestones.findFirst({
    where: and(
      eq(recommendedMilestones.id, recommendationId),
      isNull(recommendedMilestones.isPositiveClassification),
    ),
    with: {
      question: {
        columns: {
          id: false,
          formId: false,
          position: false,
          feedback: false,
          text: true,
        },
      },
      milestones: {
        columns: {
          id: false,
          name: false,
          description: false,
          subcompetencyId: false,
          sublevel: true,
          level: true,
        },
        with: {
          subcompetencies: {
            columns: {
              id: false,
              name: false,
              specialtyId: false,
              competencyId: false,
              level: true,
            },
            with: {
              competencies: {
                columns: {
                  id: false,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!recData)
    throw new Error(
      `Couldn't find a recommendation of the id "${recommendationId} or it was already added."`,
    );
  if (!recData.question.text)
    throw new Error("Aborting: Question text is empty.");
  // extract data for readability
  const question = recData.question.text;
  const competency = recData.milestones.subcompetencies.competencies
    .name as keyof typeof CompetencyNumbers;
  const subcompetencyLevel = recData.milestones.subcompetencies.level;
  const milestoneLevel = recData.milestones.level;
  const milestoneSublevel = recData.milestones.sublevel;
  const classification = generateClassification(
    competency,
    subcompetencyLevel,
    milestoneLevel,
    milestoneSublevel,
  );

  // extract the milestone with relations and question text
  const trainingData: NewQuestionClassification = {
    question,
    competency,
    subcompetencyLevel,
    milestoneLevel,
    milestoneSublevel,
    classification,
    isPositiveClassification,
  };

  try {
    await db.transaction(async (tx) => {
      // add the training data into the db
      await tx.insert(questionClassifications).values(trainingData);
      // update the rec to reflect that feedback was submitted
      await tx
        .update(recommendedMilestones)
        .set({ isPositiveClassification })
        .where(eq(recommendedMilestones.id, recommendationId));
    });
    console.log("Added training data.");
  } catch (error) {
    return console.error("Error inserting classification into db: ", error);
  }
}
