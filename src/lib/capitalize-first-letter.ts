export function capitalizeFirstLetter<T extends string>(str: T): Capitalize<Lowercase<T>> {
  if (str.length === 0) return '' as Capitalize<Lowercase<T>>;
  return (str[0].toUpperCase() + str.slice(1).toLowerCase()) as Capitalize<Lowercase<T>>;
}