# Vibe Web Starter — Claude 개발 지침

> 바이브코딩 친화적 풀스택 스타터. 웹을 모르는 사람도 쉽게 제품을 만들 수 있는 소프트랜딩 프레임워크.

## 프로젝트 개요

- **백엔드**: FastAPI + SQLAlchemy 2.0 (async) + Pydantic v2 → `server/`
- **프론트엔드**: React 19 + Vite + TypeScript + Tailwind CSS 4 + Zustand → `client/`
- **DB**: PostgreSQL (Supabase) + Alembic 마이그레이션
- **아키텍처**: Layered + 도메인 플러그인 구조 (Router → Service → Repository/Calculator/Formatter)

## 핵심 규칙 (반드시 준수)

1. **레이어드 아키텍처 유지** — Router(HTTP만) → Service(로직) → Repository(DB) 구조 파괴 금지
2. **도메인 격리** — 도메인 간 통신은 Service/Repository 인터페이스로만
3. **프론트 API 호출** — 반드시 `apiClient` 사용 (직접 axios 금지)
4. **타입 필수** — Python: 타입 힌트, TypeScript: `any` 금지
5. **DB 스키마 변경** — 반드시 Alembic 마이그레이션 사용 (직접 수정 금지)
6. **마이그레이션 Append-only** — 기존 `alembic/versions/` 파일 수정 금지

## 상세 가이드 참조 (계층별 .md)

| 영역 | 파일 | 설명 |
|------|------|------|
| 백엔드 | `server/CLAUDE.md` | 서비스·레포·모델 작성법, Alembic 워크플로 |
| 프론트엔드 | `client/CLAUDE.md` | 컴포넌트·스토어·API 모듈 작성법 |
| 아키텍처 | `DOC/ARCHITECTURE.md` | 전체 설계 철학 및 패턴 |
| 개발 체크리스트 | `DOC/DEVELOPMENT_GUIDE.md` | 도메인 추가 6단계 절차 |
| DB 마이그레이션 | `DOC/ALEMBIC_GUIDE.md` | Alembic 상세 사용법 |
| 초보자 셋업 | `DOC/BEGINNER_QUICK_START.md` | 환경 구축 가이드 |

## docs/ 문서 구조 및 작성 규칙

```
docs/
  guides/         # 개발 가이드 (공통·영구 참조 문서)
  roadmaps/       # 기능 로드맵
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

## 코드 품질 도구

- **Python**: `black` (포매팅) · `isort` (임포트 정렬) · `ruff` (린팅) · `mypy` (타입 체크) · `pytest` (테스트)
- **TypeScript**: `eslint` (린팅) · `tsc --noEmit` (타입 체크)

## 새 도메인 추가 요약

1. 백엔드: `server/app/domain/{name}/` 에 models → schemas → repositories → service 생성
2. 프론트: `client/src/domains/{name}/` 에 types → api → store → components → pages 생성
3. 라우팅: 백엔드 `api/v1/router.py` + 프론트 `App.tsx`에 등록
4. 참고: `server/app/examples/sample_domain/` 및 `client/src/domains/sample/` 예시 참조
