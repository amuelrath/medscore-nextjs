import { QuestionClassification } from "@/db/schema";

export class NaiveBayesClassifier {
  private wordCounts: Map<string, Map<number, number>>;
  private readonly classCounts: Map<number, number>;

  constructor() {
    this.wordCounts = new Map();
    this.classCounts = new Map();
  }

  train(data: QuestionClassification[]) {
    for (const item of data) {
      const words = this.tokenize(item.question);
      const classification = item.classification;

      this.classCounts.set(
        classification,
        (this.classCounts.get(classification) || 0) + 1,
      );

      for (const word of words) {
        if (!this.wordCounts.has(word)) {
          this.wordCounts.set(word, new Map());
        }
        const classCount = this.wordCounts.get(word)!;
        classCount.set(
          classification,
          (classCount.get(classification) || 0) + 1,
        );
      }
    }
  }

  predict(question: string): number {
    const words = this.tokenize(question);
    let bestClass = null;
    let maxScore = -Infinity;

    for (const [classification, count] of this.classCounts) {
      let score = Math.log(count / this.classCounts.size);

      for (const word of words) {
        const wordCount = this.wordCounts.get(word);
        if (wordCount && wordCount.has(classification)) {
          score += Math.log(wordCount.get(classification)! / count);
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestClass = classification;
      }
    }

    return bestClass!;
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().match(/\b(\w+)\b/g) || [];
  }
}
