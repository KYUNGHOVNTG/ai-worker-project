/**
 * Sample Domain Types
 *
 * 이 도메인에서 사용하는 타입 정의
 */

export interface SampleItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SampleFormData {
  title: string;
  description: string;
}
