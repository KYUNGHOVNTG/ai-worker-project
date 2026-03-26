import { useState, useCallback, useMemo } from 'react';
import type { PaginationProps } from '../ui/Pagination';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  paginationProps: (total: number) => PaginationProps;
}

export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 20 } = options;

  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const setPage = useCallback((newPage: number) => {
    setPageState(Math.max(1, newPage));
  }, []);

  const setPageSize = useCallback((newPageSize: number) => {
    setPageSizeState(newPageSize);
    setPageState(1);
  }, []);

  const paginationProps = useCallback(
    (total: number): PaginationProps => ({
      total,
      page,
      pageSize,
      onPageChange: setPage,
      onPageSizeChange: setPageSize,
    }),
    [page, pageSize, setPage, setPageSize]
  );

  return useMemo(
    () => ({ page, pageSize, setPage, setPageSize, paginationProps }),
    [page, pageSize, setPage, setPageSize, paginationProps]
  );
}
