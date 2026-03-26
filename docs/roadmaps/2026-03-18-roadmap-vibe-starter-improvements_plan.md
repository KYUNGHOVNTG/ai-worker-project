# Vibe Web Starter 개선 구현 계획

> 기준 문서: `2026-03-18-roadmap-vibe-starter-improvements.md`
> 작성일: 2026-03-18
> 목표: clone → 5분 이내 브라우저에서 동작하는 CRUD 데모 확인 가능한 상태

---

## 현재 코드베이스 상태 (2026-03-18 기준)

### 이미 존재하는 것

| 영역 | 상태 |
|------|------|
| `server/app/examples/sample_domain/` | 코드 있음 (service, models, schemas, repositories, calculators, formatters) — 하지만 `domain/`이 아닌 `examples/`에 위치, 미연결 |
| `server/app/api/v1/endpoints/sample.py` | 엔드포인트 파일 존재 — examples 코드와 미연결 |
| `server/app/api/v1/router.py` | sample/docs/system 라우터 등록 형태 — 실제 도메인 로직과 미연결 |
| `client/src/domains/sample/` | types, api, store, components, pages 구조 존재 |
| `client/src/core/ui/` | Button, Card, Input, Modal — 파일 존재하나 TODO/placeholder 상태 |
| `client/src/core/api/client.ts` | Axios 싱글턴 — 토큰 주입 TODO 주석 상태 |
| `client/src/core/store/useAuthStore.ts` | 기본 구조 존재 |
| `tests/integration/test_sample_api.py` | 파일 존재 — 테스트 본문 전부 `pass`/TODO |
| `tests/unit/` | `__init__.py`만 존재 |
| `alembic/versions/` | 마이그레이션 파일 **0개** |
| `requirements.txt` | python-jose, passlib, bcrypt 포함 — auth 라이브러리 있음 |
| `client/package.json` | framer-motion, lucide-react 포함 |

### 없는 것 (구현 필요)

- `server/app/domain/sample/` (examples에서 이동 및 완성)
- `server/app/domain/auth/` (User 모델, JWT 실제 구현)
- `alembic/versions/` 마이그레이션 파일
- `Makefile` (루트)
- `scripts/seed.py`
- `aiosqlite` 의존성 (SQLite 폴백용)
- `client/src/domains/auth/` (LoginPage, RegisterPage, ProtectedRoute)
- `client/src/core/errors/NotFoundPage.tsx`, `ErrorPage.tsx`
- `client/src/core/ui/Toast.tsx` 등 신규 UI 컴포넌트
- `App.tsx` 라우트 등록 (sample, auth, 404)
- 실행 가능한 테스트 (단위/통합)

---

## 전체 Task 요약 및 실행 순서

```
 1  ✅ Task 1   백엔드 sample 활성화 + 마이그레이션   Sonnet 4.6
 2  ✅ Task 2   UI 컴포넌트 스타일 완성               Sonnet 4.6
 3  ✅ Task 3   Makefile + 원커맨드 셋업              Sonnet 4.6
 4  ✅ Task 4   프론트 sample 라우트 등록             Sonnet 4.6
 5  ✅ Task 5   SQLite 폴백 + 시드 스크립트           Sonnet 4.6
 6  ✅ Task 6   Auth 백엔드 (JWT 실제 구현)           Opus 4.6
 7  ✅ Task 7   에러 페이지 (404/500)                Sonnet 4.6
 8  ✅ Task 8   통합 테스트 (sample API)              Sonnet 4.6
 9  ✅ Task 9   단위 테스트 (Calculator/Formatter)    Sonnet 4.6
10  ✅ Task 10  Auth 프론트엔드                      Sonnet 4.6
11  ✅ Task 11  apiClient 토큰 자동 주입              Sonnet 4.6
```

---

## ✅ Task 1: sample_domain 백엔드 활성화 — 완료

**추천 모델**: `claude-sonnet-4-6`
> 기계적 이동/연결 작업. 구조가 명확하고 예시 코드가 이미 존재함.

**작업 목표**
`examples/sample_domain/`의 코드를 `domain/sample/`로 이동하고, Alembic 마이그레이션을 생성하여 실제 DB 연결 및 CRUD API가 동작하도록 완성한다.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 생성 (이동·완성) | `server/app/domain/sample/__init__.py` |
| 생성 (이동·완성) | `server/app/domain/sample/models/__init__.py` |
| 생성 (이동·완성) | `server/app/domain/sample/schemas/__init__.py` |
| 생성 (이동·완성) | `server/app/domain/sample/repositories/__init__.py` |
| 생성 (이동·완성) | `server/app/domain/sample/calculators/__init__.py` |
| 생성 (이동·완성) | `server/app/domain/sample/formatters/__init__.py` |
| 생성 (이동·완성) | `server/app/domain/sample/service.py` |
| 수정 | `server/app/api/v1/endpoints/sample.py` — `domain/sample/service.py`와 연결 |
| 수정 | `server/app/api/v1/router.py` — sample 엔드포인트 정상 등록 확인 |
| 생성 | `alembic/versions/2026-03-18-add-sample-domain.py` — `sample_data` 테이블 마이그레이션 |
| 수정 | `server/main.py` — domain/sample 모델 import (alembic이 인식하도록) |

**완료 기준**
- `alembic upgrade head` 실행 시 `sample_data` 테이블이 DB에 생성됨
- `GET /api/v1/sample/` 요청 시 200 응답 (빈 배열 `[]` 반환)
- `POST /api/v1/sample/` 요청 시 데이터 생성 후 200 응답
- Swagger UI(`/docs`)에서 sample 엔드포인트 4종(CRUD) 모두 정상 표시

**주의사항**
- `examples/sample_domain/`은 참조용으로 **삭제하지 말고 유지** (레퍼런스 역할)
- Alembic 마이그레이션은 autogenerate 사용: `alembic revision --autogenerate -m "2026-03-18-add-sample-domain"`
- 마이그레이션 전 `server/main.py` 또는 `alembic/env.py`에서 모델 import 확인 필수 (alembic이 모델을 인식해야 autogenerate 동작)
- 마이그레이션 파일명 규칙: `YYYY-MM-DD-{description}` (CLAUDE.md 참조)

---

## ✅ Task 2: UI 컴포넌트 실제 스타일 완성 (Button/Card/Input/Modal) — 완료

**추천 모델**: `claude-sonnet-4-6`
> Tailwind CSS 스타일 적용 작업. 디자인 판단보다 명세대로 구현하는 작업.

**작업 목표**
현재 TODO/placeholder 상태인 Button, Card, Input, Modal 4개 컴포넌트에 실제 Tailwind CSS 스타일과 Framer Motion 애니메이션을 적용한다.

**작업 범위**

| 작업 | 파일 경로 | 주요 변경 내용 |
|------|-----------|---------------|
| 수정 | `client/src/core/ui/Button.tsx` | variant별 실제 Tailwind 클래스 (`primary`/`secondary`/`danger`/`ghost`), 로딩 스피너, disabled 상태 |
| 수정 | `client/src/core/ui/Card.tsx` | 실제 배경·테두리·그림자 Tailwind 클래스, Framer Motion fade-in |
| 수정 | `client/src/core/ui/Input.tsx` | 에러 메시지 표시, focus ring, disabled 상태, label 스타일 |
| 수정 | `client/src/core/ui/Modal.tsx` | 오버레이 backdrop, 내부 패널 스타일, Framer Motion scale 애니메이션, ESC 닫기 |
| 수정 | `client/src/core/ui/index.ts` | export 정상화 확인 |

**완료 기준**
- `Button` variant 4종(`primary`, `secondary`, `danger`, `ghost`) 각각 시각적으로 구분됨
- `Button` `isLoading=true`일 때 스피너 표시, 클릭 비활성화
- `Input` `error` prop 전달 시 빨간 테두리 + 에러 메시지 표시
- `Modal` 열기/닫기 시 Framer Motion 애니메이션 동작
- `Card` Tailwind 스타일 정상 적용 (배경/그림자)
- TypeScript 타입 에러 없음 (`tsc --noEmit`)

**주의사항**
- Tailwind CSS 4 사용 중 — 클래스명 문법 확인 필요 (v4는 일부 변경)
- Framer Motion은 `client/package.json`에 이미 설치됨
- **외부 UI 라이브러리 추가 금지** — Tailwind + Framer Motion으로만 구현
- 기존 컴포넌트의 prop 인터페이스(타입)는 변경하지 말 것 (하위 호환)

---

## ✅ Task 3: Makefile 및 원커맨드 셋업 — 완료

**추천 모델**: `claude-sonnet-4-6`
> 단순 파일 생성 작업. Makefile 문법과 bash 스크립트 작성.

**작업 목표**
프로젝트 루트에 `Makefile`을 생성하여 `make setup` 한 번으로 전체 개발 환경을 구성하고, `make dev`로 백엔드·프론트엔드를 동시 실행한다.

**작업 범위**

| 작업 | 파일 경로 | 내용 |
|------|-----------|------|
| 생성 | `Makefile` | setup, dev, test, lint, clean, migrate, seed 타겟 |
| 수정 | `.env.example` | SQLite 폴백 옵션 주석으로 안내 추가 |
| 수정 | `README.md` | Makefile 사용법 섹션 추가 |

**Makefile 타겟 명세**

```makefile
setup    # venv 생성 → pip install → .env 복사 → npm install → alembic upgrade head → seed
dev      # 백엔드(:8000) + 프론트엔드(:5173) 동시 기동
test     # pytest + npm run lint
lint     # black --check + ruff check + mypy + tsc --noEmit + eslint
clean    # .venv, node_modules, __pycache__, .pyc 삭제
migrate  # alembic upgrade head
seed     # python scripts/seed.py
```

**완료 기준**
- 클린 환경에서 `make setup` 실행 → 오류 없이 완료
- `.env` 파일이 없을 때 `.env.example`에서 자동 복사
- `.env` 파일이 이미 있을 때 덮어쓰지 않음
- `make dev` 실행 → 백엔드·프론트 동시 기동 (터미널 1개)
- `make test` 실행 → pytest + lint 결과 표시
- `make clean` 실행 → `.venv`, `client/node_modules` 삭제

**주의사항**
- Makefile의 타겟 구분은 **탭(tab) 문자** 필수 (스페이스 사용 시 에러)
- `make dev`의 동시 실행은 `&` + `wait` 또는 `trap` 사용 (Ctrl+C로 양쪽 종료 가능해야 함)
- Python 명령어는 `.venv/bin/python` 경로 사용 (`python` 전역 명령 의존 금지)
- macOS/Linux 모두 호환되어야 함

### 완료 기록

- **완료일**: 2026-03-18 (커밋 기준)
- **변경 파일**:
  - `Makefile` (생성) — setup/dev/test/lint/clean/migrate/seed 타겟
  - `.env.example` (수정) — SQLite 폴백 안내 주석 추가
  - `README.md` (수정) — Makefile 사용법 섹션 추가
- **커밋**: `9a47def` — feat: add Makefile for one-command setup and dev workflow
- **다음 태스크 참고사항**: `make seed` 타겟은 `scripts/seed.py`를 호출함 — Task 5에서 해당 스크립트 생성 필요
- **미해결 이슈**: 없음

---

## ✅ Task 4: sample_domain 프론트엔드 라우트 등록 및 동작 확인 — 완료

**추천 모델**: `claude-sonnet-4-6`
> App.tsx 라우트 등록 + 기존 컴포넌트 연결. `client/src/domains/sample/` 구조가 이미 존재함.

**작업 목표**
`client/src/domains/sample/`의 기존 페이지·컴포넌트를 `App.tsx`에 등록하고, API 연결이 실제로 동작하도록 완성한다.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 수정 | `client/src/App.tsx` — `/sample` 라우트 추가, SamplePage import |
| 수정/확인 | `client/src/domains/sample/api.ts` — `VITE_API_BASE_URL` 기반 실제 엔드포인트 연결 확인 |
| 수정/확인 | `client/src/domains/sample/store.ts` — CRUD 액션 동작 확인 |
| 수정/확인 | `client/src/domains/sample/pages/SamplePage.tsx` — 실제 렌더링 동작 확인 |
| 수정/확인 | `client/src/domains/sample/components/SampleList.tsx` — 목록 표시 동작 확인 |
| 수정/확인 | `client/src/domains/sample/components/SampleForm.tsx` — 생성/수정 폼 동작 확인 |
| 수정 | `client/src/core/layout/Sidebar.tsx` — sample 메뉴 항목 추가 |

**완료 기준**
- 브라우저에서 `/sample` 접근 시 페이지 정상 렌더링
- 목록 조회: API 호출 → 데이터 표시 (또는 빈 목록 표시)
- 데이터 생성: 폼 제출 → API 호출 → 목록 갱신
- 데이터 삭제: 삭제 버튼 → API 호출 → 목록 갱신
- 브라우저 콘솔에 에러 없음

**주의사항**
- Task 1 (백엔드 활성화) 완료 후 진행
- `client/src/core/api/client.ts`의 `baseURL`이 올바른지 확인 (`.env`의 `VITE_API_BASE_URL`)
- UI 컴포넌트(Button 등)는 Task 2에서 완성됨 — 스타일 정상 반영 확인

### 완료 기록

- **완료일**: 2026-03-18 (커밋 기준, Task 1과 동일 세션)
- **변경 파일**:
  - `client/src/App.tsx` (수정) — `/sample` 라우트 등록, SamplePage import
  - `client/src/core/layout/Sidebar.tsx` (수정) — sample 메뉴 항목 추가
  - `client/src/domains/sample/api.ts` (확인) — apiClient 기반 CRUD 구현 완료
  - `client/src/domains/sample/store.ts` (확인) — Zustand CRUD 액션 구현 완료
- **커밋**: `2520e21` — feat: implement roadmap tasks 1-1, 1-2, 1-3
- **다음 태스크 참고사항**: sample 프론트 정상 동작하나 apiClient에 auth 토큰 주입 미구현 — Task 11에서 처리
- **미해결 이슈**: 없음

---

## ✅ Task 5: SQLite 폴백 + DB 시드 스크립트 — 완료

**추천 모델**: `claude-sonnet-4-6`
> 의존성 추가 + 단순 스크립트 작성. 아키텍처 변경 없음.

**작업 목표**
Supabase 없이도 SQLite로 로컬 개발을 시작할 수 있도록 폴백 설정을 추가하고, 첫 실행 시 샘플 데이터를 자동 삽입하는 시드 스크립트를 작성한다.

**작업 범위**

| 작업 | 파일 경로 | 내용 |
|------|-----------|------|
| 수정 | `requirements.txt` | `aiosqlite` 추가 |
| 생성 | `scripts/__init__.py` | 패키지 파일 |
| 생성 | `scripts/seed.py` | sample_data 테이블에 예시 데이터 5~10건 삽입 |
| 수정 | `.env.example` | SQLite 폴백 옵션 주석 추가 (`DATABASE_URL=sqlite+aiosqlite:///./dev.db`) |
| 수정 | `server/app/core/database.py` | SQLite 사용 시 `connect_args={"check_same_thread": False}` 조건부 처리 |

**완료 기준**
- `.env`에서 `DATABASE_URL=sqlite+aiosqlite:///./dev.db` 설정 후 서버 정상 기동
- `python scripts/seed.py` 실행 → sample_data 테이블에 예시 데이터 삽입됨
- `make seed` 실행과 동일한 결과
- PostgreSQL 환경에서도 기존대로 정상 동작 (회귀 없음)

**주의사항**
- Task 1 (sample_domain 백엔드 활성화, 마이그레이션 생성) 완료 후 진행
- `seed.py`는 **이미 데이터가 있으면 삽입 건너뜀** (멱등성 보장)
- SQLite는 asyncpg 드라이버를 사용하지 않으므로 database.py의 엔진 생성 로직 분기 필요
- `scripts/seed.py`는 직접 실행(`python scripts/seed.py`)과 `asyncio.run()` 방식으로 작성

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `requirements.txt` (수정) — `aiosqlite==0.20.0` 추가
  - `server/app/core/config.py` (수정) — `DATABASE_URL` 타입 `Optional[PostgresDsn]` → `Optional[str]` (SQLite URL 허용)
  - `server/app/core/database.py` (수정) — SQLite 감지 후 `connect_args={"check_same_thread": False}` 조건부 처리, pool 설정 분리
  - `scripts/__init__.py` (생성)
  - `scripts/seed.py` (생성) — 멱등성 보장, sample_data 5건 삽입
- **커밋**: (이번 세션 커밋 예정)
- **다음 태스크 참고사항**:
  - `.env`에서 `DATABASE_URL=sqlite+aiosqlite:///./dev.db` 설정 후 `alembic upgrade head` → `python scripts/seed.py` 순서로 실행
  - Task 6 (auth) 마이그레이션 후 seed.py에 user 시드 추가 가능 (현재는 sample_data만 처리)
- **미해결 이슈**: 없음

---

## ✅ Task 6: Auth 백엔드 도메인 구현 — 완료

**추천 모델**: `claude-opus-4-6`
> JWT 보안 로직, 토큰 생성/검증, 비밀번호 해싱 등 보안 설계 판단이 필요한 복잡한 작업.

**작업 목표**
이메일+비밀번호 기반 회원가입·로그인 API를 구현하고, 기존에 하드코딩된 `verify_token()`을 실제 JWT 검증 로직으로 교체한다.

**작업 범위**

| 작업 | 파일 경로 | 내용 |
|------|-----------|------|
| 생성 | `server/app/domain/auth/__init__.py` | |
| 생성 | `server/app/domain/auth/models/user.py` | `User` SQLAlchemy 모델 (`id`, `email`, `hashed_password`, `is_active`, `created_at`) |
| 생성 | `server/app/domain/auth/schemas/auth.py` | `RegisterRequest`, `LoginRequest`, `TokenResponse`, `UserResponse` Pydantic 스키마 |
| 생성 | `server/app/domain/auth/repositories/user_repository.py` | `UserRepository` (get_by_email, create, get_by_id) |
| 생성 | `server/app/domain/auth/service.py` | `AuthService` (register, login, get_current_user) |
| 생성 | `server/app/core/security.py` | JWT 생성/검증, 비밀번호 해싱 (passlib + python-jose) |
| 수정 | `server/app/core/dependencies.py` | `get_current_user` 의존성을 실제 JWT 검증으로 교체 |
| 생성 | `server/app/api/v1/endpoints/auth.py` | `/auth/register`, `/auth/login`, `/auth/me` 엔드포인트 |
| 수정 | `server/app/api/v1/router.py` | auth 엔드포인트 등록 |
| 생성 | `alembic/versions/2026-03-18-add-auth-users.py` | `users` 테이블 마이그레이션 |
| 수정 | `.env.example` | `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES` 추가 |
| 수정 | `server/app/core/config.py` | `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES` 설정 추가 |

**완료 기준**
- `POST /api/v1/auth/register` → 이메일 중복 검사 후 회원 생성, `UserResponse` 반환
- `POST /api/v1/auth/login` → 이메일+비밀번호 검증 후 JWT access token 반환
- `GET /api/v1/auth/me` → 유효한 Bearer 토큰으로 현재 사용자 정보 반환
- `GET /api/v1/auth/me` → 토큰 없거나 만료 시 401 반환
- Swagger UI에서 `Authorize` 버튼으로 토큰 설정 후 보호된 엔드포인트 접근 가능
- `alembic upgrade head` 시 `users` 테이블 생성됨

**주의사항**
- `SECRET_KEY`는 `.env.example`에 플레이스홀더(`your-secret-key-here`)로만 기록, 실제 값 커밋 금지
- 비밀번호는 반드시 bcrypt 해싱 후 저장 (`passlib[bcrypt]` 사용)
- **OAuth, 소셜 로그인은 이 Task 범위 외** — 이메일+비밀번호만 구현
- refresh token은 선택사항 — 우선 access token만으로 구현 (과도한 복잡도 방지)
- `verify_token()` 하드코딩 제거 시 기존 sample 엔드포인트의 auth 의존성 영향 확인

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `server/app/domain/auth/__init__.py` (생성) — auth 도메인 패키지
  - `server/app/domain/auth/models/__init__.py` (생성) — `UserModel` (users 테이블)
  - `server/app/domain/auth/schemas/__init__.py` (생성) — `RegisterRequest`, `LoginRequest`, `TokenResponse`, `UserResponse`
  - `server/app/domain/auth/repositories/__init__.py` (생성) — `UserRepository` (get_by_email, get_by_id, create)
  - `server/app/domain/auth/service.py` (생성) — `AuthService` (register, login, get_current_user)
  - `server/app/core/security.py` (생성) — JWT 생성/검증, bcrypt 해싱 (python-jose + passlib)
  - `server/app/api/v1/endpoints/auth.py` (생성) — `/auth/register`, `/auth/login`, `/auth/me` 엔드포인트
  - `server/app/core/dependencies.py` (수정) — 스텁 → 실제 JWT 검증, `OAuth2PasswordBearer` 적용 (Swagger Authorize 버튼 활성화)
  - `server/app/api/v1/router.py` (수정) — auth 라우터 등록
  - `alembic/env.py` (수정) — `UserModel` import 추가
  - `alembic/versions/20260326_1607_2026_03_26_add_auth_users.py` (생성) — users 테이블 마이그레이션
  - `requirements.txt` (수정) — `email-validator==2.1.0`, `bcrypt==4.0.1` 추가
- **주요 결정**:
  - `OAuth2PasswordBearer(auto_error=False)` 사용 — Swagger UI Authorize 버튼 지원 + 선택적 인증 호환
  - bcrypt 4.0.1로 고정 — passlib 1.7.4와 호환성 보장 (최신 bcrypt는 passlib과 호환 문제)
  - refresh token 미구현 — 로드맵 지시대로 access token만 구현
- **다음 태스크 참고**:
  - sample 엔드포인트는 현재 인증 없이 접근 가능 (Task 10에서 ProtectedRoute 적용 시 프론트에서만 보호)
  - `get_current_user` 의존성이 `{"user_id": int}` dict를 반환 — Task 10/11에서 이 형태 활용
  - Swagger UI `/docs`에서 Authorize 버튼으로 Bearer 토큰 설정 후 테스트 가능
- **미해결 이슈**: 없음

---

## ✅ Task 7: 에러 페이지 (404/500) 구현 — 완료

**추천 모델**: `claude-sonnet-4-6`
> 단순 컴포넌트 2개 + App.tsx 라우트 추가. 독립적인 작업.

**작업 목표**
존재하지 않는 라우트 접근 시 404 페이지를, 애플리케이션 오류 발생 시 500 에러 페이지를 표시한다.

**작업 범위**

| 작업 | 파일 경로 | 내용 |
|------|-----------|------|
| 생성 | `client/src/core/errors/NotFoundPage.tsx` | 404 안내 + 홈으로 이동 버튼 |
| 생성 | `client/src/core/errors/ErrorPage.tsx` | 에러 메시지 표시 + 새로고침/홈 버튼 |
| 수정 | `client/src/core/errors/index.ts` | 신규 컴포넌트 export 추가 |
| 수정 | `client/src/App.tsx` | `*` catch-all 라우트 → `NotFoundPage` 연결; `ErrorBoundary`에 `ErrorPage` 연결 |

**완료 기준**
- `/nonexistent-path` 접근 시 404 페이지 렌더링 (빈 화면 아님)
- React 런타임 에러 발생 시 ErrorBoundary가 `ErrorPage` 표시
- "홈으로" 버튼 클릭 시 `/`로 이동

**주의사항**
- `ErrorBoundary`는 `client/src/core/errors/ErrorBoundary.tsx`에 이미 존재 — 수정 최소화
- Task 5 완료 후 진행

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `client/src/core/errors/NotFoundPage.tsx` (생성) — 404 페이지 (이전 페이지 + 홈으로 이동 버튼)
  - `client/src/core/errors/ErrorPage.tsx` (생성) — 에러 페이지 (새로고침 + 홈으로 이동 버튼)
  - `client/src/core/errors/index.ts` (수정) — `NotFoundPage`, `ErrorPage` export 추가
  - `client/src/App.tsx` (수정) — `<Route path="*">` catch-all 라우트 → `NotFoundPage` 연결
- **주요 결정**:
  - `ErrorBoundary`는 기존 `ErrorFallback`을 그대로 사용 (이미 잘 구현되어 있음) — 수정 최소화 원칙 준수
  - `ErrorPage`는 ErrorBoundary와 별개로 독립 사용 가능한 범용 에러 페이지로 생성
- **다음 태스크 참고**: 없음
- **미해결 이슈**: 없음

---

## ✅ Task 8: 통합 테스트 작성 (sample API) — 완료

**추천 모델**: `claude-sonnet-4-6`
> 기존 주석 처리된 테스트를 복원·수정. 패턴이 명확하고 기계적인 작업.

**작업 목표**
현재 `pass`/TODO 상태인 sample API 통합 테스트를 실행 가능하게 복원하고, 각 계층(라우터 → 서비스 → DB)이 올바르게 동작하는지 검증한다.

**작업 범위**

| 작업 | 파일 경로 | 내용 |
|------|-----------|------|
| 수정 | `tests/integration/test_sample_api.py` | TODO/pass → 실제 테스트 코드로 복원 (CRUD 6개 시나리오) |
| 수정/확인 | `tests/conftest.py` | 테스트 DB 세션 픽스처 SQLite in-memory 사용 확인 |

**테스트 시나리오 명세 (6종)**

```
1. test_create_sample       — POST /api/v1/sample/ → 201, 데이터 반환
2. test_get_sample_list     — GET /api/v1/sample/ → 200, 배열 반환
3. test_get_sample_by_id    — GET /api/v1/sample/{id} → 200, 단일 항목 반환
4. test_get_sample_not_found — GET /api/v1/sample/99999 → 404
5. test_update_sample       — PUT /api/v1/sample/{id} → 200, 업데이트된 데이터 반환
6. test_delete_sample       — DELETE /api/v1/sample/{id} → 204 or 200
```

**완료 기준**
- `pytest tests/integration/test_sample_api.py -v` 실행 시 6개 테스트 모두 PASS
- `make test` 실행 시 위 테스트 포함되어 통과
- 외부 DB(Supabase) 없이 SQLite in-memory로 실행 가능

**주의사항**
- Task 1 (sample_domain 백엔드 활성화) 완료 후 진행
- `conftest.py`의 `AsyncSession` 픽스처가 SQLite와 호환되는지 확인
- 테스트 간 DB 격리 (각 테스트 후 롤백 또는 in-memory DB 초기화)

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `tests/integration/test_sample_api.py` (수정) — TODO/pass 제거, 6개 CRUD 테스트 실제 구현
  - `tests/conftest.py` (수정) — `get_database_session` override로 변경, `ASGITransport` 적용, `auth_headers` fixture에 실제 JWT 토큰 생성 추가
- **주요 결정**:
  - `get_db` 대신 `get_database_session`을 dependency override — 실제 엔드포인트가 사용하는 의존성과 일치
  - httpx `ASGITransport` 사용 — 최신 httpx에서 `app=` 파라미터 대신 transport 사용
- **다음 태스크 참고**: conftest의 `auth_headers` fixture가 실제 JWT를 생성하므로 Task 10 이후 인증 테스트에 바로 활용 가능
- **미해결 이슈**: 없음

---

## ✅ Task 9: 단위 테스트 예시 작성 (Calculator/Formatter) — 완료

**추천 모델**: `claude-sonnet-4-6`
> 새 파일 2~3개 추가. 기존 `examples/sample_domain/` 코드 기반으로 테스트 작성.

**작업 목표**
Calculator와 Formatter 계층의 단위 테스트 예시를 작성하여, 초보자가 "어떻게 테스트를 짜는지" 복사해서 시작할 수 있는 레퍼런스를 제공한다.

**작업 범위**

| 작업 | 파일 경로 | 내용 |
|------|-----------|------|
| 생성 | `tests/unit/test_sample_calculator.py` | `SampleCalculator` 단위 테스트 3~5개 |
| 생성 | `tests/unit/test_sample_formatter.py` | `SampleFormatter` 단위 테스트 3~5개 |

**완료 기준**
- `pytest tests/unit/ -v` 실행 시 모든 테스트 PASS
- 각 파일에 "이 파일은 Calculator/Formatter 단위 테스트 작성 예시입니다" 주석 포함
- DB 없이 순수 Python 로직만으로 실행 가능 (fixture 불필요)

**주의사항**
- Task 1 완료 후 진행 (Calculator/Formatter가 `domain/sample/`로 이동 완료 후)
- 테스트 대상이 순수 함수여야 함 (DB 의존성 없음이 Calculator 계층의 핵심)

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `tests/unit/test_sample_calculator.py` (생성) — SampleScoreCalculator 단위 테스트 5개
  - `tests/unit/test_sample_formatter.py` (생성) — SampleDataFormatter 3개 + SampleDataListFormatter 2개 단위 테스트
  - `server/app/domain/sample/schemas/__init__.py` (수정) — `SampleCalculatorInput`, `SampleCalculatorOutput` 스키마 추가 (Calculator가 참조하는데 누락되어 있던 것)
- **주요 결정**:
  - Calculator에서 import하는 `SampleCalculatorInput`/`SampleCalculatorOutput`이 schemas에 누락 → 추가 (기존 examples의 스키마 기반)
  - Formatter 테스트에서 ORM 모델은 생성자로 직접 생성 (DB 불필요)
- **다음 태스크 참고**: 없음
- **미해결 이슈**: 없음

---

## ✅ Task 10: Auth 프론트엔드 도메인 구현 — 완료

**추천 모델**: `claude-sonnet-4-6`
> 기존 도메인 구조(`client/src/domains/sample/`)를 그대로 복사·변형하는 작업. 패턴이 명확함.

**작업 목표**
로그인·회원가입 페이지와 보호 라우트를 구현하여 인증 플로우를 완성한다.

**작업 범위**

| 작업 | 파일 경로 | 내용 |
|------|-----------|------|
| 생성 | `client/src/domains/auth/types.ts` | `LoginRequest`, `RegisterRequest`, `TokenResponse`, `User` 타입 |
| 생성 | `client/src/domains/auth/api.ts` | `login()`, `register()`, `getMe()` API 함수 |
| 수정 | `client/src/core/store/useAuthStore.ts` | 실제 login/logout/register 액션 + token 영속성 (localStorage) |
| 생성 | `client/src/domains/auth/pages/LoginPage.tsx` | 이메일+비밀번호 로그인 폼 |
| 생성 | `client/src/domains/auth/pages/RegisterPage.tsx` | 회원가입 폼 (이메일, 비밀번호, 비밀번호 확인) |
| 생성 | `client/src/domains/auth/components/ProtectedRoute.tsx` | 미인증 시 `/login` 리다이렉트 |
| 수정 | `client/src/App.tsx` | `/login`, `/register` 라우트 추가; `/sample` 등 보호 라우트에 `ProtectedRoute` 적용 |
| 수정 | `client/src/core/layout/Header.tsx` | 로그인 상태에 따른 로그인/로그아웃 버튼 표시 |

**완료 기준**
- `/login` 접근 시 로그인 폼 렌더링
- 올바른 이메일+비밀번호 입력 → 로그인 성공 → `/sample`로 리다이렉트
- 잘못된 자격증명 → 에러 메시지 표시
- `/register` 접근 시 회원가입 폼 렌더링
- 회원가입 성공 → `/login`으로 이동
- 로그인하지 않은 상태에서 `/sample` 접근 → `/login`으로 리다이렉트
- 로그인 상태에서 페이지 새로고침 후에도 세션 유지 (localStorage)
- 로그아웃 → 토큰 삭제 → `/login`으로 이동

**주의사항**
- Task 6 (Auth 백엔드) 완료 후 진행
- 비밀번호 필드는 `type="password"` 필수
- Task 11 (apiClient 토큰 주입) 전까지는 로그인 후 sample API 호출 시 401이 발생할 수 있음 — Task 11과 함께 E2E 테스트

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `client/src/domains/auth/types.ts` (생성) — `LoginRequest`, `RegisterRequest`, `TokenResponse`, `User` 타입
  - `client/src/domains/auth/api.ts` (생성) — `login()`, `register()`, `getMe()` API 함수
  - `client/src/core/store/useAuthStore.ts` (수정) — 스텁 → 실제 login/register/logout/loadUser 구현 + localStorage 영속화
  - `client/src/domains/auth/pages/LoginPage.tsx` (생성) — 이메일+비밀번호 로그인 폼
  - `client/src/domains/auth/pages/RegisterPage.tsx` (생성) — 회원가입 폼 (비밀번호 확인 포함)
  - `client/src/domains/auth/components/ProtectedRoute.tsx` (생성) — 미인증 시 `/login` 리다이렉트
  - `client/src/App.tsx` (수정) — `/login`, `/register` 라우트 추가, `/sample`에 `ProtectedRoute` 적용
  - `client/src/core/layout/Header.tsx` (수정) — 로그인 상태에 따른 이메일 표시 + 로그인/로그아웃 버튼
- **주요 결정**:
  - `useAuthStore`의 `partialize`로 token/user/isAuthenticated만 localStorage에 저장
  - `ProtectedRoute`는 `isAuthenticated` 상태 기반 (토큰 유효성은 API 호출 시 서버에서 검증)
- **다음 태스크 참고**: Task 11에서 apiClient에 토큰 자동 주입 필요 — 현재 sample API 호출 시 토큰이 안 붙음
- **미해결 이슈**: 없음

---

## ✅ Task 11: apiClient 토큰 자동 주입 및 401 처리 — 완료

**추천 모델**: `claude-sonnet-4-6`
> 기존 TODO 주석이 있는 위치에 코드를 채워 넣는 작업. 범위가 좁고 명확함.

**작업 목표**
모든 API 요청에 JWT 토큰을 자동으로 첨부하고, 401 응답 시 자동으로 로그아웃 및 로그인 페이지로 리다이렉트하도록 apiClient를 완성한다.

**작업 범위**

| 작업 | 파일 경로 | 내용 |
|------|-----------|------|
| 수정 | `client/src/core/api/client.ts` | 요청 인터셉터: `useAuthStore`에서 token 읽어 `Authorization: Bearer {token}` 헤더 추가 |
| 수정 | `client/src/core/api/client.ts` | 응답 인터셉터: 401 시 `useAuthStore.logout()` 호출 + `/login` 리다이렉트 |

**완료 기준**
- 로그인 후 `GET /api/v1/sample/` 요청 헤더에 `Authorization: Bearer ...` 자동 포함
- 토큰 만료 또는 무효 시 자동 로그아웃 + `/login` 이동
- 로그인 불필요 엔드포인트 (`/health`, `/auth/login` 등)에도 토큰 헤더가 붙어도 서버에서 무시됨

**주의사항**
- Task 6, Task 10 완료 후 진행
- `useAuthStore`를 Axios 인터셉터 내에서 직접 import 하면 순환 의존성 발생 가능 — `getState()` 방식으로 참조

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `client/src/core/api/client.ts` (수정) — 요청 인터셉터에 토큰 자동 주입 + 응답 인터셉터에 401 자동 로그아웃/리다이렉트
- **주요 결정**:
  - 순환 의존성 방지를 위해 `useAuthStore` import 대신 `localStorage.getItem('auth-storage')` 직접 접근으로 토큰 조회
  - 401 시 `localStorage.removeItem('auth-storage')` + `window.location.href = '/login'`으로 처리 (Zustand store 직접 참조 회피)
  - `/login`, `/register` 페이지에서는 401 리다이렉트 방지 (로그인 API 자체의 401은 리다이렉트하면 안 됨)
- **다음 태스크 참고**: 없음 (마지막 태스크)
- **미해결 이슈**: 없음

---

## DB 마이그레이션 요약

| Task | 마이그레이션 파일명 | 내용 |
|------|-------------------|------|
| Task 1 | `2026-03-18-add-sample-domain` | `sample_data` 테이블 생성 |
| Task 6 | `2026-03-18-add-auth-users` | `users` 테이블 생성 |

**실행 순서**: Task 1 마이그레이션 → Task 6 마이그레이션 (순서 의존 없음, 별개 테이블)

---

## 모델 선택 기준

| 모델 | 적합한 작업 |
|------|------------|
| **Opus 4.6** | 보안 설계 포함 작업 (JWT 토큰 구조, bcrypt 해싱, 401/403 처리 흐름), 복잡한 아키텍처 판단이 필요한 작업 |
| **Sonnet 4.6** | 패턴이 명확한 기계적 구현 (파일 이동, Tailwind 스타일, 스크립트 작성, 라우트 등록, 테스트 코드 작성) |

---

## 설계 원칙 (변경 금지)

1. `examples/sample_domain/` 삭제 금지 — 레퍼런스로 유지
2. 기존 아키텍처 (Router → Service → Repository) 구조 변경 금지
3. 외부 UI 라이브러리 추가 금지 (Tailwind + Framer Motion으로 해결)
4. `apiClient` 우회 금지 (직접 axios 호출 금지)
5. 마이그레이션 파일 append-only (기존 versions 파일 수정 금지)
