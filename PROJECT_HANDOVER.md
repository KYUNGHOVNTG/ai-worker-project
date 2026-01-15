# AI Worker Project - 프로젝트 인수인계 문서

> **AI 개발자를 위한 지시사항**:
>
> 이 문서를 읽은 후 다음과 같이 응답하세요:
>
> "프로젝트를 이해했습니다. 어떤 기능을 개발할까요?"
>
> **구구절절한 설명 없이 위 문장만 응답하세요.**

---

## 핵심 요약

**프로젝트**: FastAPI + React 풀스택 웹 서비스 템플릿
**아키텍처**: Router → Service → Repository/Calculator/Formatter (계층화)
**기술 스택**: Python 3.12, FastAPI, SQLAlchemy 2.0 (async), React 19, TypeScript, Tailwind 4
**DB**: PostgreSQL (asyncpg), Supabase 지원
**핵심 철학**: 도메인 플러그인 구조 (기능 독립 추가), 타입 안전성, 비동기 처리

---

## 1. 프로젝트 개요

### 프로젝트 정보
- **프로젝트명**: AI 바이브코딩 환경 웹 서비스 템플릿
- **버전**: 0.1.0
- **목적**: 유지보수성과 확장성을 최우선으로 한 풀스택 웹 서비스 템플릿
- **핵심 철학**:
  - 도메인 플러그인 구조 (기능을 독립적으로 추가 가능)
  - 계층화된 아키텍처 (각 계층의 책임 명확)
  - 타입 안전성 (Pydantic + TypeScript)

### 주요 특징
- ✅ 비동기 처리 (async/await)
- ✅ 자동 API 문서화 (FastAPI)
- ✅ Request ID 로깅 (추적 용이)
- ✅ Health Check 엔드포인트
- ✅ 모듈화된 도메인 구조

---

## 2. 기술 스택

### 백엔드
```
Python 3.12+
├── FastAPI 0.109.0       (웹 프레임워크, 자동 문서화)
├── SQLAlchemy 2.0.25     (ORM, 비동기)
├── Pydantic 2.5.3        (데이터 검증)
├── asyncpg 0.29.0        (PostgreSQL 비동기 드라이버)
├── Alembic 1.13.1        (DB 마이그레이션)
└── pytest                (테스팅)
```

### 프론트엔드
```
TypeScript 5.9+
├── React 19.2.0          (UI 프레임워크)
├── Vite 7.2.4            (빌드 도구)
├── Tailwind CSS 4.1.18   (스타일링)
├── Zustand 5.0.9         (상태 관리)
├── Axios 1.13.2          (HTTP 클라이언트)
└── React Router 7.12.0   (라우팅)
```

### 데이터베이스
- PostgreSQL (asyncpg를 통한 비동기 연결)

---

## 3. 폴더 구조

```
vibe-web-starter/
├── 📁 server/                    # 백엔드 (FastAPI)
│   ├── main.py                   # 애플리케이션 진입점
│   └── app/
│       ├── 📁 core/              # 핵심 인프라
│       │   ├── config.py         # 환경 설정
│       │   ├── database.py       # DB 연결
│       │   ├── dependencies.py   # FastAPI DI
│       │   └── middleware.py     # Request ID 추적
│       ├── 📁 shared/            # 공유 컴포넌트
│       │   ├── 📁 base/          # 추상 베이스 클래스
│       │   │   ├── service.py    # BaseService
│       │   │   ├── repository.py   # BaseRepository
│       │   │   ├── calculator.py # BaseCalculator
│       │   │   └── formatter.py  # BaseFormatter
│       │   ├── 📁 exceptions/    # 커스텀 예외
│       │   └── 📁 types/         # 공통 타입
│       ├── 📁 domain/            # 🎯 비즈니스 도메인 (여기에 기능 추가!)
│       ├── 📁 examples/          # 참고 예제
│       │   └── sample_domain/    # 샘플 도메인 (템플릿)
│       └── 📁 api/v1/
│           ├── router.py         # API 라우터 통합
│           └── 📁 endpoints/     # 도메인별 엔드포인트
│
├── 📁 client/                    # 프론트엔드 (React)
│   └── src/
│       ├── App.tsx               # 메인 앱
│       ├── 📁 core/              # 핵심 유틸리티
│       │   ├── 📁 api/           # API 클라이언트
│       │   ├── 📁 hooks/         # 커스텀 훅
│       │   ├── 📁 store/         # Zustand 스토어
│       │   └── 📁 ui/            # UI 컴포넌트
│       └── 📁 domains/           # 🎯 도메인 기능 (여기에 기능 추가!)
│           └── sample/           # 샘플 도메인
│               ├── api.ts        # API 호출
│               ├── store.ts      # 상태 관리
│               ├── types.ts      # 타입 정의
│               └── 📁 pages/     # 페이지 컴포넌트
│
├── 📁 tests/                     # 테스트
├── 📄 requirements.txt           # Python 의존성
├── 📄 .env.example               # 환경 변수 예제
└── 📄 ARCHITECTURE.md            # 상세 아키텍처 문서
```

---

## 4. 아키텍처 핵심 원리

### 계층화된 아키텍처 (Layered Architecture)

각 계층은 명확한 책임을 가지며 서로 분리되어 있습니다:

```
HTTP Request
     ↓
┌─────────────────────────────────┐
│  Router (API 엔드포인트)         │  ← HTTP 요청/응답 처리
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│  Service (비즈니스 로직 조율)    │  ← 트랜잭션, 흐름 제어
└────────────┬────────────────────┘
             ↓
    ┌────────┼────────┐
    ↓        ↓        ↓
┌────────┐┌──────┐┌─────────┐
│Repository││Calculator││Formatter│
│(데이터)││(계산)││(포맷팅)│
└────────┘└──────┘└─────────┘
```

### 각 계층의 책임

| 계층 | 책임 | 예시 |
|------|------|------|
| **Router** | HTTP 요청/응답, 입력 검증 | `@router.post("/analyze")` |
| **Service** | 비즈니스 흐름 제어, 트랜잭션 관리 | Repository → Calculator → Formatter 조율 |
| **Repository** | 데이터 조회 (DB, API, 캐시) | DB에서 사용자 정보 조회 |
| **Calculator** | 순수 계산 로직 (부수 효과 없음) | 통계 분석, 점수 계산 |
| **Formatter** | 내부 데이터 → API 응답 변환 | ORM 모델 → JSON 응답 |

### 도메인 플러그인 구조

각 도메인은 독립적인 모듈로, 서로 충돌 없이 기능을 추가할 수 있습니다:

```
server/app/domain/[도메인명]/
├── models/          # SQLAlchemy ORM 모델
├── schemas/         # Pydantic 요청/응답 스키마
├── repositories/       # 데이터 조회 로직
├── calculators/     # 비즈니스 계산 로직
├── formatters/      # 응답 포맷팅
└── service.py       # 도메인 서비스 (전체 조율)
```

---

## 5. 시작하기

### 백엔드 실행

```bash
# 1. 가상환경 생성 및 활성화
python3 -m venv .venv
source .venv/bin/activate

# 2. 의존성 설치
pip install -r requirements.txt

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일을 수정하여 데이터베이스 정보 입력

# 4. 데이터베이스 마이그레이션
alembic upgrade head

# 5. 개발 서버 실행
python -m server.main

# 실행 결과:
# → http://localhost:8000
# → API 문서: http://localhost:8000/docs
```

### 프론트엔드 실행

```bash
# 1. 프론트엔드 디렉토리로 이동
cd client

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 실행 결과:
# → http://localhost:3000
```

---

## 6. API 엔드포인트

### 기본 엔드포인트

```
GET  /core/health           → 서버 상태 체크
GET  /core/version          → 버전 정보
GET  /api/v1/health         → API v1 상태
```

### 샘플 도메인 (예제)

```
GET  /api/v1/sample         → 샘플 데이터 목록
POST /api/v1/sample/analyze → 데이터 분석 실행
GET  /api/v1/sample/data/{id} → 데이터 조회
POST /api/v1/sample/data    → 데이터 생성
PUT  /api/v1/sample/data/{id} → 데이터 수정
DELETE /api/v1/sample/data/{id} → 데이터 삭제
```

### API 문서 확인

백엔드 실행 후 브라우저에서 접속:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 7. 새 기능 추가 방법

### 백엔드: 새 도메인 추가 (예: "payment" 도메인)

#### 1단계: 폴더 구조 생성

```bash
mkdir -p server/app/domain/payment/{models,schemas,repositories,calculators,formatters}
touch server/app/domain/payment/__init__.py
touch server/app/domain/payment/service.py
```

#### 2단계: ORM 모델 정의

**파일**: `server/app/domain/payment/models/__init__.py`

```python
from sqlalchemy.orm import Mapped, mapped_column
from server.app.core.database import Base

class PaymentModel(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)
    amount: Mapped[float]
    status: Mapped[str]
    created_at: Mapped[datetime]
```

#### 3단계: Pydantic 스키마 정의

**파일**: `server/app/domain/payment/schemas/__init__.py`

```python
from pydantic import BaseModel, Field

class PaymentRequest(BaseModel):
    amount: float = Field(..., gt=0)
    description: str

class PaymentResponse(BaseModel):
    id: int
    amount: float
    status: str
```

#### 4단계: Repository 구현

**파일**: `server/app/domain/payment/repositories/__init__.py`

```python
from server.app.shared.base import BaseRepository

class PaymentDataRepository(BaseRepository):
    """결제 데이터 조회"""

    async def provide(self, payment_id: int):
        # DB에서 결제 정보 조회
        result = await self.db.execute(
            select(PaymentModel).where(PaymentModel.id == payment_id)
        )
        return result.scalar_one_or_none()
```

#### 5단계: Calculator 구현

**파일**: `server/app/domain/payment/calculators/__init__.py`

```python
from server.app.shared.base import BaseCalculator

class PaymentCalculator(BaseCalculator):
    """결제 금액 계산 (순수 로직)"""

    async def calculate(self, amount: float, discount_rate: float):
        # 할인 적용 계산
        discounted_amount = amount * (1 - discount_rate)
        return {"final_amount": discounted_amount}
```

#### 6단계: Formatter 구현

**파일**: `server/app/domain/payment/formatters/__init__.py`

```python
from server.app.shared.base import BaseFormatter

class PaymentFormatter(BaseFormatter):
    """결제 응답 포맷팅"""

    async def format(self, payment_model: PaymentModel):
        return PaymentResponse(
            id=payment_model.id,
            amount=payment_model.amount,
            status=payment_model.status
        )
```

#### 7단계: Service 구현

**파일**: `server/app/domain/payment/service.py`

```python
from server.app.shared.base import BaseService
from .repositories import PaymentDataRepository
from .calculators import PaymentCalculator
from .formatters import PaymentFormatter

class PaymentService(BaseService):
    """결제 도메인 서비스"""

    async def execute(self, request: PaymentRequest):
        # 1. 데이터 조회 (Repository)
        repository = PaymentDataRepository(self.db)
        data = await repository.provide(request.id)

        # 2. 계산 로직 (Calculator)
        calculator = PaymentCalculator()
        result = await calculator.calculate(data.amount, 0.1)

        # 3. 응답 포맷팅 (Formatter)
        formatter = PaymentFormatter()
        response = await formatter.format(data)

        return ServiceResult(success=True, data=response)
```

#### 8단계: API 엔드포인트 추가

**파일**: `server/app/api/v1/endpoints/payment.py`

```python
from fastapi import APIRouter, Depends
from server.app.domain.payment.service import PaymentService
from server.app.domain.payment.schemas import PaymentRequest

router = APIRouter(prefix="/payment", tags=["payment"])

@router.post("/")
async def create_payment(
    request: PaymentRequest,
    db: AsyncSession = Depends(get_db)
):
    service = PaymentService(db)
    result = await service.execute(request)
    return result.data
```

#### 9단계: 라우터 등록

**파일**: `server/app/api/v1/router.py`

```python
from server.app.api.v1.endpoints import payment

# 기존 라우터에 추가
api_router.include_router(payment.router)
```

#### 10단계: 마이그레이션 생성 및 적용

```bash
# 마이그레이션 파일 생성
alembic revision --autogenerate -m "Add payment table"

# 마이그레이션 적용
alembic upgrade head
```

### 프론트엔드: 새 도메인 추가

#### 1단계: 폴더 구조 생성

```bash
mkdir -p client/src/domains/payment/{components,pages}
touch client/src/domains/payment/{api.ts,store.ts,types.ts}
```

#### 2단계: 타입 정의

**파일**: `client/src/domains/payment/types.ts`

```typescript
export interface Payment {
  id: number;
  amount: number;
  status: string;
}

export interface PaymentRequest {
  amount: number;
  description: string;
}
```

#### 3단계: API 함수 작성

**파일**: `client/src/domains/payment/api.ts`

```typescript
import apiClient from '@/core/api/client';
import { Payment, PaymentRequest } from './types';

export const createPayment = async (request: PaymentRequest): Promise<Payment> => {
  const response = await apiClient.post<Payment>('/api/v1/payment', request);
  return response.data;
};
```

#### 4단계: Zustand 스토어 생성

**파일**: `client/src/domains/payment/store.ts`

```typescript
import { create } from 'zustand';
import { Payment } from './types';

interface PaymentStore {
  payments: Payment[];
  addPayment: (payment: Payment) => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  addPayment: (payment) => set((state) => ({
    payments: [...state.payments, payment]
  })),
}));
```

#### 5단계: 페이지 컴포넌트 작성

**파일**: `client/src/domains/payment/pages/PaymentPage.tsx`

```typescript
import React from 'react';
import { usePaymentStore } from '../store';
import { createPayment } from '../api';

export const PaymentPage: React.FC = () => {
  const { payments, addPayment } = usePaymentStore();

  const handleSubmit = async (amount: number) => {
    const payment = await createPayment({ amount, description: '결제' });
    addPayment(payment);
  };

  return (
    <div>
      <h1>결제 페이지</h1>
      {/* UI 구현 */}
    </div>
  );
};
```

---

## 8. 주요 파일 위치

### 백엔드 핵심 파일

| 기능 | 파일 위치 |
|------|----------|
| 애플리케이션 진입점 | `/server/main.py` |
| 환경 설정 | `/server/app/core/config.py` |
| 데이터베이스 연결 | `/server/app/core/database.py` |
| FastAPI 의존성 주입 | `/server/app/core/dependencies.py` |
| Request ID 미들웨어 | `/server/app/core/middleware.py` |
| BaseService | `/server/app/shared/base/service.py` |
| BaseRepository | `/server/app/shared/base/repository.py` |
| BaseCalculator | `/server/app/shared/base/calculator.py` |
| BaseFormatter | `/server/app/shared/base/formatter.py` |
| 커스텀 예외 | `/server/app/shared/exceptions/__init__.py` |
| 공통 타입 | `/server/app/shared/types/__init__.py` |
| API 라우터 통합 | `/server/app/api/v1/router.py` |
| 샘플 도메인 (참고용) | `/server/app/examples/sample_domain/` |

### 프론트엔드 핵심 파일

| 기능 | 파일 위치 |
|------|----------|
| 메인 앱 | `/client/src/App.tsx` |
| API 클라이언트 | `/client/src/core/api/client.ts` |
| 에러 경계 | `/client/src/core/errors/ErrorBoundary.tsx` |
| 로딩 오버레이 | `/client/src/core/loading/LoadingOverlay.tsx` |
| 인증 스토어 | `/client/src/core/store/useAuthStore.ts` |
| API 훅 | `/client/src/core/hooks/useApi.ts` |
| 메인 레이아웃 | `/client/src/core/layout/MainLayout.tsx` |
| 샘플 도메인 (참고용) | `/client/src/domains/sample/` |

### 설정 파일

| 파일 | 목적 |
|------|------|
| `.env.example` | 환경 변수 예제 |
| `requirements.txt` | Python 의존성 |
| `pyproject.toml` | Python 프로젝트 설정 (black, pytest 등) |
| `alembic.ini` | Alembic 마이그레이션 설정 |
| `client/package.json` | npm 의존성 |
| `client/vite.config.ts` | Vite 설정 |
| `client/tsconfig.json` | TypeScript 설정 |
| `client/tailwind.config.js` | Tailwind CSS 설정 |

---

## 9. 환경 설정

### 환경 변수 (.env)

**필수 설정 항목**:

```bash
# 애플리케이션
APP_NAME=vive-web-starter
DEBUG=True
ENVIRONMENT=development

# API
API_V1_PREFIX=/api/v1
ALLOWED_ORIGINS=["http://localhost:3000"]

# 데이터베이스 (PostgreSQL/Supabase)
POSTGRES_HOST=db.your-project.supabase.co
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_DB=postgres
DATABASE_URL=postgresql+asyncpg://postgres:password@host:5432/postgres

# 보안
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 로깅
LOG_LEVEL=INFO
```

### 프로덕션 환경 변경 필수 항목

⚠️ **운영 환경에 배포하기 전에 반드시 변경해야 할 항목**:

```bash
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=<강력한 랜덤 키로 변경>
ALLOWED_ORIGINS=[<실제 도메인>]
```

### 데이터베이스 연결

- **로컬 PostgreSQL**: `postgresql+asyncpg://user:password@localhost:5432/dbname`
- **Supabase**: Supabase 프로젝트 설정에서 연결 문자열 복사

---

## 10. 개발 팁

### 코드 품질 검사

```bash
# 포맷팅
black server/
isort server/

# 린팅
ruff check server/ --fix

# 타입 체크
mypy server/

# 테스트
pytest
pytest --cov=server  # 커버리지 포함
```

### 디버깅

**백엔드 디버깅**:
```bash
# SQL 쿼리 로깅
DB_ECHO=True

# 상세 로그
LOG_LEVEL=DEBUG
```

**프론트엔드 디버깅**:
- React DevTools (브라우저 확장)
- Redux DevTools (Zustand 디버깅)
- 브라우저 개발자 도구 (Network 탭)

### 일반적인 에러 해결

| 에러 | 해결 방법 |
|------|----------|
| `ModuleNotFoundError` | `source .venv/bin/activate` (가상환경 활성화) |
| `Database connection error` | PostgreSQL 서비스 시작 확인 |
| `Port 8000 already in use` | 기존 프로세스 종료 또는 포트 변경 |
| `CORS error` | `.env`의 `ALLOWED_ORIGINS` 확인 |

---

## 11. 참고 문서

### 프로젝트 내부 문서
- **README.md**: 프로젝트 개요 및 빠른 시작
- **ARCHITECTURE.md**: 상세 아키텍처 문서 (디자인 패턴 설명)
- **DEVELOPMENT_GUIDE.md**: 개발 실전 가이드

### 공식 문서
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 문서](https://docs.sqlalchemy.org/en/20/)
- [Pydantic 문서](https://docs.pydantic.dev/)
- [React 문서](https://react.dev/)
- [Vite 문서](https://vitejs.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/)

---

## 12. 체크리스트

### 개발 환경 설정 체크리스트

- [ ] Python 3.12+ 설치
- [ ] Node.js 18+ 설치
- [ ] PostgreSQL 설치 및 실행
- [ ] 가상환경 생성: `python3 -m venv .venv`
- [ ] 가상환경 활성화: `source .venv/bin/activate`
- [ ] 백엔드 의존성 설치: `pip install -r requirements.txt`
- [ ] 프론트엔드 의존성 설치: `cd client && npm install`
- [ ] `.env` 파일 생성 및 설정
- [ ] 데이터베이스 마이그레이션: `alembic upgrade head`
- [ ] 백엔드 실행: `python -m server.main`
- [ ] 프론트엔드 실행: `cd client && npm run dev`
- [ ] API 문서 확인: `http://localhost:8000/docs`

### 새 기능 개발 체크리스트

- [ ] 백엔드: 도메인 폴더 구조 생성
- [ ] 백엔드: ORM 모델 정의
- [ ] 백엔드: Pydantic 스키마 정의
- [ ] 백엔드: Repository 구현 (데이터 조회)
- [ ] 백엔드: Calculator 구현 (비즈니스 로직)
- [ ] 백엔드: Formatter 구현 (응답 포맷팅)
- [ ] 백엔드: Service 구현 (전체 조율)
- [ ] 백엔드: API 엔드포인트 추가
- [ ] 백엔드: 라우터 등록
- [ ] 백엔드: 마이그레이션 생성 및 적용
- [ ] 프론트엔드: 도메인 폴더 구조 생성
- [ ] 프론트엔드: 타입 정의
- [ ] 프론트엔드: API 함수 작성
- [ ] 프론트엔드: Zustand 스토어 생성
- [ ] 프론트엔드: 컴포넌트/페이지 작성
- [ ] 테스트 작성 (단위 테스트, 통합 테스트)
- [ ] 코드 품질 검사 (black, ruff, mypy)
- [ ] API 문서 확인 (`/docs`)

---

## 13. 요약

### 이 프로젝트를 다른 AI에게 설명한다면?

> 이 프로젝트는 **FastAPI + React**로 구성된 풀스택 웹 서비스 템플릿입니다.
>
> **핵심 특징**:
> 1. **계층화된 아키텍처**: Router → Service → Repository/Calculator/Formatter
> 2. **도메인 플러그인 구조**: 각 기능을 독립적인 모듈로 추가 가능
> 3. **타입 안전성**: Pydantic (백엔드) + TypeScript (프론트엔드)
> 4. **비동기 최적화**: async/await를 통한 성능 최적화
>
> **새 기능을 추가하려면**:
> - 백엔드: `server/app/domain/[기능명]/` 폴더에 모델, 스키마, 서비스 구현
> - 프론트엔드: `client/src/domains/[기능명]/` 폴더에 API, 스토어, 컴포넌트 구현
>
> **참고할 예제**: `/server/app/examples/sample_domain/` (백엔드), `/client/src/domains/sample/` (프론트엔드)

---

**작성일**: 2026-01-14
**버전**: 1.0.0

이 문서로 새로운 개발자나 AI가 프로젝트를 빠르게 이해하고 개발을 시작할 수 있습니다! 🚀
