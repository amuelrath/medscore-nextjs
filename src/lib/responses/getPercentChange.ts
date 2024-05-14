import { TFormVersion, TQuestionRelate } from "@/db/types";
import { getTotalPointsEarned } from "@/lib/responses/getTotalPointsEarned";
import { Answer } from "@/db/schema";
import { COMPETENCIES } from "@/db/constants";

export function getPercentChangeOverall(
  evaluateeId: string,
  formVersions: TFormVersion[],
  currentVersionId: string,
) {
  if (!formVersions || !evaluateeId || !currentVersionId) return null;

  // Grab all responses that were for the evaluatee across all formVersions
  const allEvaluateeResponses = formVersions.flatMap((v) =>
    v.responses?.find((r) => r.evaluatee.id === evaluateeId),
  );

  if (!allEvaluateeResponses || allEvaluateeResponses.length === 0) {
    return null;
  }

  // Grab the form versions from those responses
  const versions = formVersions.filter((v) =>
    allEvaluateeResponses.map((r) => r?.formVersionId).includes(v.id),
  );

  if (!versions || versions.length === 0) {
    throw new Error("Couldn't locate versions from their responses.");
  }

  // Calculate the scores and percent changes across multiple formVersions
  const percentChange = () => {
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

        const totalPoints = getTotalPointsEarned(
          v.questions as unknown as TQuestionRelate[],
          answers as unknown as Answer[],
        );

        const pointsEarned = totalPoints?.pointsEarned || 0;
        const pointsAvailable = totalPoints?.pointsAvailable || 1;
        const percent = pointsEarned / pointsAvailable;

        return {
          createdAt: v.createdAt,
          score: percent,
          versionId: v.id,
        };
      })
      .filter(
        (
          total,
        ): total is { createdAt: Date; score: number; versionId: string } =>
          total !== null,
      );

    if (totals.length < 2) {
      return null;
    }

    // Find the index of the current version in the 'totals' array
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
  };

  return percentChange();
}

export function getPercentChangeByCompetency(
  evaluateeId: string,
  formVersions: TFormVersion[],
  currentVersionId: string,
  competencyName: keyof typeof COMPETENCIES,
) {
  return 0;
}
