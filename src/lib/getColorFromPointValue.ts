export const getBgColorFromPointValue = (
  pointValue: number,
  maxPointsAvailable?: number,
) => {
  const positiveColor = "#97c2e8"; // Desaturated blue color for positive values
  const negativeColor = "#f09f9f"; // Desaturated red color for negative values

  const normalizedValue =
    typeof pointValue === "number"
      ? pointValue / (maxPointsAvailable || 1)
      : pointValue && pointValue
        ? Number(pointValue) / (maxPointsAvailable || 1)
        : 0;

  const red = Math.round(
    parseInt(negativeColor.slice(1, 3), 16) * (1 - normalizedValue) +
      parseInt(positiveColor.slice(1, 3), 16) * normalizedValue,
  );
  const green = Math.round(
    parseInt(negativeColor.slice(3, 5), 16) * (1 - normalizedValue) +
      parseInt(positiveColor.slice(3, 5), 16) * normalizedValue,
  );
  const blue = Math.round(
    parseInt(negativeColor.slice(5, 7), 16) * (1 - normalizedValue) +
      parseInt(positiveColor.slice(5, 7), 16) * normalizedValue,
  );

  return `rgb(${red}, ${green}, ${blue})`;
};
