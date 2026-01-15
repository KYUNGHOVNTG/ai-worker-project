# 🚀 AI 바이브코딩 환경 웹 서비스 템플릿

> **"유지보수성 최우선" 및 "모듈화"를 핵심 가치로 하는 바이브 코딩(Vibe Coding) 환경**

빠른 시작을 위한 FastAPI + SQLAlchemy 2.0 + React 19 + Tailwind 4 기반의 풀스택 웹 애플리케이션

---

## 📖 목차

- [프로젝트 비전](#-프로젝트-비전)
- [핵심 철학](#-핵심-철학)
- [기술 스택 아키텍처](#-기술-스택-아키텍처)
- [프로젝트 구조](#-프로젝트-구조)
- [아키텍처 개요](#-아키텍처-개요)
- [빠른 시작](#-빠른-시작)
- [도메인 플러그인 추가하기](#-도메인-플러그인-추가하기)
- [개발 가이드](#-개발-가이드)
- [문서](#-문서)

---

## 🎯 프로젝트 비전

이 프로젝트는 **확장 가능하고 유지보수하기 쉬운 AI 바이브코딩 기반 웹 서비스**를 위한 생산급(Production-Ready) 풀스택 템플릿입니다.

### 왜 이 템플릿인가?

- **도메인 플러그인 구조**: 새로운 비즈니스 도메인을 독립적으로 추가 가능 (충돌 최소화)
- **계층화된 아키텍처**: 명확한 책임 분리로 테스트 가능하고 유지보수 쉬움
- **타입 안전성**: Pydantic v2 + SQLAlchemy 2.0 + TypeScript로 런타임 에러 최소화
- **비동기 최적화**: async/await 기반으로 높은 처리량 보장
- **모던 기술 스택**: React 19, Tailwind 4, Zustand 등 최신 기술 적용
- **운영 준비 완료**: Request ID 로깅, Health Check, 전역 에러/로딩 처리 내장

---

## 💡 핵심 철학

### 1. **유지보수성 최우선**
- 모든 비즈니스 로직은 **클래스 기반**으로 작성 (절차지향 함수 금지)
- 명확한 **계층화된 폴더 구조** (Router-Service-Repository-Calculator-Formatter)
- **단일 책임 원칙(SRP)** 준수: 각 클래스는 하나의 역할만 담당

### 2. **모듈화 & 도메인 독립성**
- 각 도메인은 **자체 완결적(Self-contained)** 구조
- 도메인 간 의존성 최소화로 **병렬 개발** 가능
- 새로운 기능 추가 시 **기존 코드 변경 최소화**

### 3. **타입 안전성**
- 백엔드: Pydantic v2로 런타임 검증 + mypy로 정적 타입 체크
- 프론트엔드: TypeScript로 컴파일 타임 에러 사전 방지
- 계층 간 데이터 전달은 **명시적 DTO(Data Transfer Object)** 사용

### 4. **테스트 가능성**
- 의존성 주입(Dependency Injection) 패턴으로 Mock 가능
- 순수 함수(Calculator) / Side Effect 함수(Repository) 명확히 분리
- Unit/Integration 테스트 작성 가능한 구조

---

## 🏗️ 기술 스택 아키텍처

### 백엔드 (Python 3.12)

| 레이어 | 기술 | 목적 |
|--------|------|------|
| **Web Framework** | FastAPI 0.109.0 | 고성능 비동기 REST API, 자동 문서화 |
| **ORM** | SQLAlchemy 2.0.25 (async) | 비동기 데이터베이스 접근, 타입 안전 쿼리 |
| **Database Driver** | asyncpg 0.29.0 | PostgreSQL 비동기 드라이버 |
| **Validation** | Pydantic v2.5.3 | 런타임 데이터 검증, 자동 API 문서화 |
| **Authentication** | python-jose 3.3.0 + passlib 1.7.4 | JWT 토큰 + 비밀번호 해싱 |
| **Migration** | Alembic 1.13.1 | 데이터베이스 스키마 버전 관리 |
| **Testing** | pytest 7.4.4 + pytest-asyncio 0.23.3 | 비동기 테스트 지원 |
| **Code Quality** | black + isort + ruff + mypy | 자동 포맷팅, 린팅, 타입 체크 |
| **Logging** | Request ID 추적, 구조화된 로그 | 운영 환경 로깅 및 추적 |
| **Monitoring** | Health Check + Version Endpoint | 서비스 상태 모니터링 |

### 프론트엔드 (TypeScript 5.9)

| 레이어 | 기술 | 목적 |
|--------|------|------|
| **UI Framework** | React 19.2.0 | 선언적 UI, 최신 React 기능 (Concurrent Features) |
| **Build Tool** | Vite 7.2.4 | 빠른 HMR, 최적화된 프로덕션 빌드 |
| **Styling** | Tailwind CSS 4.1.18 | 유틸리티 우선 CSS, 모던 핀테크 디자인 |
| **State Management** | Zustand 5.0.9 | 경량 상태 관리, Redux 대체 |
| **HTTP Client** | Axios 1.13.2 | API 통신, 인터셉터 지원 |
| **Routing** | React Router DOM 7.12.0 | SPA 라우팅 |
| **Animation** | Framer Motion 12.25.0 | 부드러운 UI 애니메이션 |
| **Icons** | Lucide React 0.562.0 | 일관된 아이콘 시스템 |
| **Error Handling** | ErrorBoundary + ApiErrorHandler | 전역 에러 처리 |
| **Loading** | LoadingOverlay + LoadingManager | 전역 로딩 상태 관리 |

### 인프라 & DevOps

- **Database**: PostgreSQL (asyncpg)
- **Package Manager**:
  - Backend: pip + pyproject.toml
  - Frontend: npm (pnpm/yarn 호환)
- **Version Control**: Git + GitHub
- **Editor Support**: Cursor / Claude AI 에이전트 최적화 (`.cursorrules` 포함)

---

## 📂 프로젝트 구조

```
ai-worker-project/
├── 📁 server/                          # 백엔드 (FastAPI)
│   ├── main.py                         # FastAPI 애플리케이션 진입점
│   └── app/
│       ├── 📁 core/                    # 핵심 인프라
│       │   ├── config.py               # 환경 설정 (Pydantic Settings)
│       │   ├── database.py             # SQLAlchemy 엔진 & 세션
│       │   ├── dependencies.py         # FastAPI DI (DB, Auth, Pagination)
│       │   ├── logging.py              # 로깅 설정 (Request ID 포함)
│       │   ├── middleware.py           # 미들웨어 (Request ID, External Logging)
│       │   └── routers.py              # Core 엔드포인트 (Health, Version)
│       ├── 📁 shared/                  # 공유 컴포넌트
│       │   ├── 📁 base/                # 추상 베이스 클래스
│       │   │   ├── service.py          # BaseService (Facade + Template Method)
│       │   │   ├── repository.py         # BaseRepository (Data Access)
│       │   │   ├── calculator.py       # BaseCalculator (Pure Logic)
│       │   │   └── formatter.py        # BaseFormatter (Presentation)
│       │   ├── 📁 exceptions/          # 커스텀 예외 계층구조
│       │   └── 📁 types/               # 공통 타입 (ServiceResult, DTOs)
│       ├── 📁 domain/                  # 🎯 비즈니스 도메인 (여기에 새 기능 추가!)
│       ├── 📁 examples/                # 참고용 예제
│       │   └── sample_domain/          # 샘플 도메인 구현 (템플릿으로 활용)
│       │       ├── service.py          # SampleDomainService
│       │       ├── models/             # SQLAlchemy 모델
│       │       ├── schemas/            # Pydantic 스키마 (Request/Response)
│       │       ├── repositories/          # 데이터 조회 (SampleDataRepository)
│       │       ├── calculators/        # 비즈니스 로직 (SampleAnalysisCalculator)
│       │       └── formatters/         # 응답 포맷팅 (SampleResponseFormatter)
│       └── 📁 api/
│           └── v1/
│               ├── router.py           # API 라우터 통합
│               └── endpoints/          # 도메인별 엔드포인트
│
├── 📁 client/                          # 프론트엔드 (React + Vite)
│   ├── 📁 src/
│   │   ├── main.tsx                    # React 진입점
│   │   ├── App.tsx                     # 메인 앱 컴포넌트
│   │   ├── 📁 core/                    # 핵심 유틸리티 & 인프라
│   │   │   ├── 📁 api/                 # API 클라이언트 (Axios 싱글톤)
│   │   │   ├── 📁 errors/              # 에러 처리 (ErrorBoundary, ApiErrorHandler)
│   │   │   ├── 📁 loading/             # 로딩 처리 (LoadingOverlay, LoadingManager)
│   │   │   ├── 📁 hooks/               # 커스텀 훅 (useApi, useDebounce)
│   │   │   ├── 📁 layout/              # 레이아웃 (Header, Sidebar, MainLayout)
│   │   │   ├── 📁 store/               # 전역 상태 (useAuthStore)
│   │   │   └── 📁 ui/                  # 재사용 UI 컴포넌트 (Button, Card, Input)
│   │   ├── 📁 domains/                 # 🎯 도메인별 기능 (백엔드 미러링)
│   │   │   └── sample/                 # 샘플 도메인
│   │   │       ├── api.ts              # API 호출 함수
│   │   │       ├── store.ts            # Zustand 스토어 (useSampleStore)
│   │   │       ├── types.ts            # TypeScript 타입
│   │   │       ├── components/         # 도메인 전용 컴포넌트
│   │   │       └── pages/              # 도메인 페이지
│   │   └── 📁 types/                   # 전역 TypeScript 타입
│   ├── package.json                    # npm 의존성
│   ├── vite.config.ts                  # Vite 설정 (프록시, 플러그인)
│   └── tsconfig.json                   # TypeScript 설정
│
├── 📁 tests/                           # 테스트
│   ├── unit/                           # 단위 테스트
│   ├── integration/                    # 통합 테스트
│   └── conftest.py                     # pytest 설정
│
├── 📄 .cursorrules                     # Cursor/Claude AI 코딩 규칙
├── 📄 DEVELOPMENT_GUIDE.md             # 개발 가이드 (도메인 추가 체크리스트)
├── 📄 ARCHITECTURE.md                  # 상세 아키텍처 문서
├── 📄 requirements.txt                 # Python 의존성
├── 📄 pyproject.toml                   # Python 프로젝트 설정
└── 📄 .env.example                     # 환경 변수 예제
```

---

## 🔧 아키텍처 개요

### 계층화된 아키텍처 (Layered Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP Request (POST /api/v1/sample/analyze)   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  🌐 Router Layer (FastAPI)                                      │
│  • HTTP 요청/응답 처리                                           │
│  • Pydantic 입력 검증                                           │
│  • 에러 핸들링 (try/except → HTTP status code)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  🎯 Service Layer (Facade + Template Method Pattern)           │
│  • 비즈니스 로직 조율 (Repository → Calculator → Formatter)        │
│  • 트랜잭션 관리 & 권한 검증                                     │
│  • before_execute() / after_execute() 훅 제공                   │
└───────────┬──────────────────────┬──────────────────────────────┘
            │                      │
            ▼                      ▼
┌───────────────────┐    ┌──────────────────────┐    ┌────────────────────┐
│  📦 Repository      │    │  🧮 Calculator       │    │  📝 Formatter      │
│  (Data Layer)     │    │  (Business Logic)    │    │  (Presentation)    │
│                   │    │                      │    │                    │
│  • DB 쿼리        │    │  • 순수 함수         │    │  • API 응답 포맷   │
│  • 외부 API 호출  │    │  • 통계 분석         │    │  • 필드 매핑       │
│  • 파일 I/O       │    │  • 데이터 변환       │    │  • 민감정보 마스킹 │
│  • 캐시 조회      │    │  • 이상 탐지         │    │  • 날짜/시간 포맷  │
└───────────────────┘    └──────────────────────┘    └────────────────────┘
```

### 각 계층의 역할

| 계층 | 클래스 예시 | 책임 | 패턴 |
|------|------------|------|------|
| **Router** | `sample.py` | HTTP 요청 수신, 입력 검증, Service 호출, HTTP 응답 반환 | FastAPI Route Decorator |
| **Service** | `BaseService[TRequest, TResponse]` | Repository/Calculator/Formatter 조율, 트랜잭션 관리, 에러 핸들링 | Facade, Template Method |
| **Repository** | `BaseRepository[TInput, TOutput]` | 데이터 조회 (DB/API/Cache), Side Effect 허용 | Strategy, Dependency Injection |
| **Calculator** | `BaseCalculator[TInput, TOutput]` | 순수 계산 로직, Side Effect 금지, 테스트 가능 | Pure Functions |
| **Formatter** | `BaseFormatter[TInput, TOutput]` | 내부 데이터 → API 응답 변환, 직렬화 | Adapter |

### 데이터 흐름 예시

```python
# 1. HTTP Request → Router
@router.post("/analyze", response_model=SampleAnalysisResponse)
async def analyze_data(request: SampleAnalysisRequest, db: AsyncSession = Depends(get_db)):

    # 2. Router → Service
    service = SampleDomainService(db=db)
    result = await service.execute(request)

    # 3. Service 내부 흐름:
    #    a) Repository: 데이터 조회
    repository_output = await self.repository.provide(repository_input)

    #    b) Calculator: 비즈니스 로직 실행
    calc_output = await self.calculator.calculate(calc_input)

    #    c) Formatter: 응답 포맷팅
    formatted = await self.formatter.format(formatter_input)

    # 4. Service → Router → HTTP Response
    return result.data
```

---

## 🚀 빠른 시작

### 사전 준비사항

- **Python 3.12+** ([다운로드](https://www.python.org/downloads/))
- **Node.js 18+** ([다운로드](https://nodejs.org/))
- **Supabase 계정** (권장) - [무료 가입](https://supabase.com)
- 또는 **PostgreSQL** (로컬 개발) - [다운로드](https://www.postgresql.org/download/)

### 1️⃣ 백엔드 실행

```bash
# 1. 프로젝트 루트로 이동
cd ai-worker-project

# 2. Python 가상환경 생성 & 활성화
python3 -m venv .venv

.venv\Scripts\activate

# 3. 의존성 설치
pip install -r requirements.txt

# 4. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 데이터베이스 연결 정보 수정

# 5. Supabase 데이터베이스 설정 (권장)

# 5-1. https://supabase.com 에서 새 프로젝트 생성
#      - 프로젝트명, 데이터베이스 비밀번호, 리전 선택
#      - 프로젝트 생성 완료까지 2-3분 대기

# 5-2. Supabase SQL Editor에서 초기 테이블 생성
#      - Dashboard > SQL Editor > New query 클릭
#      - 프로젝트 루트의 supabase_schema.sql 파일 내용 복사
#      - 붙여넣기 후 Run 버튼 클릭
#      - connection_tests 테이블 생성 및 초기 데이터 삽입 확인

# 5-3. Transaction Pooler Connection String 복사 (중요!)
#      - Settings > Database > Connection string 탭
#      - Type: URI 선택
#      - Source: Primary Database 선택
#      - Method: "Transaction pooler" 선택 (권장, 포트 6543)
#      - Connection string 복사
#      - 형식: postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-xx-xx.pooler.supabase.com:6543/postgres

# 5-4. .env 파일에 DATABASE_URL 설정
#      - postgresql:// → postgresql+asyncpg:// 로 변경 (asyncpg 드라이버 명시)
#      - 비밀번호에 특수문자가 있으면 URL 인코딩 필수
#        예: ! → %21, @ → %40, # → %23
#      - 예시:
#        DATABASE_URL=postgresql+asyncpg://postgres.cafquolsrqkhpqejgojd:yourP%40ssw0rd%21@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres

# 5-5. 설정 확인
#      - 개별 변수(POSTGRES_HOST 등)는 주석 처리 또는 삭제
#      - DATABASE_URL이 우선순위가 높으므로 이것만 설정하면 됨


# 6. 백엔드 서버 실행
python -m server.main
# → http://localhost:8000 에서 실행
# → http://localhost:8000/docs 에서 API 문서 확인
```

### 2️⃣ 프론트엔드 실행

```bash
# 1. 새 터미널에서 프론트엔드 디렉토리로 이동
cd client

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000 에서 실행 (Vite가 자동으로 API 프록시)
```

### ✅ 실행 확인

- **백엔드 API**: http://localhost:8000
- **API 문서 (Swagger)**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/core/health
- **Version Info**: http://localhost:8000/core/version
- **프론트엔드**: http://localhost:3000

---

## 🎯 도메인 플러그인 추가하기

새로운 비즈니스 기능을 추가하는 방법입니다. 예시: `payment` 도메인 추가

### 빠른 가이드

```bash
# 1. 도메인 디렉토리 생성
mkdir -p server/app/domain/payment/{models,schemas,repositories,calculators,formatters}

# 2. 각 파일 생성 (__init__.py 포함)
touch server/app/domain/payment/__init__.py
touch server/app/domain/payment/service.py
touch server/app/domain/payment/models/__init__.py
touch server/app/domain/payment/schemas/__init__.py
touch server/app/domain/payment/repositories/__init__.py
touch server/app/domain/payment/calculators/__init__.py
touch server/app/domain/payment/formatters/__init__.py

# 3. API 엔드포인트 생성
touch server/app/api/v1/endpoints/payment.py

# 4. 프론트엔드 도메인 생성
mkdir -p client/src/domains/payment/{components,pages}
touch client/src/domains/payment/api.ts
touch client/src/domains/payment/store.ts
touch client/src/domains/payment/types.ts
```

### 구현 순서 (체크리스트)

자세한 내용은 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)를 참조하세요.

#### 백엔드

- [ ] **1단계**: `models/__init__.py` - SQLAlchemy 모델 정의
- [ ] **2단계**: `schemas/__init__.py` - Pydantic Request/Response 스키마
- [ ] **3단계**: `repositories/__init__.py` - 데이터 조회 로직 (BaseRepository 상속)
- [ ] **4단계**: `calculators/__init__.py` - 비즈니스 로직 (BaseCalculator 상속)
- [ ] **5단계**: `formatters/__init__.py` - 응답 포맷팅 (BaseFormatter 상속)
- [ ] **6단계**: `service.py` - Service 클래스 (BaseService 상속)
- [ ] **7단계**: `api/v1/endpoints/payment.py` - FastAPI 라우터
- [ ] **8단계**: `api/v1/router.py`에 라우터 등록

#### 프론트엔드

- [ ] **1단계**: `types.ts` - TypeScript 타입 정의
- [ ] **2단계**: `api.ts` - API 호출 함수 (ApiClient 사용)
- [ ] **3단계**: `store.ts` - Zustand 상태 관리
- [ ] **4단계**: `components/` - UI 컴포넌트 작성
- [ ] **5단계**: `pages/` - 페이지 컴포넌트 작성
- [ ] **6단계**: 라우터에 페이지 등록

---

## 📚 개발 가이드

### 코드 품질 도구

```bash
# 코드 포맷팅 (자동)
black server/
isort server/

# 린팅 (문제 검사)
ruff check server/

# 타입 체크
mypy server/

# 프론트엔드 린팅
cd client
npm run lint
```

### 테스트 실행

```bash
# 전체 테스트
pytest

# 커버리지 포함
pytest --cov=server --cov-report=html

# 특정 테스트만
pytest tests/unit/
pytest tests/integration/

# 마커 사용
pytest -m unit
pytest -m integration
```

### 데이터베이스 마이그레이션

```bash
# Alembic 초기화 (최초 1회)
alembic init alembic

# 마이그레이션 생성
alembic revision --autogenerate -m "Add payment table"

# 마이그레이션 적용
alembic upgrade head

# 롤백
alembic downgrade -1
```

---

## 📖 문서

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: 상세 아키텍처 가이드 (디자인 패턴, 예외 처리, 테스트 전략)
- **[server/README.md](./server/README.md)**: 백엔드 개발 가이드 (Layered Architecture, 의존성 주입, DB 마이그레이션)
- **[client/README.md](./client/README.md)**: 프론트엔드 개발 가이드 (React 19, Zustand, Tailwind 4, API 통신)
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)**: 개발 가이드 (도메인 추가 상세 체크리스트, 코드 리뷰 기준)
- **[.cursorrules](./.cursorrules)**: Cursor/Claude AI 에이전트 코딩 규칙

---

## 🛑 문제 해결

### 백엔드 에러

| 에러 | 원인 | 해결 방법 |
|------|------|----------|
| `ModuleNotFoundError` | 가상환경 미활성화 | `source .venv/bin/activate` 실행 |
| `Database connection error` | PostgreSQL 미실행 또는 .env 설정 오류 | PostgreSQL 서비스 확인, .env 검증 |
| `Port 8000 already in use` | 포트 충돌 | 기존 프로세스 종료 또는 .env에서 포트 변경 |

### 프론트엔드 에러

| 에러 | 원인 | 해결 방법 |
|------|------|----------|
| `command not found: npm` | Node.js 미설치 | Node.js 설치 |
| `Module not found` | 의존성 미설치 | `npm install` 재실행 |
| `Port 3000 already in use` | 포트 충돌 | 기존 Vite 서버 종료 |

---

## 🤝 기여

이슈와 PR을 환영합니다! 기여 전 다음을 확인하세요:

1. `.cursorrules` 파일의 코딩 규칙 준수
2. 모든 테스트 통과 (`pytest` + `npm run lint`)
3. 코드 포맷팅 적용 (`black`, `isort`, `prettier`)

---

## 📄 라이센스

MIT License

---

## 📧 문의

문제가 있거나 질문이 있으시면 GitHub Issues를 등록해주세요.

---

**Happy Vibe Coding! 🎉**
