// percentChangeCalculator.ts
import { TFormVersion, TQuestionRelate } from "@/db/types";
import {
  getFilteredQuestionsAndAnswers,
  getPointsEarnedAndAvailable,
} from "./utils";
import { COMPETENCIES } from "@/db/constants";
import { Answer } from "@/db/schema";

interface PercentChangeData {
  createdAt: Date;
  score: number;
  versionId: string;
}

function calculatePercentChange(
  totals: PercentChangeData[],
  currentVersionId: string,
) {
  if (totals.length < 2) {
    return null;
  }

  const currentVersionIndex = totals.findIndex(
    (total) => total.versionId === currentVersionId,
  );

  if (currentVersionIndex === -1) {
    return null;
  }

  const currentScore = totals[currentVersionIndex].score;
  const previousScore = totals[currentVersionIndex - 1]?.score;
  const firstScore = totals[0].score;

  if (previousScore === undefined || firstScore === undefined) {
    return null;
  }

  const percentChangeFromPrevious =
    ((currentScore - previousScore) / previousScore) * 100;
  const percentChangeFromFirst =
    ((currentScore - firstScore) / firstScore) * 100;

  return {
    percentChangeFromPrevious,
    percentChangeFromFirst,
  };
}

export function getPercentChange(
  evaluateeId: string,
  formVersions: TFormVersion[],
  currentVersionId: string,
  competencyName?: keyof typeof COMPETENCIES,
) {
  if (!formVersions || !evaluateeId || !currentVersionId) return null;

  const allEvaluateeResponses = formVersions.flatMap((v) =>
    v.responses?.find((r) => r.evaluatee.id === evaluateeId),
  );

  if (!allEvaluateeResponses || allEvaluateeResponses.length === 0) {
    return null;
  }

  const versions = formVersions.filter((v) =>
    allEvaluateeResponses.map((r) => r?.formVersionId).includes(v.id),
  );

  if (!versions || versions.length === 0) {
    throw new Error("Couldn't locate versions from their responses.");
  }

  const totals = versions
    .map((v) => {
      const responses = allEvaluateeResponses.filter(
        (r) => r?.formVersionId === v.id,
      );

      if (!responses || responses.length === 0) {
        return null;
      }

      const answers = responses.flatMap((a) => a?.answers);

      if (!answers || answers.length === 0) {
        return null;
      }

      let questions = v.questions as unknown as TQuestionRelate[] | undefined;
      let filteredAnswers = answers as unknown as Answer[] | undefined;

      if (competencyName) {
        const { filteredQuestions, filteredAnswers: competencyAnswers } =
          getFilteredQuestionsAndAnswers(
            competencyName,
            questions,
            answers as unknown as Answer[],
          );
        questions = filteredQuestions;
        filteredAnswers = competencyAnswers;
      }

      const { pointsEarned, pointsAvailable } = getPointsEarnedAndAvailable(
        questions,
        filteredAnswers,
      );

      const percent = (pointsEarned || 0) / (pointsAvailable || 0);

      return {
        createdAt: v.createdAt,
        score: percent,
        versionId: v.id,
      };
    })
    .filter((total): total is PercentChangeData => total !== null);

  return calculatePercentChange(totals, currentVersionId);
}

export function getCompetencyPercentages(
  questions: TQuestionRelate[] | undefined,
  answers: Answer[] | undefined,
) {
  if (!questions || !answers) return null;
  const competencyPercentages: Record<string, number> = {};

  for (const competencyName in COMPETENCIES) {
    const { filteredQuestions, filteredAnswers } =
      getFilteredQuestionsAndAnswers(
        competencyName as keyof typeof COMPETENCIES,
        questions,
        answers,
      );
    const pointsData = getPointsEarnedAndAvailable(
      filteredQuestions,
      filteredAnswers,
    );

    const pointsEarned = pointsData?.pointsEarned ?? 0;
    const pointsAvailable = pointsData?.pointsAvailable ?? 0;

    competencyPercentages[competencyName] =
      pointsAvailable > 0 ? (pointsEarned / pointsAvailable) * 100 : 0;
  }
  return competencyPercentages;
}

/**
 * Calculates the percentage of evaluatees who performed consistently well or poorly on a specific question.
 *
 * @param formVersions - An array of form versions containing responses and questions.
 * @param evaluateeIds - An array of evaluatee IDs to consider in the calculation.
 * @param questionId - The ID of the question for which to calculate the consistency score.
 * @param goodThreshold - The percentage threshold above which a score is considered good.
 * @param badThreshold - The percentage threshold below which a score is considered bad.
 * @returns An object containing the percentage of evaluatees who performed consistently well (consistentlyGoodPercentage)
 *          and the percentage of evaluatees who performed consistently poorly (consistentlyBadPercentage) on the specified question.
 */
export function getQuestionConsistencyScore(
  formVersions: TFormVersion[],
  evaluateeIds: string[],
  questionId: string,
  goodThreshold: number,
  badThreshold: number,
): {
  consistentlyGoodPercentage: number;
  consistentlyBadPercentage: number;
} {
  const latestVersion = formVersions.reduce((latest, version) =>
    version.createdAt > latest.createdAt ? version : latest,
  );

  const questionScores = evaluateeIds.map((evaluateeId) => {
    const response = latestVersion.responses?.find(
      (r) => r.evaluatee.id === evaluateeId,
    );
    const answer = response?.answers.find(
      (a) => a.questionVersionId === questionId,
    );

    if (!answer) return 0;

    const question = latestVersion.questions?.find(
      (q) => q.id === questionId,
    ) as unknown as TQuestionRelate;

    const { pointsEarned, pointsAvailable } = getPointsEarnedAndAvailable(
      [question],
      [answer],
    );
    return (pointsAvailable || 0) > 0
      ? (pointsEarned || 0) / (pointsAvailable || 0)
      : 0;
  });

  const consistentlyGoodCount = questionScores.filter(
    (score) => score >= goodThreshold,
  ).length;
  const consistentlyBadCount = questionScores.filter(
    (score) => score <= badThreshold,
  ).length;

  const consistentlyGoodPercentage =
    (consistentlyGoodCount / questionScores.length) * 100;
  const consistentlyBadPercentage =
    (consistentlyBadCount / questionScores.length) * 100;

  return {
    consistentlyGoodPercentage,
    consistentlyBadPercentage,
  };
}
