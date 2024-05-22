export interface PercentChangeData {
  createdAt: Date;
  score: number;
  versionId: string;
}

export function calculatePercentChangeFromTotals(totals: PercentChangeData[]) {
  if (totals.length < 2) {
    return {
      percentChangeFromPrevious: 0,
      percentChangeFromFirst: 0,
    };
  }

  const currentScore = totals[totals.length - 1].score;
  const previousScore = totals[totals.length - 2]?.score ?? currentScore;
  const firstScore = totals[0].score;

  const percentChangeFromPrevious =
    ((currentScore - previousScore) / previousScore) * 100;
  const percentChangeFromFirst =
    ((currentScore - firstScore) / firstScore) * 100;

  return {
    percentChangeFromPrevious,
    percentChangeFromFirst,
  };
}
