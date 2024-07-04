"use server";

import { db } from "@/db";
import {
  CompetencyNumbers,
  generateClassification,
  NewQuestionClassification,
  questionClassifications,
  recommendedMilestones,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addTrainingData({
  recommendationId,
  isPositive,
}: {
  recommendationId: string;
  isPositive: boolean;
}) {
  // get the recommendation
  const recData = await db.query.recommendedMilestones.findFirst({
    where: eq(recommendedMilestones.id, recommendationId),
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
      `Couldn't find a recommendation of the id "${recommendationId}"`,
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
    recommendationId,
    question,
    competency,
    subcompetencyLevel,
    milestoneLevel,
    milestoneSublevel,
    classification,
    isPositiveClassification: isPositive,
  };

  // first ensure this question hasn't already been added
  const isAlreadyAdded = await db.query.questionClassifications.findFirst({
    where: eq(questionClassifications.recommendationId, recommendationId),
  });

  if (isAlreadyAdded)
    return console.log("Question is already used in training data.");

  // add the training data into the db
  try {
    await db.insert(questionClassifications).values(trainingData);
    console.log("Added training data.");
  } catch (error) {
    return console.error("Error inserting classification into db: ", error);
  }
}
