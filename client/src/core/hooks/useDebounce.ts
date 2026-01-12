/**
 * useDebounce Hook
 *
 * 값의 변경을 지연시켜 불필요한 렌더링/API 호출 방지
 *
 * @example
 * const debouncedValue = useDebounce(searchTerm, 500);
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
