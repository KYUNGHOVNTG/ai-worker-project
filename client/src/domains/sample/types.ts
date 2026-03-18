/**
 * Sample Domain Types
 *
 * 백엔드 API 스키마와 1:1 대응하는 타입 정의
 */

export interface SampleItem {
  id: number;
  name: string;
  description: string | null;
  value: number;
  score: number | null;
  created_at: string;
  updated_at: string;
}

export interface SampleCreateData {
  name: string;
  description?: string;
  value: number;
  score?: number;
}

export interface SampleUpdateData {
  name?: string;
  description?: string;
  value?: number;
  score?: number;
}
