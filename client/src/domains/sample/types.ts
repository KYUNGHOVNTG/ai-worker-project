/**
 * Sample Domain Types
 *
 * SDD: 자동 생성된 타입(api.generated.ts)에서 추출하여 re-export합니다.
 * 백엔드 Pydantic 스키마가 변경되면 `npm run sdd:sync`로 자동 갱신됩니다.
 *
 * 직접 타입을 정의하지 않고 자동 생성 타입을 사용함으로써
 * 백엔드-프론트엔드 스키마 불일치를 원천 차단합니다.
 */

import type { components } from '@/types/api.generated';

/** 샘플 데이터 응답 (백엔드 SampleDataResponse) */
export type SampleItem = components['schemas']['SampleDataResponse'];

/** 샘플 데이터 생성 요청 (백엔드 SampleDataCreate) */
export type SampleCreateData = components['schemas']['SampleDataCreate'];

/** 샘플 데이터 수정 요청 (백엔드 SampleDataUpdate) */
export type SampleUpdateData = components['schemas']['SampleDataUpdate'];

/** 샘플 목록 API 응답 (ApiResponse 래핑) */
export type SampleListResponse = components['schemas']['ApiResponse_list_SampleDataResponse__'];

/** 샘플 단건 API 응답 (ApiResponse 래핑) */
export type SampleItemResponse = components['schemas']['ApiResponse_SampleDataResponse_'];
