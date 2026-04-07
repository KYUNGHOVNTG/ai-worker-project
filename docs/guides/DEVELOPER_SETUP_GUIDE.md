# 개발자 설치 및 환경 구성 가이드

> Python/Node.js 경험이 있는 개발자를 위한 빠른 셋업 가이드

---

## 사전 요구사항

- Python 3.12+
- Node.js 18+
- Git

---

## 환경 구성

```powershell
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt -q
if (!(Test-Path .env)) { Copy-Item .env.example .env }
cd client; npm install --silent; cd ..
.venv\Scripts\python -m alembic upgrade head
.venv\Scripts\python scripts\seed.py
.venv\Scripts\python scripts\dev.py
```

> Windows에서 `make` 사용을 원하면 `winget install GnuWin32.Make` 후 Git Bash에서 실행.

---

## Makefile 명령어

| 명령어 | 설명 |
|--------|------|
| `make setup` | 전체 개발 환경 구성 (최초 1회) |
| `make dev` | 백엔드 + 프론트엔드 동시 실행 |
| `make test` | pytest + 프론트엔드 lint |
| `make lint` | black, isort, ruff, mypy, tsc, eslint 전체 검사 |
| `make migrate` | `alembic upgrade head` |
| `make seed` | 시드 데이터 삽입 |
| `make sdd-sync` | OpenAPI → TypeScript 타입 자동 생성 |
| `make clean` | .venv, node_modules, __pycache__ 삭제 |

---

## 환경 변수 (.env)

`.env.example`을 복사하여 `.env`를 만듭니다. 주요 설정:

```env
# 앱 설정
APP_NAME=vibe-web-starter
DEBUG=true
ENVIRONMENT=development

# DB (기본: SQLite — 별도 설치 불필요)
DATABASE_URL=sqlite+aiosqlite:///./dev.db

# PostgreSQL 사용 시
# DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname

# 보안
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 데이터베이스

### SQLite (기본)

설정 불필요. `make setup` 시 `dev.db` 파일이 자동 생성됩니다.

### PostgreSQL / Supabase

`.env`에서 `DATABASE_URL`을 변경:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
```

Supabase 사용 시 Connection string을 `postgresql://` → `postgresql+asyncpg://`로 변경하고, 비밀번호 특수문자를 URL 인코딩하세요.

---

## Alembic 마이그레이션

```powershell
# 마이그레이션 적용
.venv\Scripts\alembic upgrade head

# 새 마이그레이션 생성 (모델 변경 후)
.venv\Scripts\alembic revision --autogenerate -m "YYYY-MM-DD-설명"
```

**규칙**: 기존 마이그레이션 파일 수정 금지 (Append-only)

---

## 서비스 접속 정보

| 서비스 | 주소 |
|--------|------|
| 프론트엔드 | http://localhost:5173 |
| 백엔드 API 문서 (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/core/health |
| 디자인 시스템 | http://localhost:5173/design-system |

---

## 코드 품질 도구

```powershell
# Git Bash 또는 make 설치된 환경에서:
make lint  # 전체 검사 (아래 도구 일괄 실행)
```

| 도구 | 대상 | 용도 |
|------|------|------|
| black | Python | 코드 포매팅 |
| isort | Python | import 정렬 |
| ruff | Python | 린팅 |
| mypy | Python | 타입 체크 |
| pytest | Python | 테스트 |
| eslint | TypeScript | 린팅 |
| tsc --noEmit | TypeScript | 타입 체크 |

---

## 디렉토리 구조 요약

```
vibe-web-starter/
├── server/                 # 백엔드 (FastAPI)
│   ├── main.py             # 진입점
│   └── app/
│       ├── core/           # 설정, DB, 미들웨어
│       ├── shared/         # BaseService, BaseRepository 등
│       ├── domain/         # 비즈니스 도메인
│       ├── api/v1/         # API 엔드포인트
│       └── examples/       # sample_domain 참고 구현
├── client/                 # 프론트엔드 (React 19)
│   └── src/
│       ├── core/           # 공유 UI, 훅, 스토어, API 클라이언트
│       └── domains/        # 도메인별 기능
├── alembic/                # DB 마이그레이션
├── scripts/                # dev.py, seed.py 등
├── docs/                   # 프로젝트 문서
├── .env.example            # 환경 변수 템플릿
├── requirements.txt        # Python 의존성
└── Makefile                # 개발 명령어
```
