interface DataPoint {
  date: Date;
  score: number; // between 0 and 100
}

type Trend =
  | "sharp upward"
  | "gradual upward"
  | "gradual downward"
  | "sharp downward"
  | "steady";

type TrendDescription =
  | "maintaining consistent performance"
  | "showing significant improvement"
  | "indicating steady progress"
  | "indicating a need for attention"
  | "suggesting areas for improvement"
  | "showing variable performance";

type VolatilityDescription =
  | "remarkably stable"
  | "somewhat variable"
  | "moderately inconsistent"
  | "highly inconsistent";

type TrendAdherenceDescription =
  | "highly consistent with the overall trend"
  | "generally following the trend with some deviations"
  | "showing significant deviations from the trend"
  | "highly inconsistent with the overall trend";

export type AnalyzeTrendResult = {
  trend: Trend;
  trendDescription: TrendDescription;
  trendAdherenceDescription: TrendAdherenceDescription;
  slope: number;
  averageChange: number;
  totalChange: number;
  volatility: number;
  trendAdherence: number;
}

export function analyzeTrend(data: DataPoint[], allowedDeviation: number = 10): {
  trend: Trend;
  trendDescription: TrendDescription;
  volatilityDescription: VolatilityDescription;
  trendAdherenceDescription: TrendAdherenceDescription;
  slope: number;
  averageChange: number;
  totalChange: number;
  volatility: number;
  trendAdherence: number;
} {
  if (data.length < 2) {
    throw new Error("At least two data points are required for trend analysis");
  }

  // Sort data by date
  const sortedData = data.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate slope using first and last points
  const firstPoint = sortedData[0];
  const lastPoint = sortedData[sortedData.length - 1];
  const timeDiff = (lastPoint.date.getTime() - firstPoint.date.getTime()) / (1000 * 60 * 60 * 24); // Convert to days
  const slope = (lastPoint.score - firstPoint.score) / timeDiff;

  // Calculate total change
  const totalChange = lastPoint.score - firstPoint.score;

  // Calculate average change
  const averageChange = totalChange / timeDiff;

  // Calculate volatility (standard deviation of changes)
  const changes = sortedData
    .slice(1)
    .map((point, index) => point.score - sortedData[index].score);
  const volatility = Math.sqrt(
    changes.reduce(
      (sum, change) => sum + Math.pow(change - averageChange, 2),
      0
    ) / changes.length
  );

  // Dynamic thresholds based on the time period and score range
  const maxPossibleChange = 100; // Maximum possible change in score (0 to 100)
  const gradualThresholdPerDay = (maxPossibleChange * 0.1) / 30; // 10% of max change per month
  const sharpThresholdPerDay = (maxPossibleChange * 0.2) / 30; // 20% of max change per month

  // Determine trend
  let trend: Trend;
  let trendDescription: TrendDescription;

  if (Math.abs(slope) < gradualThresholdPerDay) {
    trend = "steady";
    trendDescription = "maintaining consistent performance";
  } else if (slope >= sharpThresholdPerDay) {
    trend = "sharp upward";
    trendDescription = "showing significant improvement";
  } else if (slope >= gradualThresholdPerDay) {
    trend = "gradual upward";
    trendDescription = "indicating steady progress";
  } else if (slope <= -sharpThresholdPerDay) {
    trend = "sharp downward";
    trendDescription = "indicating a need for attention";
  } else if (slope <= -gradualThresholdPerDay) {
    trend = "gradual downward";
    trendDescription = "suggesting areas for improvement";
  } else {
    trend = slope > 0 ? "gradual upward" : "gradual downward";
    trendDescription = slope > 0 ? "indicating steady progress" : "suggesting areas for improvement";
  }

  // Calculate trend adherence
  const expectedScores = sortedData.map((point) => {
    const daysSinceStart = (point.date.getTime() - firstPoint.date.getTime()) / (1000 * 60 * 60 * 24);
    return firstPoint.score + slope * daysSinceStart;
  });

  const deviations = sortedData.map((point, index) =>
    Math.abs(point.score - expectedScores[index])
  );

  // Calculate the average deviation as a percentage of the total score range
  const averageDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / sortedData.length;
  const trendAdherence = 1 - (averageDeviation / maxPossibleChange);

  // Determine trend adherence description with stricter thresholds
  let trendAdherenceDescription: TrendAdherenceDescription;
  if (trendAdherence > 0.95) {
    trendAdherenceDescription = "highly consistent with the overall trend";
  } else if (trendAdherence > 0.85) {
    trendAdherenceDescription = "generally following the trend with some deviations";
  } else if (trendAdherence > 0.75) {
    trendAdherenceDescription = "showing significant deviations from the trend";
  } else {
    trendAdherenceDescription = "highly inconsistent with the overall trend";
  }

  // Determine volatility description
  let volatilityDescription: VolatilityDescription;
  const volatilityThreshold = 5; // 5 points per day

  if (volatility < volatilityThreshold * 0.5) {
    volatilityDescription = "remarkably stable";
  } else if (volatility < volatilityThreshold) {
    volatilityDescription = "somewhat variable";
  } else if (volatility < volatilityThreshold * 2) {
    volatilityDescription = "moderately inconsistent";
  } else {
    volatilityDescription = "highly inconsistent";
  }

  return {
    trend,
    trendDescription,
    volatilityDescription,
    trendAdherenceDescription,
    slope,
    averageChange,
    totalChange,
    volatility,
    trendAdherence,
  };
}