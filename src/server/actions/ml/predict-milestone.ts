// app/actions/suggestMilestone.ts
"use server";


import { getClassifier, initializeClassifier } from "@/server/actions/ml/initialize-classifier";
import { pickBestMilestone } from "@/server/actions/ai/recommend-milestone";

export async function suggestMilestoneWithClassifier({
  formTitle,
  questionId,
  questionText,
}: {
  formTitle: string;
  questionId: string;
  questionText: string;
}) {
  await initializeClassifier();
  const classifier = await  getClassifier();

  let predictedClassification;
  if (classifier) {
    predictedClassification = classifier.predict(questionText);
  }

  return pickBestMilestone({
    formTitle,
    questionId,
    predictedClassification,
  });
}
