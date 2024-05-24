import { useCallback, useRef, useState } from "react";

export function useFocusVisible<T extends HTMLElement>() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const ref = useRef<T | null>(null);

  const onFocus = useCallback(() => {
    setIsFocusVisible(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocusVisible(false);
  }, []);

  const onKeyUp = useCallback((event: React.KeyboardEvent<T>) => {
    if (event.key === "Tab") {
      setIsFocusVisible(true);
    }
  }, []);

  return { isFocusVisible, ref, onFocus, onBlur, onKeyUp };
}
