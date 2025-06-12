export interface ObjectDiff {
  path: string[];
  operation: 'add' | 'remove' | 'update';
  value: any;
  oldValue?: any;
}

interface DiffObjects<T> {
  oldObj: T;
  newObj: T;
  path?: string[];
  idField?: string;
}

// Core diffing function
export function diffObjects<T extends Record<string, any>>({
  oldObj,
  newObj,
  path = [],
  idField = 'id',
}: DiffObjects<T>): ObjectDiff[] {
  const diffs: ObjectDiff[] = [];

  // Handle null/undefined objects
  if (!oldObj && !newObj) return diffs;
  if (!oldObj) return [{ path, operation: 'add', value: newObj }];
  if (!newObj) return [{ path, operation: 'remove', value: oldObj }];

  // Get all keys from both objects
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  for (const key of allKeys) {
    const currentPath = [...path, key];
    const oldValue = oldObj[key];
    const newValue = newObj[key];

    // Key exists in both objects
    if (key in oldObj && key in newObj) {
      // If values are arrays of objects with IDs, handle specially
      if (
        Array.isArray(oldValue) &&
        Array.isArray(newValue) &&
        ((oldValue.length > 0 &&
          typeof oldValue[0] === 'object' &&
          idField in oldValue[0]) ||
          (newValue.length > 0 &&
            typeof newValue[0] === 'object' &&
            idField in newValue[0]))
      ) {
        // Create maps for quick lookup by ID
        const oldMap = new Map(oldValue.map((item) => [item[idField], item]));
        const newMap = new Map(newValue.map((item) => [item[idField], item]));

        // Find added items
        for (const [id, item] of newMap.entries()) {
          if (!oldMap.has(id)) {
            diffs.push({
              path: [...currentPath],
              operation: 'add',
              value: { id, item },
            });
          }
        }

        // Find removed items
        for (const [id, item] of oldMap.entries()) {
          if (!newMap.has(id)) {
            diffs.push({
              path: [...currentPath],
              operation: 'remove',
              value: { id, item },
            });
          }
        }

        // Find modified items
        for (const [id, newItem] of newMap.entries()) {
          if (oldMap.has(id)) {
            const oldItem = oldMap.get(id)!;
            const itemDiffs = diffObjects({
              oldObj: oldItem,
              newObj: newItem,
              path: [...currentPath, id],
              idField,
            });
            diffs.push(...itemDiffs);
          }
        }
      }
      // Handle basic values or non-array objects
      else if (
        typeof oldValue === 'object' &&
        typeof newValue === 'object' &&
        !Array.isArray(oldValue) &&
        !Array.isArray(newValue) &&
        oldValue !== null &&
        newValue !== null
      ) {
        // Recursively diff nested objects
        const nestedDiffs = diffObjects({
          oldObj: oldValue,
          newObj: newValue,
          path: currentPath,
          idField,
        });
        diffs.push(...nestedDiffs);
      }
      // Handle arrays of primitive values (like strings, numbers)
      else if (
        Array.isArray(oldValue) &&
        Array.isArray(newValue) &&
        (oldValue.length === 0 || typeof oldValue[0] !== 'object') &&
        (newValue.length === 0 || typeof newValue[0] !== 'object')
      ) {
        // Find added items
        const added = newValue.filter((item) => !oldValue.includes(item));
        if (added.length > 0) {
          diffs.push({
            path: currentPath,
            operation: 'add',
            value: added,
          });
        }

        // Find removed items
        const removed = oldValue.filter((item) => !newValue.includes(item));
        if (removed.length > 0) {
          diffs.push({
            path: currentPath,
            operation: 'remove',
            value: removed,
          });
        }
      }
      // Simple value has changed
      else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        diffs.push({
          path: currentPath,
          operation: 'update',
          value: newValue,
          oldValue,
        });
      }
    }
    // Key only in new object
    else if (!(key in oldObj) && key in newObj) {
      diffs.push({
        path: currentPath,
        operation: 'add',
        value: newValue,
      });
    }
    // Key only in old object
    else if (key in oldObj && !(key in newObj)) {
      diffs.push({
        path: currentPath,
        operation: 'remove',
        value: oldValue,
      });
    }
  }

  return diffs;
}
