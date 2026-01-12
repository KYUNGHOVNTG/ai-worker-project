/**
 * Sample Domain API
 *
 * Sample 도메인의 API 통신 로직
 * apiClient를 사용하여 백엔드와 통신합니다.
 *
 * @important 컴포넌트에서 axios를 직접 사용하지 마세요!
 */

import { apiClient } from '@/core/api';
import type { ApiResponse, PaginatedResponse } from '@/core/api';
import type { SampleItem, SampleFormData } from './types';

/**
 * Sample 아이템 목록 조회
 */
export async function fetchSampleItems(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<SampleItem>> {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<SampleItem>>>(
    '/samples',
    { params: { page, pageSize } }
  );

  return response.data.data;
}

/**
 * Sample 아이템 단건 조회
 */
export async function fetchSampleItem(id: string): Promise<SampleItem> {
  const response = await apiClient.get<ApiResponse<SampleItem>>(`/samples/${id}`);
  return response.data.data;
}

/**
 * Sample 아이템 생성
 */
export async function createSampleItem(data: SampleFormData): Promise<SampleItem> {
  const response = await apiClient.post<ApiResponse<SampleItem>>('/samples', data);
  return response.data.data;
}

/**
 * Sample 아이템 수정
 */
export async function updateSampleItem(
  id: string,
  data: Partial<SampleFormData>
): Promise<SampleItem> {
  const response = await apiClient.patch<ApiResponse<SampleItem>>(
    `/samples/${id}`,
    data
  );
  return response.data.data;
}

/**
 * Sample 아이템 삭제
 */
export async function deleteSampleItem(id: string): Promise<void> {
  await apiClient.delete(`/samples/${id}`);
}
