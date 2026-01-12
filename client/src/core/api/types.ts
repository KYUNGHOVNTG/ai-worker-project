/**
 * API 공통 타입 정의
 */

/**
 * API 응답 공통 포맷
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 에러 응답
 */
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}
