/**
 * System 도메인 API 클라이언트
 */

import { apiClient } from '@/core/api/client';
import type { DBCheckResponse } from './types';

/**
 * 데이터베이스 연결 테스트
 *
 * @returns DB 연결 테스트 결과
 */
export const checkDatabaseConnection = async (): Promise<DBCheckResponse> => {
  const response = await apiClient.get<DBCheckResponse>('/v1/system/db-check');
  return response.data;
};
