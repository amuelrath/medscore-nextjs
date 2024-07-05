'use server'
import { NaiveBayesClassifier } from "@/lib/ml/naive-bayes-classifier";
import { getTrainingData } from "@/server/actions/ml/get-training-data";

export async function trainAndUseModel() {
  const trainingData = await getTrainingData();
  const classifier = new NaiveBayesClassifier();
  classifier.train(trainingData);

  // Example usage
  const newQuestion = "How well does the resident communicate with patients?";
  const predictedClassification = classifier.predict(newQuestion);
  console.log(`Predicted classification: ${predictedClassification}`);
}