export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  let truncated = str.slice(0, maxLength - 3);

  // Remove trailing spaces
  truncated = truncated.trimEnd();

  return `${truncated}...`;
}
