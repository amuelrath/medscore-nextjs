import { useState, useCallback, useEffect } from "react";

type FilterFunction<T> = (
  item: T,
  filters: Partial<Record<string, any>>,
) => boolean;

function createFilterFunction<T>(
  filters: Partial<Record<string, any>>,
): FilterFunction<T> {
  return (item: T, currentFilters: Partial<Record<string, any>>): boolean => {
    return Object.entries(currentFilters).every(([path, filterValue]) => {
      const properties = path.split(".");
      let currentValue: any = item;

      for (const property of properties) {
        if (Array.isArray(currentValue)) {
          return currentValue.some((nestedItem) =>
            createFilterFunction({ [property]: filterValue })(nestedItem, {
              [property]: filterValue,
            }),
          );
        } else if (
          typeof currentValue === "object" &&
          property in currentValue
        ) {
          currentValue = currentValue[property];
        } else {
          return false;
        }
      }

      if (typeof currentValue === "string" && typeof filterValue === "string") {
        return currentValue.toLowerCase().includes(filterValue.toLowerCase());
      }

      return currentValue === filterValue;
    });
  };
}

export function useFilter<T>(
  items: T[],
): [
  T[],
  (filters: Partial<Record<string, any>>, merge?: boolean) => void,
  () => void,
  (filterKey: string) => void,
  Partial<Record<string, any>>,
] {
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [activeFilters, setActiveFilters] = useState<
    Partial<Record<string, any>>
  >({});

  const filterItems = useCallback(() => {
    const filterFunction = createFilterFunction(activeFilters);
    const filtered = items.filter((item) =>
      filterFunction(item, activeFilters),
    );
    setFilteredItems(filtered);
  }, [items, activeFilters]);

  useEffect(() => {
    filterItems();
  }, [items, filterItems]);

  const setFilter = useCallback(
    (filters: Partial<Record<string, any>>, merge = true) => {
      const updatedFilters = merge ? { ...activeFilters, ...filters } : filters;
      setActiveFilters(updatedFilters);
    },
    [activeFilters],
  );

  const resetFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const removeFilter = useCallback(
    (filterKey: string) => {
      const updatedFilters = { ...activeFilters };
      delete updatedFilters[filterKey];
      setActiveFilters(updatedFilters);
    },
    [activeFilters],
  );

  return [filteredItems, setFilter, resetFilters, removeFilter, activeFilters];
}
