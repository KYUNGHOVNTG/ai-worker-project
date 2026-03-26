# Vibe Web Starter

> **"유지보수성 최우선" 및 "모듈화"를 핵심 가치로 하는 바이브 코딩(Vibe Coding) 환경**

FastAPI + SQLAlchemy 2.0 + React 19 + Tailwind 4 기반의 Production-Ready 풀스택 웹 애플리케이션 템플릿

---

## 핵심 특징

- **도메인 플러그인 구조**: 새로운 비즈니스 도메인을 독립적으로 추가 가능 (충돌 최소화)
- **계층화된 아키텍처**: 명확한 책임 분리로 테스트 가능하고 유지보수 쉬움
- **타입 안전성**: Pydantic v2 + SQLAlchemy 2.0 + TypeScript로 런타임 에러 최소화
- **비동기 최적화**: async/await 기반으로 높은 처리량 보장
- **모던 기술 스택**: React 19, Tailwind 4, Zustand 등 최신 기술 적용
- **운영 준비 완료**: Request ID 로깅, Health Check, 전역 에러/로딩 처리 내장

---

## 기술 스택

### 백엔드
- **Framework**: FastAPI 0.109.0
- **ORM**: SQLAlchemy 2.0.25 (async)
- **Database**: SQLite (기본) / PostgreSQL (선택)
- **Migration**: Alembic 1.13.1
- **Validation**: Pydantic v2.5.3
- **Auth**: JWT (python-jose)

### 프론트엔드
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **State**: Zustand 5.0.9
- **Router**: React Router DOM 7.12.0

---

## 빠른 시작

### 사전 준비

- **Python 3.12+**: [다운로드](https://www.python.org/downloads/) (설치 시 "Add Python to PATH" 체크)
- **Node.js 18+**: [다운로드](https://nodejs.org/)
- **Git**: [다운로드](https://git-scm.com/downloads)

### 원커맨드 셋업

**macOS / Linux:**
```bash
make setup   # 전체 환경 구성 (venv, pip, npm, .env, 마이그레이션, 시드)
make dev     # 백엔드(:8000) + 프론트엔드(:5173) 동시 실행
```

**Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\pip install --upgrade pip -q
.venv\Scripts\pip install -r requirements.txt -q
if (!(Test-Path .env)) { Copy-Item .env.example .env }
cd client; npm install --silent; cd ..
.venv\Scripts\alembic upgrade head
.venv\Scripts\python scripts\seed.py

# 개발 서버 실행
.venv\Scripts\python scripts\dev.py
```

> Windows에서 `make`를 사용하려면 [Git Bash](https://git-scm.com/downloads) 또는 [GNU Make for Windows](https://gnuwin32.sourceforge.net/packages/make.htm)를 설치하세요.

### 확인

| 서비스 | 주소 |
|--------|------|
| 프론트엔드 | http://localhost:5173 |
| 백엔드 API 문서 | http://localhost:8000/docs |
| Health Check | http://localhost:8000/core/health |

---

## 데이터베이스 설정

### 기본: SQLite (설정 불필요)

`make setup` 실행 시 자동으로 `dev.db` 파일이 생성됩니다. 별도 DB 설치 없이 바로 개발을 시작할 수 있습니다.

### 선택: PostgreSQL / Supabase

운영 환경이나 PostgreSQL이 필요한 경우 `.env` 파일을 수정하세요:

```env
# SQLite 줄을 주석 처리하고 아래를 활성화
# DATABASE_URL=sqlite+aiosqlite:///./dev.db
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
```

Supabase 사용 시:
1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. Settings > Database > Connection string (Transaction pooler) 복사
3. `postgresql://` → `postgresql+asyncpg://` 변경
4. 비밀번호 특수문자 URL 인코딩 (`!` → `%21`, `@` → `%40`)

---

## Makefile 전체 명령어

| 명령어 | 설명 |
|--------|------|
| `make setup` | 전체 개발 환경 구성 (최초 1회) |
| `make dev` | 백엔드 + 프론트엔드 동시 실행 |
| `make test` | pytest + 프론트엔드 lint |
| `make lint` | black, isort, ruff, mypy, tsc, eslint 전체 검사 |
| `make migrate` | `alembic upgrade head` 실행 |
| `make seed` | 시드 데이터 삽입 (`scripts/seed.py`) |
| `make sdd-sync` | 스키마 동기화 (OpenAPI → TS 타입 자동 생성) |
| `make clean` | `.venv`, `node_modules`, `__pycache__` 삭제 |

---

## 프로젝트 구조

```
vibe-web-starter/
├── server/                      # 백엔드 (FastAPI)
│   ├── main.py                  # 진입점
│   └── app/
│       ├── core/                # 핵심 인프라
│       ├── shared/              # 공유 컴포넌트
│       ├── domain/              # 비즈니스 도메인
│       └── api/                 # API 엔드포인트
│
├── client/                      # 프론트엔드 (React)
│   └── src/
│       ├── core/                # 핵심 유틸리티
│       └── domains/             # 도메인별 기능
│
├── alembic/                     # DB 마이그레이션
├── scripts/                     # 유틸리티 스크립트
├── tests/                       # 테스트
├── DOC/                         # 프로젝트 문서
├── .env.example                 # 환경 변수 예제
├── requirements.txt             # Python 의존성
└── Makefile                     # 개발 명령어 (크로스플랫폼)
```

---

## 문서 가이드

| 문서 | 내용 |
|------|------|
| [DOC/ARCHITECTURE.md](./DOC/ARCHITECTURE.md) | 시스템 아키텍처 및 설계 원칙 |
| [DOC/DEVELOPMENT_GUIDE.md](./DOC/DEVELOPMENT_GUIDE.md) | 도메인 추가, 코딩 규칙, 체크리스트 |
| [server/README.md](./server/README.md) | 백엔드 상세 가이드 |
| [client/README.md](./client/README.md) | 프론트엔드 상세 가이드 |

---

## 개발 워크플로우

### 새 도메인 추가
```bash
# 백엔드
mkdir -p server/app/domain/{domain_name}/{models,schemas,repositories,calculators,formatters}

# 프론트엔드
mkdir -p client/src/domains/{domain_name}/{components,pages}
```

자세한 내용은 [DOC/DEVELOPMENT_GUIDE.md](./DOC/DEVELOPMENT_GUIDE.md) 참조

### DB 스키마 변경 (반드시 Alembic 사용)
```bash
make migrate                                              # 마이그레이션 적용
.venv/bin/alembic revision --autogenerate -m "설명"       # 새 마이그레이션 생성
```

---

## 라이센스

MIT License
