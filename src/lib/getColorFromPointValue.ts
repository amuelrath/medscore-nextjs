export const getBgColorFromPointValue = (percentScore: number) => {
  const positiveColor = "#97c2e8"; // Desaturated blue color for positive values
  const negativeColor = "#f09f9f"; // Desaturated red color for negative values

  // Ensure percentScore is within the range of 0 to 1
  const normalizedValue = Math.max(0, Math.min(1, percentScore));

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
