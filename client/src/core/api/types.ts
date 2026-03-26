/**
 * API 공통 타입 정의
 *
 * SDD: 백엔드 ApiResponse와 1:1 대응합니다.
 * 자동 생성 타입(api.generated.ts)과 함께 사용합니다.
 */

/**
 * API 응답 공통 포맷 — 백엔드 ApiResponse[T]와 동일 구조
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message?: string | null;
  error?: string | null;
}

/**
 * 페이지네이션 응답 — 백엔드 PaginatedApiResponse[T]와 동일 구조
 */
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  message?: string | null;
  error?: string | null;
}

/**
 * 에러 응답
 */
export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}
