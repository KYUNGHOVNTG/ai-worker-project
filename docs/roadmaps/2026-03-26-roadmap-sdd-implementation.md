# SDD (Schema-Driven Development) 적용 로드맵

> 작성일: 2026-03-26
> 목표: Pydantic 스키마를 SSOT로 삼아 프론트엔드 타입을 자동 생성하는 SDD 파이프라인 구축

---

## 완료된 태스크

### Task 1: 백엔드 API 표준 응답 래퍼 구현
- **대상 파일**: `server/app/shared/types/__init__.py`, `server/app/api/v1/endpoints/sample.py`, `server/main.py`
- **내용**: `ApiResponse[T]`, `PaginatedApiResponse[T]` 공통 래퍼 추가
- **효과**: 모든 API 응답이 `{ success, data, message, error }` 구조로 통일

### Task 2: Pydantic 스키마 description/examples 보강
- **대상 파일**: `server/app/domain/sample/schemas/__init__.py`
- **내용**: 모든 필드에 `description` 추가, `model_config.json_schema_extra.examples` 추가
- **효과**: OpenAPI 문서(Swagger UI) 품질 대폭 향상, TS 타입에 JSDoc 주석 자동 반영

### Task 3: OpenAPI → TypeScript 타입 자동 생성 파이프라인
- **대상 파일**: `scripts/export_openapi.py`, `client/package.json`
- **도구**: `openapi-typescript` (npm devDependency)
- **명령어**: `make sdd-sync` (또는 `npm run sdd:sync`)
- **효과**: 서버 실행 없이 Pydantic → OpenAPI JSON → TypeScript 타입 자동 생성

### Task 4: 프론트엔드 자동 생성 타입 활용 리팩터링
- **대상 파일**: `client/src/domains/sample/types.ts`, `client/src/domains/sample/api.ts`, `client/src/core/api/types.ts`, `client/src/core/api/client.ts`
- **내용**:
  - `types.ts`: 직접 정의 → `api.generated.ts`에서 re-export
  - `api.ts`: `ApiResponse<T>` 래퍼 처리 로직 추가
  - `client.ts`: `any` 타입 제거 → `unknown` 전환
  - `types.ts (core)`: 백엔드 `ApiResponse`와 1:1 대응하도록 수정

### Task 5: Makefile + SDD 가이드 문서
- **대상 파일**: `Makefile`, `docs/guides/SDD_GUIDE.md`, `CLAUDE.md`
- **내용**: `make sdd-sync` 명령 추가, SDD 가이드 문서 작성, CLAUDE.md에 SDD 규칙 추가

---

## 향후 개선 후보 (미구현)

| 순위 | 항목 | 설명 | 난이도 |
|------|------|------|--------|
| 1 | Validation 규칙 스키마 집중화 | OpenAPI의 min/max/required 규칙을 프론트 폼 검증에 자동 활용 | 중간 |
| 2 | 도메인 생성 CLI | `python scripts/generate_domain.py --name payment --fields "..."` 한 줄로 풀스택 도메인 생성 | 높음 |
| 3 | CI/CD에 sdd-sync 통합 | PR 올릴 때 타입 동기화 여부 자동 검증 | 낮음 |
| 4 | OpenAPI 스키마 diff 검증 | openapi.json 변경 감지 → 자동 TS 타입 재생성 여부 검증 | 중간 |

---

## DB 마이그레이션 필요 여부

이번 SDD 적용은 **DB 마이그레이션 불필요**합니다.
변경 범위가 API 응답 래퍼/스키마 메타데이터/프론트엔드 타입 시스템에 한정됩니다.

---

## 변경 파일 요약

| 파일 | 변경 유형 |
|------|----------|
| `server/app/shared/types/__init__.py` | `ApiResponse`, `PaginatedApiResponse` 추가 |
| `server/app/domain/sample/schemas/__init__.py` | description, examples 보강 |
| `server/app/api/v1/endpoints/sample.py` | `ApiResponse[T]` 래퍼 적용 |
| `server/main.py` | 예외 핸들러 `ApiResponse.fail()` 적용 |
| `scripts/export_openapi.py` | 신규 (OpenAPI 추출 스크립트) |
| `client/package.json` | `openapi-typescript` 추가, `sdd:sync` 스크립트 추가 |
| `client/src/types/openapi.json` | 자동 생성 (OpenAPI 스펙) |
| `client/src/types/api.generated.ts` | 자동 생성 (TS 타입) |
| `client/src/domains/sample/types.ts` | 자동 생성 타입에서 re-export |
| `client/src/domains/sample/api.ts` | `ApiResponse<T>` 언래핑 처리 |
| `client/src/core/api/types.ts` | 백엔드 `ApiResponse`와 동일 구조로 수정 |
| `client/src/core/api/client.ts` | `any` → `unknown` 전환 |
| `Makefile` | `make sdd-sync` 추가 |
| `CLAUDE.md` | SDD 규칙 3개 추가 |
| `docs/guides/SDD_GUIDE.md` | 신규 (SDD 가이드) |
