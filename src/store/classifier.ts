import { atom } from 'jotai'
import { NaiveBayesClassifier } from "@/lib/ml/naive-bayes-classifier";

export const classifierAtom = atom<NaiveBayesClassifier | null>(null)