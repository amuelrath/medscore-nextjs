"use server"


import { NaiveBayesClassifier } from "@/lib/ml/naive-bayes-classifier";
import { getTrainingData } from "@/server/actions/ml/get-training-data";

let classifier: NaiveBayesClassifier | null = null

export async function initializeClassifier() {
  if (!classifier) {
    const trainingData = await getTrainingData()
    classifier = new NaiveBayesClassifier()
    classifier.train(trainingData)
  }
  return classifier
}

export async function getClassifier() {
  return classifier
}