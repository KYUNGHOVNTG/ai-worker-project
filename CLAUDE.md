# Vibe Web Starter — Claude 개발 지침

> 바이브코딩 친화적 풀스택 스타터. 웹을 모르는 사람도 쉽게 제품을 만들 수 있는 소프트랜딩 프레임워크.

## 프로젝트 개요

- **백엔드**: FastAPI + SQLAlchemy 2.0 (async) + Pydantic v2 → `server/`
- **프론트엔드**: React 19 + Vite + TypeScript + Tailwind CSS 4 + Zustand → `client/`
- **DB**: SQLite (기본) / PostgreSQL (선택) + Alembic 마이그레이션
- **아키텍처**: Layered + 도메인 플러그인 구조 (Router → Service → Repository/Calculator/Formatter)

## 핵심 규칙 (반드시 준수)

1. **레이어드 아키텍처 유지** — Router(HTTP만) → Service(로직) → Repository(DB) 구조 파괴 금지
2. **도메인 격리** — 도메인 간 통신은 Service/Repository 인터페이스로만
3. **프론트 API 호출** — 반드시 `apiClient` 사용 (직접 axios 금지)
4. **타입 필수** — Python: 타입 힌트, TypeScript: `any` 금지
5. **DB 스키마 변경** — 반드시 Alembic 마이그레이션 사용 (직접 수정 금지)
6. **마이그레이션 Append-only** — 기존 `alembic/versions/` 파일 수정 금지
7. **SDD 준수** — Pydantic 스키마가 SSOT, 프론트 타입은 `api.generated.ts`에서 re-export
8. **표준 응답 래퍼** — 모든 API 엔드포인트는 `ApiResponse[T]`로 응답 (직접 모델 반환 금지)
9. **스키마 동기화** — 백엔드 스키마 수정 후 반드시 `make sdd-sync` 실행

## 상세 가이드 참조 (계층별 .md)

| 영역 | 파일 | 설명 |
|------|------|------|
| 백엔드 | `server/CLAUDE.md` | 서비스·레포·모델 작성법, Alembic 워크플로 |
| 프론트엔드 | `client/CLAUDE.md` | 컴포넌트·스토어·API 모듈 작성법 |
| 아키텍처 | `DOC/ARCHITECTURE.md` | 전체 설계 철학 및 패턴 |
| 개발 체크리스트 | `DOC/DEVELOPMENT_GUIDE.md` | 도메인 추가 6단계 절차 |
| DB 마이그레이션 | `DOC/ALEMBIC_GUIDE.md` | Alembic 상세 사용법 |
| SDD 가이드 | `docs/guides/SDD_GUIDE.md` | 스키마 기반 개발 방법론 |

## docs/ 문서 구조 및 작성 규칙

```
docs/
  guides/         # 개발 가이드 (공통·영구 참조 문서)
  roadmaps/       # 기능 로드맵
  specs/          # 산출물 (메뉴별 요구사항 폴더)
  test-scenarios/ # 테스트 시나리오
  reports/        # 진행 보고서
```

### 문서 종류별 위치 및 파일명 규칙

| 요청 키워드 | 저장 위치 | 파일명 형식 |
|------------|----------|------------|
| "로드맵 만들어줘" | `docs/roadmaps/` | `YYYY-MM-DD-roadmap-{name}.md` |
| "테스트 시나리오 만들어줘" | `docs/test-scenarios/` | `YYYY-MM-DD-test-scenario-{name}.md` |
| "가이드 만들어줘" (특정 기능) | `docs/guides/` | `YYYY-MM-DD-{name}-guide.md` |
| "가이드 만들어줘" (공통·아키텍처) | `docs/guides/` | `{NAME}_GUIDE.md` (날짜 없음) |
| "보고서·진행상황 만들어줘" | `docs/reports/` | `YYYY-MM-DD-{name}.md` |

### 날짜 규칙

- **공통·영구 참조 가이드** (`ALEMBIC_GUIDE`, `ARCHITECTURE` 등): 날짜 없음
- **그 외 모든 문서**: 파일명 앞에 `YYYY-MM-DD-` 필수
- 날짜는 **문서 최초 생성일** 기준 (이후 수정 시 파일명 변경 불필요)
- 기존 파일은 소급 적용하지 않음 — 신규 생성 파일부터 적용

## Alembic 마이그레이션 파일명 규칙

- 리비전 생성 시 **날짜 접두사** 포함: `YYYY-MM-DD-{description}`
- 명령어: `alembic revision --autogenerate -m "YYYY-MM-DD-add-user-table"`
- 예시: `2026-03-18-add-payment-domain`

## 로드맵 작성 절차

로드맵 작성 요청을 받으면 다음 절차를 따른다:

1. **초안 작성** — 프로젝트 현황 분석 → 개선 항목 도출 → 우선순위 배정
2. **자체 점검** — 작성된 초안에서 설계 결함, 논리적 오류, 누락된 의존성 검토 후 수정
3. **DB 마이그레이션 명시** — 태스크 중 Alembic 마이그레이션이 필요한 항목을 별도 표로 정리
4. **완성본 저장** — `docs/roadmaps/YYYY-MM-DD-roadmap-{name}.md`에 저장
5. **구현 완료 후** — 모든 태스크 완료 시 "테스트 시나리오를 작성할까요?" 사용자에게 확인

## 테스트 시나리오 작성 규칙

- 저장 위치: `docs/test-scenarios/YYYY-MM-DD-test-scenario-{name}.md`
- **대상 독자**: 비개발자 또는 웹 개발 경험이 없는 개발자
- **테스트 도구**: 브라우저 + 개발자 도구(F12)만으로 수행 가능하도록 구성
- 각 시나리오에 포함할 것: 사전 조건, 단계별 조작법(스크린샷 위치 포함), 기대 결과, 확인 방법(Network 탭/Console 등)
- API 테스트는 브라우저 주소창 또는 `/docs` (Swagger UI)에서 수행하는 방법으로 안내

## 코드 품질 도구

- **Python**: `black` (포매팅) · `isort` (임포트 정렬) · `ruff` (린팅) · `mypy` (타입 체크) · `pytest` (테스트)
- **TypeScript**: `eslint` (린팅) · `tsc --noEmit` (타입 체크)

## 새 도메인 추가 요약

1. 백엔드: `server/app/domain/{name}/` 에 models → schemas → repositories → service 생성
2. 프론트: `client/src/domains/{name}/` 에 types → api → store → components → pages 생성
3. 라우팅: 백엔드 `api/v1/router.py` + 프론트 `App.tsx`에 등록
4. 참고: `server/app/examples/sample_domain/` 및 `client/src/domains/sample/` 예시 참조

## SDD (Schema-Driven Development) 워크플로우

> DDL(스키마)을 진실의 원천으로, 단계별 사람 검수를 포함한 AI 협업 개발 방법론.

### 전체 흐름

```
/sdd {메뉴명}          → 입력 방식 선택 (산출물 / 텍스트)
  ↓                       → 요구사항 수집 + 불확실한 부분 확인
  ↓                       → 로드맵 MD 생성
  ↓ (사용자 검토)
/sdd-task              → 로드맵 파일 확인 → 진행 상황 표시
  ↓                       → 다음 태스크 실행 (사용자 승인 후)
  ↓                       → 완료 기록 + 검수 체크리스트
  ↓ (다음 태스크 승인)
/sdd-task              → 반복 (태스크마다 시작/완료 승인)
  ↓
모든 태스크 완료        → 테스트 시나리오 MD 생성
```

### 입력 방식

SDD 워크플로우 시작 시 두 가지 입력 방식을 선택할 수 있다:

1. **산출물 방식** — `docs/specs/{name}/` 폴더에 준비된 파일을 분석
2. **텍스트 방식** — 대화형 질문으로 하나씩 수집

### 산출물 폴더 구조 (`docs/specs/`)

```
docs/specs/{feature-name}/
  README.md            # 기본 정보 (메뉴명, 도메인명, 라우터 URL 등)
  ddl.sql              # DDL / 테이블 정의 (선택)
  requirements.md      # 상세 요구사항 (선택)
  legacy/              # 레거시 참조 파일 (선택: SQL, 스크린샷 등)
```

- 모든 파일은 **선택사항** — 폴더만 있어도 분석 가능
- 템플릿: `docs/specs/TEMPLATE_README.md` 참조

### 입력 항목 (모두 선택사항)

1. **메뉴명** — 화면/기능 이름
2. **도메인명** — 백엔드/프론트 폴더명
3. **테이블명 + DDL** — CREATE TABLE 문 또는 컬럼 목록
4. **라우터 URL** — API 및 프론트 경로
5. **요구사항** — 기능 명세 (자연어)
6. **레거시 참조** — 기존 함수/프로시저/쿼리

### 스킬 (슬래시 커맨드)

| 커맨드 | 용도 | 타이밍 |
|--------|------|--------|
| `/sdd {메뉴명}` | 로드맵 생성 (산출물 분석 또는 대화형 질문) | 프로젝트 시작 시 1회 |
| `/sdd-task {로드맵명} {태스크번호}` | 다음 태스크 실행 (로드맵 확인 → 태스크별 승인) | 세션마다 반복 |

### 태스크 완료 시 인수인계 기록 (필수)

태스크 완료 시 해당 로드맵 MD의 태스크 섹션 하단에 다음을 기록한다:
- **완료일**
- **변경/생성/삭제된 파일 목록**
- **커밋 해시 + 메시지**
- **다음 태스크 참고사항** — 다음 태스크에 영향을 주는 설계 결정/변경사항
- **미해결 이슈** (있을 경우)

### 검수 체크리스트

태스크 완료 시 자동으로 검수 체크리스트를 실행하고 결과를 사용자에게 보고한다.
상세 체크리스트: `docs/guides/SDD_CHECKLIST_GUIDE.md` 참조
