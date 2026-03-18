/**
 * Sample Domain API
 *
 * Sample 도메인의 API 통신 로직
 * apiClient를 사용하여 백엔드와 통신합니다.
 *
 * @important 컴포넌트에서 axios를 직접 사용하지 마세요!
 */

import { apiClient } from '@/core/api';
import type { SampleItem, SampleCreateData, SampleUpdateData } from './types';

const BASE = '/v1/sample';

/**
 * Sample 아이템 목록 조회 — GET /api/v1/sample/
 */
export async function fetchSampleItems(): Promise<SampleItem[]> {
  const response = await apiClient.get<SampleItem[]>(`${BASE}/`);
  return response.data;
}

/**
 * Sample 아이템 단건 조회 — GET /api/v1/sample/{id}
 */
export async function fetchSampleItem(id: number): Promise<SampleItem> {
  const response = await apiClient.get<SampleItem>(`${BASE}/${id}`);
  return response.data;
}

/**
 * Sample 아이템 생성 — POST /api/v1/sample/
 */
export async function createSampleItem(data: SampleCreateData): Promise<SampleItem> {
  const response = await apiClient.post<SampleItem>(`${BASE}/`, data);
  return response.data;
}

/**
 * Sample 아이템 수정 — PUT /api/v1/sample/{id}
 */
export async function updateSampleItem(id: number, data: SampleUpdateData): Promise<SampleItem> {
  const response = await apiClient.put<SampleItem>(`${BASE}/${id}`, data);
  return response.data;
}

/**
 * Sample 아이템 삭제 — DELETE /api/v1/sample/{id}
 */
export async function deleteSampleItem(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}
