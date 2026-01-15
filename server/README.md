# 🔧 백엔드 (FastAPI + SQLAlchemy 2.0) 개발 가이드

> FastAPI + SQLAlchemy 2.0 + Pydantic v2 기반의 고성능 비동기 REST API 서버

---

## 📖 목차

- [아키텍처 개요](#-아키텍처-개요)
- [Layered Architecture 상세](#-layered-architecture-상세)
- [의존성 주입(Dependency Injection)](#-의존성-주입dependency-injection)
- [데이터베이스 & 마이그레이션](#-데이터베이스--마이그레이션)
- [API 문서화 가이드](#-api-문서화-가이드)
- [도메인 추가 실전 가이드](#-도메인-추가-실전-가이드)
- [예외 처리 전략](#-예외-처리-전략)
- [테스트 작성 가이드](#-테스트-작성-가이드)
- [코드 품질 관리](#-코드-품질-관리)

---

## 🏗️ 아키텍처 개요

### 핵심 설계 원칙

1. **계층화된 아키텍처(Layered Architecture)**: 명확한 책임 분리
2. **도메인 주도 설계(DDD)**: 비즈니스 로직을 도메인별로 캡슐화
3. **의존성 주입(DI)**: 테스트 가능하고 결합도 낮은 설계
4. **타입 안전성**: Pydantic v2 + mypy로 런타임/컴파일타임 검증
5. **비동기 최적화**: async/await 기반 고성능 I/O
6. **운영 준비 완료**: Request ID 로깅, Health Check, Version 엔드포인트 내장

### 디렉토리 구조

```
server/
├── main.py                          # FastAPI 애플리케이션 진입점
└── app/
    ├── core/                        # 🔧 핵심 인프라
    │   ├── config.py                # 환경 설정 (BaseSettings)
    │   ├── database.py              # DB 엔진, 세션, 유틸리티
    │   ├── dependencies.py          # FastAPI 의존성 (DB, Auth, Pagination)
    │   ├── logging.py               # 로깅 설정 (Request ID 포함)
    │   ├── middleware.py            # 미들웨어 (Request ID, External Logging)
    │   └── routers.py               # Core 엔드포인트 (Health, Version)
    │
    ├── shared/                      # 🔗 공유 컴포넌트
    │   ├── base/                    # 추상 베이스 클래스
    │   │   ├── service.py           # BaseService (Facade + Template Method)
    │   │   ├── repository.py          # BaseRepository (Data Access)
    │   │   ├── calculator.py        # BaseCalculator (Pure Logic)
    │   │   └── formatter.py         # BaseFormatter (Presentation)
    │   ├── exceptions/              # 커스텀 예외 계층구조
    │   │   └── __init__.py          # ApplicationException 등
    │   └── types/                   # 공통 타입
    │       └── __init__.py          # ServiceResult, DTO 인터페이스
    │
    ├── domain/                      # 🎯 비즈니스 도메인 (실제 기능)
    │   └── {domain_name}/           # 도메인별 폴더
    │       ├── service.py           # 도메인 서비스 (오케스트레이터)
    │       ├── models/              # SQLAlchemy 모델
    │       ├── schemas/             # Pydantic 스키마 (Request/Response)
    │       ├── repositories/           # 데이터 조회 레이어
    │       ├── calculators/         # 비즈니스 로직 레이어
    │       └── formatters/          # 응답 포맷팅 레이어
    │
    ├── examples/                    # 📚 참고용 예제
    │   └── sample_domain/           # 도메인 템플릿 (복사해서 사용)
    │
    └── api/                         # 🌐 API 레이어
        └── v1/
            ├── router.py            # API 라우터 통합
            └── endpoints/           # 도메인별 엔드포인트
                └── {domain}.py      # FastAPI 라우터
```

---

## 🏥 Core 인프라 (Health, Version, Logging)

### 1. Health Check 엔드포인트

**엔드포인트**: `GET /core/health`

```python
# server/app/core/routers.py
@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    서비스 상태 확인

    Returns:
        {"status": "ok", "env": "production"}

    사용 사례:
        - Kubernetes Liveness/Readiness Probe
        - 로드밸런서 헬스체크
        - 모니터링 툴 (Datadog, New Relic)
    """
    service = HealthCheckService()
    return await service.get_health_status()
```

### 2. Version 엔드포인트

**엔드포인트**: `GET /core/version`

```python
# 배포 후 버전 확인용
@router.get("/version")
async def version_info() -> Dict[str, Any]:
    """
    애플리케이션 버전 정보

    Returns:
        {
            "version": "1.0.0",
            "env": "production",
            "app_name": "AI Worker Project"
        }

    활용:
        - 배포 확인
        - 프론트엔드에서 API 버전 체크
        - 디버깅 시 환경 확인
    """
    service = VersionService()
    return await service.get_version_info()
```

### 3. Request ID 로깅

**미들웨어**: `server/app/core/middleware.py`

```python
class RequestIDMiddleware:
    """
    모든 요청에 대해 고유한 Request ID 생성/추적

    기능:
        - X-Request-ID 헤더 수신 또는 UUID 생성
        - request.state.request_id에 저장
        - 응답 헤더에 X-Request-ID 포함
        - 모든 로그에 Request ID 자동 포함

    로그 예시:
        [req_id=550e8400-e29b-41d4-a716-446655440000] POST /api/v1/sample/analyze - 200 (0.123s)
    """
```

**로거 사용법**:

```python
from server.app.core.logging import get_logger

logger = get_logger(__name__)

# Service나 Router에서 사용
logger.info(
    "User action completed",
    extra={
        "request_id": request.state.request_id,
        "user_id": user.id,
        "action": "create"
    }
)

# 출력 예시:
# [req_id=550e8400-e29b-41d4-a716-446655440000] 2024-01-01 12:00:00 - server.app.domain.user - INFO - User action completed
```

**외부 로깅 서비스 연동 (Stub)**:

```python
# server/app/core/logging.py
class ExternalLoggingService:
    """
    Sentry, DataDog, CloudWatch 등 외부 로깅 서비스 연동을 위한 Stub

    TODO: 실제 구현 시
        - Sentry: sentry_sdk.capture_exception()
        - DataDog: datadog.api.Event.create()
        - CloudWatch: boto3.client('logs').put_log_events()
    """
    async def send_error(self, error: Exception, context: dict):
        pass  # 실제 구현 필요
```

---

## 🔀 Layered Architecture 상세

### 1. Router Layer (API Endpoints)

**위치**: `app/api/v1/endpoints/{domain}.py`

**책임**:
- HTTP 요청 수신 및 응답 반환
- Pydantic으로 입력 검증
- Service 레이어 호출
- HTTP 상태 코드 처리
- API 문서화 (docstring, summary, description)

**예시**:

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
    """
    결제 처리 엔드포인트

    Args:
        request: 결제 요청 데이터 (카드 정보, 금액 등)
        db: 데이터베이스 세션 (의존성 주입)

    Returns:
        PaymentResponse: 결제 결과 (성공/실패, 트랜잭션 ID 등)

    Raises:
        ValidationException: 입력 데이터 검증 실패
        BusinessLogicException: 결제 한도 초과 등 비즈니스 규칙 위반
        ExternalServiceException: PG사 통신 실패
    """
    service = PaymentService(db=db)
    result = await service.execute(request)

    if not result.success:
        # 에러 처리 (예외는 FastAPI exception handler가 처리)
        raise result.error

    return result.data
```

**핵심 규칙**:
- ❌ **Router에서 비즈니스 로직 금지**: DB 쿼리, 계산 로직 직접 작성 금지
- ✅ **Service에 위임**: 모든 로직은 Service 레이어로 위임
- ✅ **Pydantic 스키마 사용**: Request/Response 타입 명시
- ✅ **의존성 주입 활용**: `Depends(get_db)`, `Depends(get_current_user)` 등

---

### 2. Service Layer (Business Logic Orchestration)

**위치**: `app/domain/{domain}/service.py`

**책임**:
- Repository/Calculator/Formatter 조율 (오케스트레이션)
- 트랜잭션 관리 (`async with db.begin()`)
- 권한 검증 (`check_permissions()` 훅)
- 에러 핸들링 (try/except → ServiceResult)
- 로깅 및 모니터링 훅

**패턴**:
- **Facade Pattern**: 복잡한 하위 시스템을 단순한 인터페이스로 제공
- **Template Method Pattern**: `execute()` 메서드가 실행 흐름 정의, 서브클래스가 구체적 단계 구현

**예시**:

```python
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.shared.base import BaseService
from server.app.shared.types import ServiceResult
from server.app.domain.payment.schemas import PaymentRequest, PaymentResponse
from server.app.domain.payment.repositories import PaymentDataRepository
from server.app.domain.payment.calculators import PaymentCalculator
from server.app.domain.payment.formatters import PaymentResponseFormatter
from server.app.shared.exceptions import BusinessLogicException

class PaymentService(BaseService[PaymentRequest, PaymentResponse]):
    """결제 서비스 (Repository → Calculator → Formatter 조율)"""

    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db
        self.repository = PaymentDataRepository(db)
        self.calculator = PaymentCalculator()
        self.formatter = PaymentResponseFormatter()

    async def execute(self, request: PaymentRequest) -> ServiceResult[PaymentResponse]:
        """
        결제 처리 메인 로직

        흐름:
        1. validate_request: 요청 검증
        2. check_permissions: 권한 확인 (옵션)
        3. Repository: 사용자 정보, 결제 수단 조회
        4. Calculator: 수수료 계산, 한도 검증
        5. Formatter: 응답 데이터 포맷팅
        """
        try:
            # 1. 요청 검증
            await self.validate_request(request)

            # 2. 데이터 조회 (Repository)
            user_data = await self.repository.provide({
                "user_id": request.user_id,
                "payment_method_id": request.payment_method_id
            })

            # 3. 비즈니스 로직 실행 (Calculator)
            payment_result = await self.calculator.calculate({
                "amount": request.amount,
                "user_data": user_data,
                "currency": request.currency
            })

            # 4. 한도 검증
            if payment_result["exceeds_limit"]:
                raise BusinessLogicException(
                    message="결제 한도 초과",
                    details={"limit": payment_result["daily_limit"]}
                )

            # 5. 응답 포맷팅 (Formatter)
            formatted_response = await self.formatter.format({
                "payment_result": payment_result,
                "request": request
            })

            return ServiceResult.success(formatted_response)

        except Exception as e:
            return await self.handle_error(e)

    async def validate_request(self, request: PaymentRequest) -> None:
        """요청 검증 (금액 범위, 통화 유효성 등)"""
        if request.amount <= 0:
            raise ValidationException("결제 금액은 0보다 커야 합니다")

        if request.currency not in ["KRW", "USD"]:
            raise ValidationException(f"지원하지 않는 통화: {request.currency}")
```

**핵심 규칙**:
- ✅ **반드시 클래스 기반**: 절차지향 함수 금지
- ✅ **BaseService 상속**: Template Method 패턴 활용
- ✅ **Repository/Calculator/Formatter 조합**: 직접 DB 접근 금지
- ✅ **ServiceResult 반환**: 성공/실패를 명시적으로 표현
- ❌ **복잡한 계산 로직 금지**: Calculator로 위임

---

### 3. Repository Layer (Data Access)

**위치**: `app/domain/{domain}/repositories/{repository_name}.py`

**책임**:
- 데이터베이스 쿼리 (SQLAlchemy ORM)
- 외부 API 호출 (httpx)
- 파일 시스템 접근
- 캐시 조회 (Redis)
- **Side Effect 허용** (I/O 작업)

**예시**:

```python
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from server.app.shared.base import BaseRepository
from server.app.domain.payment.models import PaymentMethod, User
from server.app.shared.exceptions import NotFoundException

class PaymentDataRepository(BaseRepository[Dict[str, Any], Dict[str, Any]]):
    """결제 데이터 조회 Repository"""

    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db

    async def provide(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        사용자 및 결제 수단 정보 조회

        Args:
            input_data: {"user_id": int, "payment_method_id": int}

        Returns:
            {"user": User, "payment_method": PaymentMethod}

        Raises:
            NotFoundException: 사용자 또는 결제 수단을 찾을 수 없음
        """
        user_id = input_data["user_id"]
        payment_method_id = input_data["payment_method_id"]

        # 사용자 조회
        user_result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = user_result.scalar_one_or_none()

        if not user:
            raise NotFoundException(f"사용자를 찾을 수 없습니다: {user_id}")

        # 결제 수단 조회
        payment_method_result = await self.db.execute(
            select(PaymentMethod).where(
                PaymentMethod.id == payment_method_id,
                PaymentMethod.user_id == user_id  # 본인 소유 확인
            )
        )
        payment_method = payment_method_result.scalar_one_or_none()

        if not payment_method:
            raise NotFoundException(f"결제 수단을 찾을 수 없습니다: {payment_method_id}")

        return {
            "user": user,
            "payment_method": payment_method
        }
```

**핵심 규칙**:
- ✅ **데이터 조회만 담당**: 계산 로직 금지
- ✅ **BaseRepository 상속**: 타입 힌트 명시
- ✅ **명시적 예외 처리**: NotFoundException, ExternalServiceException 사용
- ❌ **비즈니스 로직 금지**: "수수료 계산", "한도 검증" 등은 Calculator로

---

### 4. Calculator Layer (Business Logic)

**위치**: `app/domain/{domain}/calculators/{calculator_name}.py`

**책임**:
- **순수 계산 로직** (Pure Functions)
- 통계 분석, 데이터 변환
- 알고리즘 적용 (이상 탐지, 추천 등)
- **Side Effect 금지** (DB 접근, API 호출 금지)

**예시**:

```python
from typing import Dict, Any
from decimal import Decimal

from server.app.shared.base import BaseCalculator
from server.app.shared.exceptions import CalculatorException

class PaymentCalculator(BaseCalculator[Dict[str, Any], Dict[str, Any]]):
    """결제 수수료 및 한도 계산 Calculator"""

    async def calculate(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        결제 수수료 계산 및 한도 검증

        Args:
            input_data: {
                "amount": Decimal,
                "user_data": {"user": User, "payment_method": PaymentMethod},
                "currency": str
            }

        Returns:
            {
                "final_amount": Decimal,  # 수수료 포함 최종 금액
                "fee": Decimal,           # 수수료
                "exceeds_limit": bool,    # 한도 초과 여부
                "daily_limit": Decimal    # 일일 한도
            }
        """
        try:
            amount = Decimal(str(input_data["amount"]))
            user = input_data["user_data"]["user"]
            payment_method = input_data["user_data"]["payment_method"]
            currency = input_data["currency"]

            # 1. 수수료 계산 (결제 수단별 수수료율)
            fee_rate = self._get_fee_rate(payment_method.type)
            fee = amount * fee_rate
            final_amount = amount + fee

            # 2. 일일 한도 조회 (사용자 등급별)
            daily_limit = self._get_daily_limit(user.membership_tier)

            # 3. 한도 초과 여부 계산
            # NOTE: 실제 사용 금액은 Repository에서 조회하지 않고,
            #       여기서는 단순히 요청 금액과 한도만 비교
            exceeds_limit = final_amount > daily_limit

            return {
                "final_amount": final_amount,
                "fee": fee,
                "exceeds_limit": exceeds_limit,
                "daily_limit": daily_limit,
                "currency": currency
            }

        except Exception as e:
            raise CalculatorException(f"결제 계산 중 오류 발생: {str(e)}")

    def _get_fee_rate(self, payment_type: str) -> Decimal:
        """결제 수단별 수수료율 반환 (순수 함수)"""
        fee_rates = {
            "credit_card": Decimal("0.03"),    # 3%
            "debit_card": Decimal("0.015"),    # 1.5%
            "bank_transfer": Decimal("0.005")  # 0.5%
        }
        return fee_rates.get(payment_type, Decimal("0.02"))  # 기본 2%

    def _get_daily_limit(self, membership_tier: str) -> Decimal:
        """회원 등급별 일일 한도 반환 (순수 함수)"""
        limits = {
            "bronze": Decimal("1000000"),    # 100만원
            "silver": Decimal("5000000"),    # 500만원
            "gold": Decimal("10000000"),     # 1000만원
            "platinum": Decimal("50000000")  # 5000만원
        }
        return limits.get(membership_tier, Decimal("500000"))  # 기본 50만원
```

**핵심 규칙**:
- ✅ **순수 함수(Pure Function)**: 동일 입력 → 동일 출력
- ✅ **Side Effect 금지**: DB, API, 파일 접근 절대 금지
- ✅ **테스트 가능**: Mock 없이 단위 테스트 작성 가능
- ✅ **타입 힌트 명시**: Decimal, int, str 등 명확히 지정
- ❌ **AsyncSession, httpx 등 I/O 객체 주입 금지**

---

### 5. Formatter Layer (Presentation)

**위치**: `app/domain/{domain}/formatters/{formatter_name}.py`

**책임**:
- 내부 데이터 → API 응답 형식 변환
- 필드 매핑 (snake_case → camelCase)
- 민감정보 마스킹 (카드 번호, 이메일)
- 날짜/시간 포맷팅 (ISO 8601)
- 다국어 메시지 포맷팅

**예시**:

```python
from typing import Dict, Any
from datetime import datetime

from server.app.shared.base import BaseFormatter
from server.app.domain.payment.schemas import PaymentResponse

class PaymentResponseFormatter(BaseFormatter[Dict[str, Any], PaymentResponse]):
    """결제 응답 포맷터"""

    async def format(self, input_data: Dict[str, Any]) -> PaymentResponse:
        """
        내부 데이터를 API 응답 형식으로 변환

        Args:
            input_data: {
                "payment_result": Dict (Calculator 출력),
                "request": PaymentRequest (원본 요청)
            }

        Returns:
            PaymentResponse: Pydantic 모델
        """
        payment_result = input_data["payment_result"]
        request = input_data["request"]

        # 트랜잭션 ID 생성 (실제로는 DB에 저장 후 ID 받아야 함)
        transaction_id = f"TXN-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

        return PaymentResponse(
            transaction_id=transaction_id,
            status="approved",
            amount=float(request.amount),
            fee=float(payment_result["fee"]),
            final_amount=float(payment_result["final_amount"]),
            currency=payment_result["currency"],
            payment_method=self._mask_payment_method(request.payment_method_id),
            processed_at=datetime.utcnow().isoformat(),
            message="결제가 성공적으로 처리되었습니다"
        )

    def _mask_payment_method(self, payment_method_id: int) -> str:
        """결제 수단 ID를 마스킹 (보안)"""
        return f"****-{payment_method_id % 10000:04d}"
```

**핵심 규칙**:
- ✅ **Pydantic 모델 반환**: 타입 안전성 보장
- ✅ **민감정보 마스킹**: 카드 번호, 이메일, 전화번호 등
- ✅ **일관된 날짜 포맷**: ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
- ❌ **비즈니스 로직 금지**: 계산, 검증은 Calculator로

---

## 💉 의존성 주입(Dependency Injection)

FastAPI의 `Depends()`를 활용한 의존성 주입으로 테스트 가능하고 결합도 낮은 설계를 구현합니다.

### 1. 데이터베이스 세션 주입

**위치**: `app/core/dependencies.py`

```python
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.database import AsyncSessionLocal

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    데이터베이스 세션 의존성

    - 요청마다 새로운 세션 생성
    - 요청 종료 시 자동 커밋/롤백
    - finally 블록에서 세션 close

    Usage:
        @router.get("/users")
        async def get_users(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()  # 성공 시 커밋
        except Exception:
            await session.rollback()  # 실패 시 롤백
            raise
        finally:
            await session.close()
```

### 2. 인증 의존성 (예정)

```python
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    JWT 토큰에서 현재 사용자 추출

    Args:
        credentials: Bearer 토큰
        db: 데이터베이스 세션

    Returns:
        User: 인증된 사용자 객체

    Raises:
        HTTPException(401): 토큰 없음 또는 만료
        HTTPException(403): 권한 없음
    """
    token = credentials.credentials

    # TODO: JWT 검증 로직 구현
    # payload = verify_jwt_token(token)
    # user = await get_user_by_id(db, payload["user_id"])

    # if not user:
    #     raise HTTPException(status_code=401, detail="Invalid token")

    # return user

    raise NotImplementedError("JWT 인증 미구현")
```

### 3. 페이지네이션 의존성

```python
from typing import Optional
from fastapi import Query

class PaginationParams:
    """페이지네이션 파라미터"""

    def __init__(
        self,
        page: int = Query(1, ge=1, description="페이지 번호 (1부터 시작)"),
        size: int = Query(20, ge=1, le=100, description="페이지 크기 (최대 100)")
    ):
        self.page = page
        self.size = size
        self.skip = (page - 1) * size
        self.limit = size

# Usage:
@router.get("/users")
async def get_users(
    pagination: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_db)
):
    users = await db.execute(
        select(User).offset(pagination.skip).limit(pagination.limit)
    )
    return users.scalars().all()
```

---

## 🗄️ 데이터베이스 & 마이그레이션

### 1. SQLAlchemy 2.0 비동기 패턴

**위치**: `app/core/database.py`

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from server.app.core.config import settings

# 비동기 엔진 생성
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # SQL 로깅
    pool_size=5,          # 커넥션 풀 크기
    max_overflow=10       # 최대 추가 커넥션
)

# 비동기 세션 팩토리
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False  # 커밋 후에도 객체 사용 가능
)

# ORM Base 클래스
class Base(DeclarativeBase):
    """모든 SQLAlchemy 모델의 베이스 클래스"""
    pass
```

### 2. 모델 정의 (SQLAlchemy 2.0)

**위치**: `app/domain/{domain}/models/__init__.py`

```python
from datetime import datetime
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    # Primary Key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Columns
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True)
    membership_tier: Mapped[str] = mapped_column(String(20), default="bronze")

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    payment_methods: Mapped[list["PaymentMethod"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    type: Mapped[str] = mapped_column(String(50))  # credit_card, debit_card, etc.
    last_four_digits: Mapped[str] = mapped_column(String(4))

    # Relationships
    user: Mapped["User"] = relationship(back_populates="payment_methods")
```

### 3. Alembic 마이그레이션

#### 초기 설정

```bash
# 1. Alembic 초기화
alembic init alembic

# 2. alembic.ini 수정 (DATABASE_URL 설정)
# sqlalchemy.url = postgresql+asyncpg://user:password@localhost/dbname

# 3. alembic/env.py 수정 (Base 메타데이터 import)
```

**alembic/env.py**:

```python
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context
from server.app.core.config import settings
from server.app.core.database import Base

# 모든 모델 import (자동 탐지를 위해)
from server.app.domain.payment.models import User, PaymentMethod  # 예시

# Alembic Config
config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# 메타데이터 지정
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """오프라인 마이그레이션 (--sql 모드)"""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """온라인 마이그레이션 (실제 DB 적용)"""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    import asyncio
    asyncio.run(run_migrations_online())
```

#### 마이그레이션 명령어

```bash
# 마이그레이션 파일 생성 (자동 감지)
alembic revision --autogenerate -m "Add payment tables"

# 마이그레이션 적용
alembic upgrade head

# 롤백 (1단계)
alembic downgrade -1

# 특정 버전으로 이동
alembic upgrade <revision_id>
alembic downgrade <revision_id>

# 현재 버전 확인
alembic current

# 마이그레이션 히스토리
alembic history

# SQL 확인 (실제 적용 안 함)
alembic upgrade head --sql
```

---

## 📝 API 문서화 가이드

FastAPI는 자동으로 OpenAPI(Swagger) 문서를 생성하지만, 품질 높은 문서화를 위해 다음 원칙을 따릅니다.

### 1. Pydantic 스키마 문서화

**위치**: `app/domain/{domain}/schemas/__init__.py`

```python
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from decimal import Decimal

class PaymentRequest(BaseModel):
    """결제 요청 스키마"""

    user_id: int = Field(
        ...,
        description="사용자 ID",
        gt=0,
        example=12345
    )
    payment_method_id: int = Field(
        ...,
        description="결제 수단 ID",
        gt=0,
        example=67890
    )
    amount: Decimal = Field(
        ...,
        description="결제 금액 (원)",
        gt=0,
        decimal_places=2,
        example=50000.00
    )
    currency: str = Field(
        default="KRW",
        description="통화 코드 (ISO 4217)",
        pattern="^[A-Z]{3}$",
        example="KRW"
    )
    description: Optional[str] = Field(
        None,
        description="결제 설명",
        max_length=200,
        example="월간 구독료"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_id": 12345,
                "payment_method_id": 67890,
                "amount": 50000.00,
                "currency": "KRW",
                "description": "월간 구독료"
            }
        }
    )

class PaymentResponse(BaseModel):
    """결제 응답 스키마"""

    transaction_id: str = Field(..., description="트랜잭션 ID", example="TXN-20260112120000")
    status: str = Field(..., description="결제 상태", example="approved")
    amount: float = Field(..., description="결제 금액", example=50000.00)
    fee: float = Field(..., description="수수료", example=1500.00)
    final_amount: float = Field(..., description="최종 금액 (수수료 포함)", example=51500.00)
    currency: str = Field(..., description="통화", example="KRW")
    processed_at: str = Field(..., description="처리 시각 (ISO 8601)", example="2026-01-12T12:00:00Z")
    message: str = Field(..., description="결과 메시지", example="결제가 성공적으로 처리되었습니다")
```

### 2. 엔드포인트 문서화

```python
@router.post(
    "/process",
    response_model=PaymentResponse,
    status_code=status.HTTP_200_OK,
    summary="결제 처리",
    description="""
    ## 결제 처리 API

    사용자의 결제 요청을 처리하고 결과를 반환합니다.

    ### 주요 기능
    - 결제 수단 검증
    - 수수료 자동 계산
    - 일일 한도 검증
    - 트랜잭션 생성

    ### 에러 코드
    - `400 Bad Request`: 잘못된 입력 데이터
    - `404 Not Found`: 사용자 또는 결제 수단을 찾을 수 없음
    - `422 Unprocessable Entity`: 결제 한도 초과 등 비즈니스 규칙 위반
    - `502 Bad Gateway`: PG사 통신 실패

    ### 처리 흐름
    1. 입력 검증 (Pydantic)
    2. 사용자 및 결제 수단 조회
    3. 수수료 계산 및 한도 검증
    4. 결제 처리 (PG사 연동)
    5. 트랜잭션 저장 및 응답 반환
    """,
    responses={
        200: {"description": "결제 성공"},
        400: {"description": "잘못된 요청"},
        404: {"description": "리소스를 찾을 수 없음"},
        422: {"description": "비즈니스 규칙 위반"},
        502: {"description": "외부 서비스 오류"}
    },
    tags=["payment"]
)
async def process_payment(...):
    ...
```

### 3. API 문서 접근

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## 🎯 도메인 추가 실전 가이드

새로운 도메인을 추가하는 단계별 가이드입니다. 예시: `user_management` 도메인 추가

### 1단계: 디렉토리 생성

```bash
mkdir -p server/app/domain/user_management/{models,schemas,repositories,calculators,formatters}
touch server/app/domain/user_management/__init__.py
touch server/app/domain/user_management/service.py
```

### 2단계: 모델 정의

**파일**: `server/app/domain/user_management/models/__init__.py`

```python
from datetime import datetime
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from server.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
```

### 3단계: 스키마 정의

**파일**: `server/app/domain/user_management/schemas/__init__.py`

```python
from pydantic import BaseModel, Field, EmailStr

class UserCreateRequest(BaseModel):
    email: EmailStr = Field(..., description="사용자 이메일")
    username: str = Field(..., min_length=3, max_length=100)

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: str
```

### 4단계: Repository 구현

**파일**: `server/app/domain/user_management/repositories/__init__.py`

```python
from sqlalchemy.ext.asyncio import AsyncSession
from server.app.shared.base import BaseRepository
# ... (Repository 코드)
```

### 5단계: Calculator 구현 (필요 시)

**파일**: `server/app/domain/user_management/calculators/__init__.py`

### 6단계: Formatter 구현

**파일**: `server/app/domain/user_management/formatters/__init__.py`

### 7단계: Service 구현

**파일**: `server/app/domain/user_management/service.py`

```python
from server.app.shared.base import BaseService
# ... (Service 코드)
```

### 8단계: 엔드포인트 생성

**파일**: `server/app/api/v1/endpoints/user_management.py`

```python
from fastapi import APIRouter, Depends
from server.app.domain.user_management.service import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse)
async def create_user(request: UserCreateRequest, db: AsyncSession = Depends(get_db)):
    service = UserService(db=db)
    result = await service.create_user(request)
    return result.data
```

### 9단계: 라우터 등록

**파일**: `server/app/api/v1/router.py`

```python
from server.app.api.v1.endpoints import user_management

api_router.include_router(user_management.router)
```

---

## ⚠️ 예외 처리 전략

### 커스텀 예외 계층구조

**위치**: `app/shared/exceptions/__init__.py`

```python
class ApplicationException(Exception):
    """모든 애플리케이션 예외의 베이스 클래스"""
    def __init__(self, message: str, status_code: int = 500, details: dict = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ValidationException(ApplicationException):
    """입력 검증 실패 (400)"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, status_code=400, details=details)

class NotFoundException(ApplicationException):
    """리소스를 찾을 수 없음 (404)"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, status_code=404, details=details)

class BusinessLogicException(ApplicationException):
    """비즈니스 규칙 위반 (422)"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, status_code=422, details=details)

class ExternalServiceException(ApplicationException):
    """외부 서비스 오류 (502)"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, status_code=502, details=details)
```

### FastAPI 예외 핸들러

**위치**: `server/main.py`

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from server.app.shared.exceptions import ApplicationException

app = FastAPI()

@app.exception_handler(ApplicationException)
async def application_exception_handler(request: Request, exc: ApplicationException):
    """커스텀 예외 통합 핸들러"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.message,
                "details": exc.details,
                "path": str(request.url)
            }
        }
    )
```

---

## 🧪 테스트 작성 가이드

### 1. Unit 테스트 (Calculator)

```python
import pytest
from server.app.domain.payment.calculators import PaymentCalculator

@pytest.mark.asyncio
async def test_payment_calculator_fee():
    """수수료 계산 테스트"""
    calculator = PaymentCalculator()

    result = await calculator.calculate({
        "amount": 100000,
        "user_data": {
            "user": Mock(membership_tier="silver"),
            "payment_method": Mock(type="credit_card")
        },
        "currency": "KRW"
    })

    assert result["fee"] == 3000  # 3%
    assert result["final_amount"] == 103000
```

### 2. Integration 테스트 (Service)

```python
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from server.app.domain.payment.service import PaymentService

@pytest.mark.asyncio
async def test_payment_service_success(async_db: AsyncSession):
    """결제 서비스 통합 테스트"""
    service = PaymentService(db=async_db)

    request = PaymentRequest(
        user_id=1,
        payment_method_id=1,
        amount=50000,
        currency="KRW"
    )

    result = await service.execute(request)

    assert result.success
    assert result.data.status == "approved"
```

---

## 🔍 코드 품질 관리

### 명령어

```bash
# 코드 포맷팅
black server/
isort server/

# 린팅
ruff check server/

# 타입 체크
mypy server/

# 테스트
pytest --cov=server
```

### pre-commit 훅 (권장)

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.1.1
    hooks:
      - id: black
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.1.13
    hooks:
      - id: ruff
```

---

## 📚 추가 리소스

- **[ARCHITECTURE.md](../ARCHITECTURE.md)**: 상세 아키텍처 문서
- **[DEVELOPMENT_GUIDE.md](../DEVELOPMENT_GUIDE.md)**: 도메인 추가 체크리스트
- **FastAPI 공식 문서**: https://fastapi.tiangolo.com/
- **SQLAlchemy 2.0 문서**: https://docs.sqlalchemy.org/en/20/
- **Pydantic v2 문서**: https://docs.pydantic.dev/latest/

---

**Happy Coding! 🚀**
