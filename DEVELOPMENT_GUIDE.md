# 📘 개발 가이드 (Development Guide)

> **"유지보수성 최우선" 및 "모듈화"를 위한 실전 개발 가이드**

이 문서는 새로운 기능을 추가하거나 기존 코드를 수정할 때 참고하는 실전 가이드입니다.

---

## 📖 목차

- [코드 품질 관리](#-코드-품질-관리)
- [모듈화 가이드라인](#-모듈화-가이드라인)
- [도메인 추가 상세 체크리스트](#-도메인-추가-상세-체크리스트)
- [코드 리뷰 기준](#-코드-리뷰-기준)
- [충돌 방지 전략](#-충돌-방지-전략)
- [문제 해결 가이드](#-문제-해결-가이드)

---

## 🔍 코드 품질 관리

### 백엔드 (Python)

#### 1. 자동 포맷팅

```bash
# Black: 코드 포맷팅 (line length 100)
black server/

# isort: Import 정렬
isort server/

# 특정 파일만
black server/app/domain/payment/service.py
isort server/app/domain/payment/service.py
```

**설정** (`pyproject.toml`):
```toml
[tool.black]
line-length = 100
target-version = ['py312']

[tool.isort]
profile = "black"
line_length = 100
```

#### 2. 린팅 (Linting)

```bash
# Ruff: 빠른 린터 (Flake8, pylint 대체)
ruff check server/

# 자동 수정 가능한 문제 수정
ruff check server/ --fix

# 특정 규칙 무시
ruff check server/ --ignore E501
```

**주요 규칙**:
- E: pycodestyle errors
- W: pycodestyle warnings
- F: pyflakes
- I: isort
- C: complexity
- B: bugbear
- UP: pyupgrade

#### 3. 타입 체크

```bash
# mypy: 정적 타입 체크
mypy server/

# 특정 디렉토리만
mypy server/app/domain/payment/

# 엄격 모드
mypy server/ --strict
```

**일반적인 mypy 에러 해결**:

| 에러 | 원인 | 해결 |
|------|------|------|
| `error: Missing return statement` | 함수가 값을 반환하지 않음 | 반환 타입을 `None`으로 지정하거나 `return` 추가 |
| `error: Incompatible types` | 타입 불일치 | 올바른 타입으로 캐스팅하거나 타입 힌트 수정 |
| `error: Cannot determine type` | 타입 추론 실패 | 명시적 타입 힌트 추가 |

#### 4. 테스트

```bash
# 전체 테스트 실행
pytest

# 커버리지 포함
pytest --cov=server --cov-report=html --cov-report=term

# 특정 테스트만
pytest tests/unit/test_payment_calculator.py
pytest tests/integration/

# 마커로 필터링
pytest -m unit        # 단위 테스트만
pytest -m integration # 통합 테스트만
pytest -m "not slow"  # 느린 테스트 제외

# 실패한 테스트만 재실행
pytest --lf

# 상세 출력
pytest -v
pytest -vv
```

**테스트 작성 규칙**:
```python
# tests/unit/test_payment_calculator.py
import pytest
from decimal import Decimal

from server.app.domain.payment.calculators import PaymentCalculator

class TestPaymentCalculator:
    """PaymentCalculator 단위 테스트"""

    @pytest.fixture
    def calculator(self):
        """Calculator 인스턴스 픽스처"""
        return PaymentCalculator()

    @pytest.mark.asyncio
    async def test_calculate_fee_credit_card(self, calculator):
        """신용카드 수수료 계산 테스트"""
        # Given
        input_data = {
            "amount": Decimal("100000"),
            "payment_type": "credit_card",
            "user_tier": "silver"
        }

        # When
        result = await calculator.calculate(input_data)

        # Then
        assert result["fee"] == Decimal("3000")
        assert result["final_amount"] == Decimal("103000")

    @pytest.mark.asyncio
    async def test_calculate_fee_exceeds_limit(self, calculator):
        """한도 초과 검증 테스트"""
        input_data = {
            "amount": Decimal("10000000"),  # 1000만원
            "payment_type": "credit_card",
            "user_tier": "bronze"  # 한도: 100만원
        }

        result = await calculator.calculate(input_data)

        assert result["exceeds_limit"] is True
```

---

### 프론트엔드 (TypeScript)

#### 1. 린팅 & 포맷팅

```bash
cd client

# ESLint: 코드 검사
npm run lint

# Prettier: 코드 포맷팅 (설정된 경우)
npm run format

# 자동 수정
npm run lint:fix
```

#### 2. 타입 체크

```bash
# TypeScript 컴파일 체크 (빌드 없이)
npx tsc --noEmit

# Watch 모드
npx tsc --noEmit --watch
```

**일반적인 TypeScript 에러 해결**:

| 에러 | 원인 | 해결 |
|------|------|------|
| `Property does not exist on type` | 타입에 속성이 없음 | 타입 정의 확인 또는 optional chaining (`?.`) 사용 |
| `Type 'X' is not assignable to type 'Y'` | 타입 불일치 | 타입 캐스팅 또는 타입 가드 사용 |
| `Object is possibly 'undefined'` | null/undefined 가능성 | `if (obj)` 체크 또는 optional chaining 사용 |

#### 3. 빌드 테스트

```bash
# 프로덕션 빌드 테스트
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 🧩 모듈화 가이드라인

### 도메인 독립성 (Domain Isolation)

각 도메인은 **자체 완결적(Self-contained)**이어야 하며, 다른 도메인에 의존해서는 안 됩니다.

#### ✅ 좋은 예: 도메인 간 통신은 API를 통해

```python
# ❌ 나쁜 예: 직접 다른 도메인의 Service 호출
from server.app.domain.user.service import UserService

class PaymentService(BaseService):
    async def execute(self, request):
        user_service = UserService(self.db)
        user = await user_service.get_user(request.user_id)  # 직접 호출
        ...

# ✅ 좋은 예: Repository를 통해 데이터 조회
class PaymentService(BaseService):
    def __init__(self, db):
        self.db = db
        self.user_repository = UserDataRepository(db)  # 데이터 조회만

    async def execute(self, request):
        user = await self.user_repository.get_user(request.user_id)
        ...
```

#### ✅ 좋은 예: 공통 로직은 `shared/`로 추출

```python
# server/app/shared/utils/validators.py
def validate_email(email: str) -> bool:
    """이메일 검증 (모든 도메인에서 재사용 가능)"""
    import re
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

# 여러 도메인에서 사용
from server.app.shared.utils.validators import validate_email

class UserService:
    async def create_user(self, email: str):
        if not validate_email(email):
            raise ValidationException("Invalid email")

class PaymentService:
    async def send_receipt(self, email: str):
        if not validate_email(email):
            raise ValidationException("Invalid email")
```

---

### 공유 컴포넌트 설계

#### 백엔드: `app/shared/`

```
server/app/shared/
├── base/               # 추상 베이스 클래스
│   ├── service.py      # BaseService
│   ├── repository.py     # BaseRepository
│   ├── calculator.py   # BaseCalculator
│   └── formatter.py    # BaseFormatter
├── exceptions/         # 커스텀 예외
│   └── __init__.py
├── types/              # 공통 타입
│   └── __init__.py
├── utils/              # 유틸리티 함수
│   ├── validators.py   # 검증 함수
│   ├── converters.py   # 변환 함수
│   └── formatters.py   # 포맷팅 함수
└── middleware/         # FastAPI 미들웨어
    ├── logging.py
    └── error_handler.py
```

**규칙**:
- `shared/`의 코드는 특정 도메인에 의존하면 안 됨
- 순수 함수 또는 추상 클래스만 포함
- 비즈니스 로직 금지

#### 프론트엔드: `src/core/`

```
client/src/core/
├── api/                # API 클라이언트
├── hooks/              # 커스텀 훅
├── layout/             # 레이아웃 컴포넌트
├── store/              # 전역 상태
├── ui/                 # 재사용 UI 컴포넌트
└── utils/              # 유틸리티 함수
    ├── cn.ts           # Tailwind 클래스 병합
    ├── date.ts         # 날짜 포맷팅
    └── validators.ts   # 클라이언트 검증
```

**규칙**:
- `core/`의 컴포넌트는 도메인 로직을 포함하지 않음
- Props를 통해 모든 데이터를 받음
- 도메인별 스토어를 직접 참조하지 않음

---

## ✅ 도메인 추가 상세 체크리스트

새로운 도메인 `payment`를 추가하는 전체 과정입니다.

### Phase 1: 기획 & 설계

- [ ] **1.1 요구사항 정의**: 기능 명세서 작성
- [ ] **1.2 데이터 모델 설계**: ERD 작성, 테이블 스키마 정의
- [ ] **1.3 API 명세서 작성**: 엔드포인트, Request/Response 스키마
- [ ] **1.4 의존성 분석**: 다른 도메인과의 관계 파악

---

### Phase 2: 백엔드 구현

#### 단계 1: 디렉토리 생성

```bash
mkdir -p server/app/domain/payment/{models,schemas,repositories,calculators,formatters}
touch server/app/domain/payment/__init__.py
touch server/app/domain/payment/service.py
touch server/app/domain/payment/models/__init__.py
touch server/app/domain/payment/schemas/__init__.py
touch server/app/domain/payment/repositories/__init__.py
touch server/app/domain/payment/calculators/__init__.py
touch server/app/domain/payment/formatters/__init__.py
```

- [ ] **2.1 디렉토리 구조 생성 완료**

#### 단계 2: SQLAlchemy 모델 정의

**파일**: `server/app/domain/payment/models/__init__.py`

```python
from datetime import datetime
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from server.app.core.database import Base

class PaymentStatus(enum.Enum):
    """결제 상태"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=true)
    payment_method_id: Mapped[int] = mapped_column(ForeignKey("payment_methods.id"))

    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    final_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    currency: Mapped[str] = mapped_column(String(3), default="KRW")

    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus))
    description: Mapped[str | None] = mapped_column(String(200), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="payments")
    payment_method: Mapped["PaymentMethod"] = relationship()
```

- [ ] **2.2 SQLAlchemy 모델 정의 완료**
- [ ] **2.3 Relationship 설정 완료**

#### 단계 3: Pydantic 스키마 정의

**파일**: `server/app/domain/payment/schemas/__init__.py`

```python
from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from typing import Optional

class PaymentRequest(BaseModel):
    """결제 요청 스키마"""
    user_id: int = Field(..., description="사용자 ID", gt=0)
    payment_method_id: int = Field(..., description="결제 수단 ID", gt=0)
    amount: Decimal = Field(..., description="결제 금액", gt=0)
    currency: str = Field(default="KRW", description="통화 코드", pattern="^[A-Z]{3}$")
    description: Optional[str] = Field(None, description="결제 설명", max_length=200)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_id": 1,
                "payment_method_id": 1,
                "amount": 50000.00,
                "currency": "KRW",
                "description": "월간 구독료"
            }
        }
    )

class PaymentResponse(BaseModel):
    """결제 응답 스키마"""
    transaction_id: str = Field(..., description="트랜잭션 ID")
    status: str = Field(..., description="결제 상태")
    amount: float
    fee: float
    final_amount: float
    currency: str
    processed_at: str = Field(..., description="처리 시각 (ISO 8601)")
    message: str
```

- [ ] **2.4 Request 스키마 정의 완료**
- [ ] **2.5 Response 스키마 정의 완료**
- [ ] **2.6 Field 검증 규칙 추가 완료**

#### 단계 4: Repository 구현

**파일**: `server/app/domain/payment/repositories/__init__.py`

```python
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from server.app.shared.base import BaseRepository
from server.app.domain.payment.models import Payment, PaymentMethod
from server.app.shared.exceptions import NotFoundException

class PaymentDataRepository(BaseRepository[Dict[str, Any], Dict[str, Any]]):
    """결제 데이터 조회 Repository"""

    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db

    async def provide(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """데이터 조회 실행"""
        # 구현...
```

- [ ] **2.7 Repository 클래스 생성 완료**
- [ ] **2.8 DB 쿼리 로직 구현 완료**
- [ ] **2.9 예외 처리 추가 완료**

#### 단계 5: Calculator 구현

**파일**: `server/app/domain/payment/calculators/__init__.py`

```python
from typing import Dict, Any
from decimal import Decimal

from server.app.shared.base import BaseCalculator

class PaymentCalculator(BaseCalculator[Dict[str, Any], Dict[str, Any]]):
    """결제 수수료 및 한도 계산"""

    async def calculate(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """수수료 계산 및 한도 검증"""
        # 구현...
```

- [ ] **2.10 Calculator 클래스 생성 완료**
- [ ] **2.11 비즈니스 로직 구현 완료** (수수료 계산, 한도 검증 등)
- [ ] **2.12 단위 테스트 작성 완료**

#### 단계 6: Formatter 구현

**파일**: `server/app/domain/payment/formatters/__init__.py`

```python
from typing import Dict, Any
from datetime import datetime

from server.app.shared.base import BaseFormatter
from server.app.domain.payment.schemas import PaymentResponse

class PaymentResponseFormatter(BaseFormatter[Dict[str, Any], PaymentResponse]):
    """결제 응답 포맷터"""

    async def format(self, input_data: Dict[str, Any]) -> PaymentResponse:
        """내부 데이터를 API 응답 형식으로 변환"""
        # 구현...
```

- [ ] **2.13 Formatter 클래스 생성 완료**
- [ ] **2.14 응답 포맷팅 로직 구현 완료**

#### 단계 7: Service 구현

**파일**: `server/app/domain/payment/service.py`

```python
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.shared.base import BaseService
from server.app.shared.types import ServiceResult
from server.app.domain.payment.schemas import PaymentRequest, PaymentResponse
from server.app.domain.payment.repositories import PaymentDataRepository
from server.app.domain.payment.calculators import PaymentCalculator
from server.app.domain.payment.formatters import PaymentResponseFormatter

class PaymentService(BaseService[PaymentRequest, PaymentResponse]):
    """결제 서비스"""

    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db
        self.repository = PaymentDataRepository(db)
        self.calculator = PaymentCalculator()
        self.formatter = PaymentResponseFormatter()

    async def execute(self, request: PaymentRequest) -> ServiceResult[PaymentResponse]:
        """결제 처리 메인 로직"""
        # Repository → Calculator → Formatter 흐름
        # 구현...
```

- [ ] **2.15 Service 클래스 생성 완료**
- [ ] **2.16 Repository/Calculator/Formatter 조율 로직 구현 완료**
- [ ] **2.17 트랜잭션 관리 추가 완료**
- [ ] **2.18 에러 핸들링 추가 완료**

#### 단계 8: API 엔드포인트 구현

**파일**: `server/app/api/v1/endpoints/payment.py`

```python
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.dependencies import get_db
from server.app.domain.payment.service import PaymentService
from server.app.domain.payment.schemas import PaymentRequest, PaymentResponse

router = APIRouter(prefix="/payment", tags=["payment"])

@router.post(
    "/process",
    response_model=PaymentResponse,
    status_code=status.HTTP_200_OK,
    summary="결제 처리",
    description="사용자의 결제 요청을 처리하고 결과를 반환합니다."
)
async def process_payment(
    request: PaymentRequest,
    db: AsyncSession = Depends(get_db)
) -> PaymentResponse:
    """결제 처리 엔드포인트"""
    service = PaymentService(db=db)
    result = await service.execute(request)

    if not result.success:
        raise result.error

    return result.data
```

- [ ] **2.19 FastAPI 라우터 생성 완료**
- [ ] **2.20 엔드포인트 구현 완료**
- [ ] **2.21 API 문서화 (summary, description) 추가 완료**

#### 단계 9: 라우터 등록

**파일**: `server/app/api/v1/router.py`

```python
from fastapi import APIRouter

from server.app.api.v1.endpoints import sample, payment  # payment 추가

api_router = APIRouter()
api_router.include_router(sample.router)
api_router.include_router(payment.router)  # 라우터 등록
```

- [ ] **2.22 라우터를 API v1에 등록 완료**

#### 단계 10: 데이터베이스 마이그레이션

```bash
# Alembic 마이그레이션 생성
alembic revision --autogenerate -m "Add payment tables"

# 마이그레이션 적용
alembic upgrade head
```

- [ ] **2.23 Alembic 마이그레이션 생성 완료**
- [ ] **2.24 마이그레이션 스크립트 검토 완료**
- [ ] **2.25 마이그레이션 적용 완료**

#### 단계 11: 테스트 작성

```bash
# 테스트 파일 생성
mkdir -p tests/unit/payment tests/integration/payment
touch tests/unit/payment/test_payment_calculator.py
touch tests/integration/payment/test_payment_service.py
```

- [ ] **2.26 단위 테스트 작성 완료** (Calculator, Formatter)
- [ ] **2.27 통합 테스트 작성 완료** (Service, API)
- [ ] **2.28 모든 테스트 통과 확인**

---

### Phase 3: 프론트엔드 구현

#### 단계 1: 디렉토리 생성

```bash
mkdir -p client/src/domains/payment/{components,pages}
touch client/src/domains/payment/types.ts
touch client/src/domains/payment/api.ts
touch client/src/domains/payment/store.ts
touch client/src/domains/payment/index.ts
```

- [ ] **3.1 디렉토리 구조 생성 완료**

#### 단계 2: 타입 정의

**파일**: `client/src/domains/payment/types.ts`

```typescript
export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface PaymentRequest {
  user_id: number;
  payment_method_id: number;
  amount: number;
  currency: string;
  description?: string;
}

export interface PaymentResponse {
  transaction_id: string;
  status: string;
  amount: number;
  fee: number;
  final_amount: number;
  currency: string;
  processed_at: string;
  message: string;
}
```

- [ ] **3.2 TypeScript 인터페이스 정의 완료**

#### 단계 3: API 모듈 작성

**파일**: `client/src/domains/payment/api.ts`

```typescript
import { apiClient } from '@/core/api/client';
import { Payment, PaymentRequest, PaymentResponse } from './types';

export async function fetchPayments(): Promise<Payment[]> {
  return apiClient.get<Payment[]>('/v1/payment/list');
}

export async function processPayment(data: PaymentRequest): Promise<PaymentResponse> {
  return apiClient.post<PaymentResponse>('/v1/payment/process', data);
}
```

- [ ] **3.3 API 호출 함수 작성 완료**

#### 단계 4: 상태 관리

**파일**: `client/src/domains/payment/store.ts`

```typescript
import { create } from 'zustand';
import { Payment } from './types';

interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error: string | null;

  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  loading: false,
  error: null,

  setPayments: (payments) => set({ payments }),
  addPayment: (payment) =>
    set((state) => ({ payments: [...state.payments, payment] })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
```

- [ ] **3.4 Zustand 스토어 작성 완료**

#### 단계 5: 컴포넌트 작성

**파일**: `client/src/domains/payment/components/PaymentForm.tsx`

```typescript
import React from 'react';
import { Button, Input, Card } from '@/core/ui';
import { usePaymentStore } from '../store';
import { processPayment } from '../api';

export const PaymentForm: React.FC = () => {
  // 구현...
};
```

**파일**: `client/src/domains/payment/components/PaymentList.tsx`

- [ ] **3.5 PaymentForm 컴포넌트 작성 완료**
- [ ] **3.6 PaymentList 컴포넌트 작성 완료**
- [ ] **3.7 기타 필요한 컴포넌트 작성 완료**

#### 단계 6: 페이지 작성

**파일**: `client/src/domains/payment/pages/PaymentPage.tsx`

```typescript
import React, { useEffect } from 'react';
import { MainLayout } from '@/core/layout';
import { PaymentForm, PaymentList } from '../components';
import { usePaymentStore } from '../store';
import { fetchPayments } from '../api';

export const PaymentPage: React.FC = () => {
  const { setPayments, setLoading, setError } = usePaymentStore();

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const payments = await fetchPayments();
        setPayments(payments);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [setPayments, setLoading, setError]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">결제 관리</h1>
        <PaymentForm />
        <PaymentList />
      </div>
    </MainLayout>
  );
};
```

- [ ] **3.8 PaymentPage 작성 완료**

#### 단계 7: 라우팅 등록

**파일**: `client/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PaymentPage } from '@/domains/payment/pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/payment" element={<PaymentPage />} />
        {/* 기존 라우트 */}
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **3.9 라우팅 등록 완료**
- [ ] **3.10 네비게이션 메뉴에 링크 추가 완료**

---

### Phase 4: 통합 테스트 & 검증

- [ ] **4.1 API 엔드포인트 동작 확인** (Swagger UI에서 테스트)
- [ ] **4.2 프론트엔드 UI 동작 확인**
- [ ] **4.3 End-to-End 시나리오 테스트**
- [ ] **4.4 에러 케이스 테스트** (잘못된 입력, 권한 없음 등)
- [ ] **4.5 성능 테스트** (대량 데이터 처리)

---

### Phase 5: 문서화

- [ ] **5.1 API 문서화** (Swagger 설명 추가)
- [ ] **5.2 도메인 README 작성** (선택 사항)
- [ ] **5.3 CHANGELOG 업데이트**

---

### Phase 6: 코드 리뷰 & 배포

- [ ] **6.1 코드 포맷팅 실행** (`black`, `isort`, `prettier`)
- [ ] **6.2 린팅 통과 확인** (`ruff`, `eslint`)
- [ ] **6.3 타입 체크 통과** (`mypy`, `tsc`)
- [ ] **6.4 모든 테스트 통과 확인**
- [ ] **6.5 Pull Request 생성**
- [ ] **6.6 코드 리뷰 반영**
- [ ] **6.7 메인 브랜치 머지**
- [ ] **6.8 배포**

---

## 🔍 코드 리뷰 기준

### 반드시 확인할 항목

#### 아키텍처
- [ ] 계층화된 폴더 구조 유지
- [ ] 레이어별 책임 분리 준수 (Router/Service/Repository/Calculator/Formatter)
- [ ] 도메인 간 의존성 최소화
- [ ] 공통 로직은 `shared/` 또는 `core/`로 추출

#### 코드 품질
- [ ] 타입 힌트 명시 (Python: 함수/메서드, TypeScript: `any` 금지)
- [ ] Docstring/JSDoc 작성
- [ ] 에러 핸들링 적절 (커스텀 예외 사용)
- [ ] 테스트 작성 (최소 주요 로직)
- [ ] 변수/함수명 명확

#### 보안
- [ ] SQL Injection 방지 (ORM 사용, 파라미터 바인딩)
- [ ] XSS 방지 (사용자 입력 검증, 이스케이핑)
- [ ] 민감정보 마스킹 (카드 번호, 비밀번호 등)
- [ ] 인증/권한 체크
- [ ] 환경 변수로 민감 정보 관리 (하드코딩 금지)

#### 성능
- [ ] N+1 쿼리 문제 없음 (eager loading 사용)
- [ ] 불필요한 DB 쿼리 최소화
- [ ] 큰 데이터는 페이지네이션 적용
- [ ] API 응답 시간 2초 이내

#### 스타일
- [ ] `black`, `isort` 실행 (Python)
- [ ] `prettier`, `eslint` 실행 (TypeScript)
- [ ] Tailwind CSS 사용 (인라인 스타일 금지)
- [ ] 일관된 네이밍 규칙

---

## 🚧 충돌 방지 전략

### 여러 명이 동시에 작업할 때

#### 1. 도메인별로 작업 분리

- **개발자 A**: `payment` 도메인 작업
- **개발자 B**: `notification` 도메인 작업
- **충돌 가능성**: 거의 없음 (도메인이 독립적이므로)

#### 2. 공통 코드 수정 시 조율

- **공통 코드**: `shared/`, `core/`, `api/v1/router.py` 등
- **규칙**: 수정 전 팀원에게 알리고 충돌 방지

#### 3. 브랜치 전략

```bash
# Feature 브랜치 생성
git checkout -b feature/payment-domain

# 작업 후 커밋
git add .
git commit -m "feat: Add payment domain"

# 메인 브랜치 최신 변경사항 반영
git fetch origin
git rebase origin/main

# Push
git push origin feature/payment-domain
```

#### 4. Pull Request 규칙

- **제목**: `[도메인명] 작업 내용 요약`
  - 예: `[Payment] Add payment processing API`
- **설명**: 변경 사항, 테스트 방법, 스크린샷 등 포함
- **리뷰어**: 최소 1명 이상 승인 후 머지

---

## 🔧 문제 해결 가이드

### 백엔드 문제

#### 1. `ImportError: cannot import name ...`

**원인**: 순환 import 또는 모듈 경로 오류

**해결**:
```python
# ❌ 나쁜 예: 순환 import
# user/models.py
from payment.models import Payment  # 순환 import 발생

# ✅ 좋은 예: 타입 힌트에서만 import
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from payment.models import Payment

user: Mapped["User"] = relationship(back_populates="payments")
```

#### 2. `AttributeError: 'AsyncSession' object has no attribute 'execute'`

**원인**: SQLAlchemy 1.x 문법 사용

**해결**:
```python
# ❌ 나쁜 예: SQLAlchemy 1.x
result = db.query(User).filter(User.id == user_id).first()

# ✅ 좋은 예: SQLAlchemy 2.0
result = await db.execute(select(User).where(User.id == user_id))
user = result.scalar_one_or_none()
```

---

### 프론트엔드 문제

#### 1. `Module not found: Can't resolve '@/core/ui'`

**원인**: Path alias 설정 누락

**해결**: `vite.config.ts` 확인
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 2. `Type 'X' is not assignable to type 'Y'`

**원인**: API 응답 타입 불일치

**해결**:
```typescript
// API 응답 타입 확인
interface ApiUser {
  id: number;
  email: string;
}

// 백엔드와 일치하는 타입 사용
export async function fetchUser(id: number): Promise<ApiUser> {
  return apiClient.get<ApiUser>(`/v1/users/${id}`);
}
```

---

## 📚 추가 참고 자료

- **[README.md](./README.md)**: 프로젝트 개요
- **[server/README.md](./server/README.md)**: 백엔드 상세 가이드
- **[client/README.md](./client/README.md)**: 프론트엔드 상세 가이드
- **[.cursorrules](./.cursorrules)**: Cursor/Claude AI 코딩 규칙

---

**이 가이드를 따르면 여러 명이 동시에 작업해도 충돌 없이 깔끔한 코드를 유지할 수 있습니다! 🚀**
