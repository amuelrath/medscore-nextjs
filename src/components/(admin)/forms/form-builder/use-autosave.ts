import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';

interface AutosaveOptions<T> {
  debounceMs?: number;
  incrementMs?: number;
  data: T;
  saveFn: (data: T, oldData: T) => Promise<void>;
  disabled: boolean;
}

interface AutosaveResult {
  isSaving: boolean;
  remainingTime: number;
  forceSave: () => void;
}

export function useAutosave<T>({
  data,
  saveFn,
  debounceMs = 1000,
  incrementMs = 750,
  disabled = false,
}: AutosaveOptions<T>): AutosaveResult {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const dataRef = useRef<T>(structuredClone(data));
  const saveTimeoutRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const savedVersionRef = useRef<T>(structuredClone(data));
  const wasDisabledRef = useRef<boolean>(disabled);

  // Reset internal references when disabled changes (especially when going from disabled to enabled)
  useEffect(() => {
    // If we're transitioning from disabled to enabled, reset all refs with current data
    if (wasDisabledRef.current && !disabled) {
      console.log(
        'Autosave was disabled and is now enabled - resetting all references with current data',
      );
      dataRef.current = structuredClone(data);
      savedVersionRef.current = structuredClone(data);

      // Clear any pending timers
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      setRemainingTime(0);
    }

    wasDisabledRef.current = disabled;
  }, [disabled, data]);

  // Reset timer with current data
  const resetTimer = (addMs = 0) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Set new remaining time
    const newTime = Math.max(debounceMs, remainingTime + addMs);
    setRemainingTime(newTime);

    // Setup display timer if not already running
    if (!timerIntervalRef.current) {
      const startTime = Date.now();
      const initialRemaining = newTime;

      timerIntervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, initialRemaining - elapsed);

        setRemainingTime(remaining);

        if (remaining <= 0 && timerIntervalRef.current) {
          window.clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      }, 50);
    }

    // Setup actual save timeout
    saveTimeoutRef.current = window.setTimeout(() => {
      if (!disabled) {
        executeSave();
      }
      saveTimeoutRef.current = null;
    }, newTime);
  };

  // Execute save operation
  const executeSave = async () => {
    // Skip if data hasn't changed from last save
    if (isEqual(data, savedVersionRef.current)) return;

    setIsSaving(true);
    console.log('Executing save');

    try {
      await saveFn(data, savedVersionRef.current);
      savedVersionRef.current = structuredClone(data);
      dataRef.current = structuredClone(data);
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      // Even if save fails, we still want to reset UI state
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    }
  };

  // Force save immediately
  const forceSave = () => {
    if (disabled) return;

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setRemainingTime(0);
    executeSave();
  };

  // Detect changes
  useEffect(() => {
    if (!isEqual(dataRef.current, data) && !isSaving && !disabled) {
      // Update our local cache of data
      dataRef.current = structuredClone(data);
      resetTimer(incrementMs); // Add ms for each change detected
    } else if (!isEqual(dataRef.current, data)) {
      // Still update our reference even if we're not scheduling a save
      dataRef.current = structuredClone(data);
    }
  }, [data, debounceMs, isSaving, disabled, incrementMs]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
    },
    [],
  );

  return {
    isSaving,
    remainingTime,
    forceSave,
  };
}
