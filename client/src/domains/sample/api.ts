/**
 * Sample Domain API
 *
 * Sample 도메인의 API 통신 로직
 * apiClient를 사용하여 백엔드와 통신합니다.
 *
 * SDD: 응답은 ApiResponse[T] 래퍼로 오며, .data 필드에서 실제 데이터를 추출합니다.
 *
 * @important 컴포넌트에서 axios를 직접 사용하지 마세요!
 */

import { apiClient } from '@/core/api';
import type { ApiResponse } from '@/core/api/types';
import type { SampleItem, SampleCreateData, SampleUpdateData } from './types';

const BASE = '/v1/sample';

/**
 * Sample 아이템 목록 조회 — GET /api/v1/sample/
 */
export async function fetchSampleItems(): Promise<SampleItem[]> {
  const response = await apiClient.get<ApiResponse<SampleItem[]>>(`${BASE}/`);
  return response.data.data ?? [];
}

/**
 * Sample 아이템 단건 조회 — GET /api/v1/sample/{id}
 */
export async function fetchSampleItem(id: number): Promise<SampleItem> {
  const response = await apiClient.get<ApiResponse<SampleItem>>(`${BASE}/${id}`);
  if (!response.data.data) {
    throw new Error(response.data.error ?? '데이터를 찾을 수 없습니다');
  }
  return response.data.data;
}

/**
 * Sample 아이템 생성 — POST /api/v1/sample/
 */
export async function createSampleItem(data: SampleCreateData): Promise<SampleItem> {
  const response = await apiClient.post<ApiResponse<SampleItem>>(`${BASE}/`, data);
  if (!response.data.data) {
    throw new Error(response.data.error ?? '생성에 실패했습니다');
  }
  return response.data.data;
}

/**
 * Sample 아이템 수정 — PUT /api/v1/sample/{id}
 */
export async function updateSampleItem(id: number, data: SampleUpdateData): Promise<SampleItem> {
  const response = await apiClient.put<ApiResponse<SampleItem>>(`${BASE}/${id}`, data);
  if (!response.data.data) {
    throw new Error(response.data.error ?? '수정에 실패했습니다');
  }
  return response.data.data;
}

/**
 * Sample 아이템 삭제 — DELETE /api/v1/sample/{id}
 */
export async function deleteSampleItem(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}
