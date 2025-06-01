export function findDuplicates(arr: string[]): string[] | [] {
  const seen: Set<string> = new Set();
  const duplicates: Set<string> = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return duplicates.size > 0 ? Array.from(duplicates) : [];
}
