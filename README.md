# 🚀 Vibe Web Starter

> **"유지보수성 최우선" 및 "모듈화"를 핵심 가치로 하는 바이브 코딩(Vibe Coding) 환경**

FastAPI + SQLAlchemy 2.0 + React 19 + Tailwind 4 기반의 Production-Ready 풀스택 웹 애플리케이션 템플릿

---

## 📖 프로젝트 개요

이 프로젝트는 **확장 가능하고 유지보수하기 쉬운 AI 바이브코딩 기반 웹 서비스**를 위한 생산급(Production-Ready) 풀스택 템플릿입니다.

### 핵심 특징

- **도메인 플러그인 구조**: 새로운 비즈니스 도메인을 독립적으로 추가 가능 (충돌 최소화)
- **계층화된 아키텍처**: 명확한 책임 분리로 테스트 가능하고 유지보수 쉬움
- **타입 안전성**: Pydantic v2 + SQLAlchemy 2.0 + TypeScript로 런타임 에러 최소화
- **비동기 최적화**: async/await 기반으로 높은 처리량 보장
- **모던 기술 스택**: React 19, Tailwind 4, Zustand 등 최신 기술 적용
- **운영 준비 완료**: Request ID 로깅, Health Check, 전역 에러/로딩 처리 내장

---

## 🏗️ 기술 스택

### 백엔드
- **Framework**: FastAPI 0.109.0
- **ORM**: SQLAlchemy 2.0.25 (async)
- **Database**: PostgreSQL (asyncpg)
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

## 📂 프로젝트 구조

```
vibe-web-starter/
├── 📁 DOC/                         # 📚 프로젝트 문서
│   ├── BEGINNER_QUICK_START.md    # 빠른 시작 가이드
│   ├── ARCHITECTURE.md             # 시스템 아키텍처
│   ├── PROJECT_HANDOVER.md         # 인수인계 문서
│   └── DEVELOPMENT_GUIDE.md        # 개발 가이드
│
├── 📁 server/                      # 백엔드 (FastAPI)
│   ├── main.py                     # 진입점
│   ├── README.md                   # 백엔드 가이드
│   └── app/
│       ├── core/                   # 핵심 인프라
│       ├── shared/                 # 공유 컴포넌트
│       ├── domain/                 # 비즈니스 도메인
│       └── api/                    # API 엔드포인트
│
├── 📁 client/                      # 프론트엔드 (React)
│   ├── README.md                   # 프론트엔드 가이드
│   └── src/
│       ├── core/                   # 핵심 유틸리티
│       └── domains/                # 도메인별 기능
│
├── 📁 alembic/                     # DB 마이그레이션
│   ├── versions/                   # 마이그레이션 파일
│   ├── env.py                      # Alembic 환경 설정
│   └── alembic.ini                 # Alembic 설정
│
├── 📁 tests/                       # 테스트
│   ├── unit/                       # 단위 테스트
│   └── integration/                # 통합 테스트
│
├── 📄 .cursorrules                 # AI 코딩 규칙
├── 📄 .env.example                 # 환경 변수 예제
├── 📄 requirements.txt             # Python 의존성
└── 📄 pyproject.toml               # Python 프로젝트 설정
```

---

## 🚀 빠른 시작

처음 시작하시는 분은 **[DOC/BEGINNER_QUICK_START.md](./DOC/BEGINNER_QUICK_START.md)**를 참조하세요.

### ⚡ 원커맨드 셋업 (Makefile)

```bash
# 최초 1회 — 전체 환경 구성 (venv, pip, npm, .env, 마이그레이션, 시드)
make setup

# 개발 서버 실행 (백엔드 :8000 + 프론트엔드 :5173 동시 기동)
make dev
```

> `make setup` 실행 전 `.env` 파일에서 `DATABASE_URL`을 설정하세요.
> Supabase 없이 빠르게 시작하려면 `.env.example`의 SQLite 폴백 옵션 주석을 참조하세요.

### Makefile 전체 명령어

| 명령어 | 설명 |
|--------|------|
| `make setup` | 전체 개발 환경 구성 (최초 1회) |
| `make dev` | 백엔드 + 프론트엔드 동시 실행 |
| `make test` | pytest + 프론트엔드 lint |
| `make lint` | black, isort, ruff, mypy, tsc, eslint 전체 검사 |
| `make migrate` | `alembic upgrade head` 실행 |
| `make seed` | 시드 데이터 삽입 (`scripts/seed.py`) |
| `make clean` | `.venv`, `node_modules`, `__pycache__` 삭제 |

### 수동 실행 (Makefile 없이)

```bash
# 1. 백엔드 실행
python -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
# .env 파일 수정 (DATABASE_URL 설정)
.venv/bin/uvicorn server.main:app --reload

# 2. 프론트엔드 실행 (새 터미널)
cd client
npm install
npm run dev
```

### 확인
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs
- 프론트엔드: http://localhost:5173

---

## 📚 문서 가이드

| 문서 | 대상 | 내용 |
|------|------|------|
| **[DOC/BEGINNER_QUICK_START.md](./DOC/BEGINNER_QUICK_START.md)** | 초보자 | 환경 설정부터 첫 실행까지 |
| **[DOC/ARCHITECTURE.md](./DOC/ARCHITECTURE.md)** | 개발자 | 시스템 아키텍처 및 설계 원칙 |
| **[DOC/DEVELOPMENT_GUIDE.md](./DOC/DEVELOPMENT_GUIDE.md)** | 개발자 | 도메인 추가, 코딩 규칙, 체크리스트 |
| **[DOC/PROJECT_HANDOVER.md](./DOC/PROJECT_HANDOVER.md)** | 인수인계 | 프로젝트 전체 개요 및 운영 가이드 |
| **[server/README.md](./server/README.md)** | 백엔드 개발자 | 백엔드 상세 가이드 |
| **[client/README.md](./client/README.md)** | 프론트엔드 개발자 | 프론트엔드 상세 가이드 |
| **[.cursorrules](./.cursorrules)** | AI 에이전트 | Cursor/Claude AI 코딩 규칙 |

---

## 🔧 주요 기능

### 백엔드
- ✅ 계층화된 아키텍처 (Router → Service → Repository/Calculator/Formatter)
- ✅ Alembic 기반 DB 마이그레이션
- ✅ JWT 인증 및 세션 관리
- ✅ Request ID 추적 로깅
- ✅ 전역 예외 처리
- ✅ Health Check & Version API

### 프론트엔드
- ✅ React 19 + TypeScript
- ✅ Tailwind CSS 4 디자인 시스템
- ✅ Zustand 상태 관리
- ✅ API 클라이언트 (Axios)
- ✅ 전역 에러/로딩 처리
- ✅ 반응형 레이아웃

---

## 🛠️ 개발 워크플로우

### 1. 새 도메인 추가
자세한 내용은 [DOC/DEVELOPMENT_GUIDE.md](./DOC/DEVELOPMENT_GUIDE.md) 참조

```bash
# 백엔드 도메인 생성
mkdir -p server/app/domain/{domain_name}/{models,schemas,repositories,calculators,formatters}

# 프론트엔드 도메인 생성
mkdir -p client/src/domains/{domain_name}/{components,pages}
```

### 2. DB 스키마 변경
**반드시 Alembic 사용**

```bash
# 마이그레이션 생성
alembic revision --autogenerate -m "Add user table"

# 적용
alembic upgrade head

# 롤백
alembic downgrade -1
```

### 3. 코드 품질 검사
```bash
# 백엔드
black server/
isort server/
ruff check server/
mypy server/

# 프론트엔드
cd client
npm run lint
```

---

## 🤝 기여 가이드

1. `.cursorrules` 파일의 코딩 규칙 준수
2. 모든 테스트 통과 확인
3. 코드 포맷팅 적용
4. PR 전 문서 업데이트

---

## 📄 라이센스

MIT License

---

## 📧 문의

GitHub Issues를 통해 문의해주세요.

---

**Happy Vibe Coding! 🎉**
