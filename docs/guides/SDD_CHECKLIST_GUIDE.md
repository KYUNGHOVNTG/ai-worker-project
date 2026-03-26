# SDD 검수 체크리스트 가이드

> SDD 워크플로우에서 태스크 완료 시 사용하는 표준 검수 체크리스트.
> Claude가 자동으로 검증하고 결과를 사용자에게 보고한다.

---

## 공통 체크리스트 (모든 태스크)

- [ ] 커밋 메시지가 변경 내용을 정확히 반영하는가
- [ ] 타입 힌트(Python) / TypeScript 타입이 누락 없는가
- [ ] `any` 타입을 사용하지 않았는가 (TypeScript)
- [ ] 기존 파일의 의도치 않은 변경이 없는가
- [ ] 로드맵 MD의 완료 기록이 작성되었는가

---

## 백엔드 체크리스트

### 아키텍처
- [ ] 레이어드 아키텍처 준수 — Router(HTTP만) → Service(로직) → Repository(DB)
- [ ] Router에 비즈니스 로직이 포함되지 않았는가
- [ ] Service가 `BaseService`를 상속하고 `execute()` 메서드를 사용하는가
- [ ] Repository가 `BaseRepository`를 상속하는가
- [ ] 도메인 간 직접 참조 없이 Service/Repository 인터페이스로만 통신하는가

### 파일 구조
- [ ] 도메인 코드가 `server/app/domain/{name}/` 하위에 위치하는가
- [ ] models, schemas, repositories, service 파일이 올바른 위치에 있는가
- [ ] API 엔드포인트가 `server/app/api/v1/endpoints/` 에 위치하는가

### 라우터 등록
- [ ] `server/app/api/v1/router.py`에 라우터가 등록되었는가
- [ ] API 엔드포인트가 Swagger UI(`/docs`)에서 조회되는가

### DB 마이그레이션 (해당 시)
- [ ] Alembic 마이그레이션 파일이 `alembic/versions/`에 생성되었는가
- [ ] 마이그레이션 파일명이 `YYYY-MM-DD-{description}` 형식인가
- [ ] 기존 마이그레이션 파일을 수정하지 않았는가 (append-only)
- [ ] 마이그레이션 파일 내용이 모델 변경을 정확히 반영하는가

---

## 프론트엔드 체크리스트

### API 호출
- [ ] `apiClient` 사용 여부 확인 (직접 axios/fetch 호출 금지)
- [ ] API 함수가 `domains/{name}/api.ts`에 정의되었는가

### 상태 관리
- [ ] 도메인 상태가 `domains/{name}/store.ts`에 정의되었는가
- [ ] Zustand 스토어 패턴을 따르는가

### 파일 구조
- [ ] 도메인 코드가 `client/src/domains/{name}/` 하위에 위치하는가
- [ ] types.ts, api.ts, store.ts, components/, pages/ 구조를 따르는가

### 라우트 등록
- [ ] `App.tsx`에 라우트가 등록되었는가
- [ ] 페이지 컴포넌트가 `domains/{name}/pages/`에 위치하는가

### 스타일링
- [ ] Tailwind CSS 클래스 사용 (인라인 style 금지)
- [ ] 반응형 레이아웃 고려 여부

---

## 검수 보고 형식

Claude는 태스크 완료 시 아래 형식으로 결과를 보고한다:

```
## 검수 체크리스트 결과

### 공통
- [x] 커밋 메시지 — `[SDD] 대상자관리 - Task 1: DB 모델 생성`
- [x] 타입 힌트 — 전체 파일 확인 완료
- [x] any 타입 — 사용 없음
- [x] 의도치 않은 변경 — 없음
- [x] 로드맵 완료 기록 — 작성 완료

### 백엔드
- [x] 레이어드 아키텍처 — 준수
- [x] Alembic 마이그레이션 — `2026-03-26-add-eval-target.py` 생성
- [ ] ⚠️ 라우터 등록 — Task 3에서 진행 예정 (이번 태스크 범위 외)

### 주의 필요 항목
- ⚠️ {항목}: {사유 설명}
```

---

## 태스크 유형별 적용 체크리스트

| 태스크 유형 | 적용 체크리스트 |
|------------|----------------|
| DB 모델 + 마이그레이션 | 공통 + 백엔드(아키텍처, DB 마이그레이션) |
| 백엔드 Service/Repository | 공통 + 백엔드(아키텍처, 파일 구조) |
| 백엔드 Router | 공통 + 백엔드(아키텍처, 라우터 등록) |
| 프론트 타입/API | 공통 + 프론트(API 호출, 파일 구조) |
| 프론트 컴포넌트/페이지 | 공통 + 프론트(전체) |
| 풀스택 통합 | 공통 + 백엔드(전체) + 프론트(전체) |
