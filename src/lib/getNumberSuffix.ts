export const getNumberSuffix = (percentile: number) => {
  const lastDigit = percentile % 10;
  const lastTwoDigits = percentile % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return "st";
  } else if (lastDigit === 2 && lastTwoDigits !== 12) {
    return "nd";
  } else if (lastDigit === 3 && lastTwoDigits !== 13) {
    return "rd";
  } else {
    return "th";
  }
};
