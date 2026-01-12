/**
 * useApi Hook (Skeleton)
 *
 * API 호출을 위한 커스텀 훅
 * 로딩, 에러, 데이터 상태를 자동으로 관리
 *
 * @example
 * const { data, loading, error, execute } = useApi(fetchUsers);
 */

import { useState, useCallback } from 'react';

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
}

export function useApi<T>(
  apiFunc: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunc(...args);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, loading, error, execute };
}
