export const formatDate = (date: string | Date) => {
  if (!date) return "";
  if (date instanceof Date) date = date.toISOString();

  const expiresAtDate = new Date(date);
  const now = new Date();

  const isSameDay = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const isYesterday = (date: Date) => {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return isSameDay(date, yesterday);
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return isSameDay(date, tomorrow);
  };

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  if (isSameDay(expiresAtDate, now)) {
    return `Today at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  } else if (isTomorrow(expiresAtDate)) {
    return `Tomorrow at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  } else if (isYesterday(expiresAtDate)) {
    return `Yesterday at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  } else {
    const diffDays = Math.ceil(
      (expiresAtDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
    );
    if (Math.abs(diffDays) <= 7) {
      return `${expiresAtDate.toLocaleDateString([], {
        weekday: "long",
      })} at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
    } else {
      return `${expiresAtDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })} at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
    }
  }
};
