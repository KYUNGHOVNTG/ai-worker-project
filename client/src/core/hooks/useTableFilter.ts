import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseTableFilterOptions<T extends Record<string, unknown>> {
  initialFilters: T;
  debounceDelay?: number;
}

interface UseTableFilterReturn<T extends Record<string, unknown>> {
  filters: T;
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  resetFilters: () => void;
  debouncedFilters: T;
}

export function useTableFilter<T extends Record<string, unknown>>({
  initialFilters,
  debounceDelay = 500,
}: UseTableFilterOptions<T>): UseTableFilterReturn<T> {
  const [filters, setFilters] = useState<T>(initialFilters);

  const debouncedFilters = useDebounce<T>(filters, debounceDelay);

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    setFilter,
    resetFilters,
    debouncedFilters,
  };
}
