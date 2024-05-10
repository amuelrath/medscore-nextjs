export const formatDate = (date: string) => {
  if (!date) return "";

  const expiresAtDate = new Date(date);
  const now = new Date();
  const diffTime = expiresAtDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  if (diffDays === 0) {
    return `Today at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  } else if (diffDays === 1) {
    return `Tomorrow at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  } else if (diffDays > 1 && diffDays <= 7) {
    return `${expiresAtDate.toLocaleDateString([], {
      weekday: "long",
    })} at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  } else {
    return `${expiresAtDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })} at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  }
};
