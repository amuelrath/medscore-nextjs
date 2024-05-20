export interface PercentChangeData {
  createdAt: Date;
  score: number;
  versionId: string;
}

export function calculatePercentChangeFromTotals(
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
