'use client'

import { useEffect, useState } from 'react';

export function useSelection<K, T extends Array<K>>(
  items: T,
  setSelection: (item: K, idx: number) => void,
) {
  const [selectionIndex, setSelectionIndex] = useState<number>(0);

  useEffect(() => {
    const item = items[selectionIndex];
    if (item) {
      setSelection(item, selectionIndex);
    }
    // KEEP THIS
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectionIndex]);

  return [setSelectionIndex];
}
