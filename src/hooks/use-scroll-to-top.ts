import { useEffect, useRef } from 'react';

export const useScrollToTopOnChange = (value: unknown): void => {
  const previous = useRef(value);
  useEffect(() => {
    if (previous.current !== value) {
      previous.current = value;
      window.scrollTo(0, 0);
    }
  }, [value]);
};
