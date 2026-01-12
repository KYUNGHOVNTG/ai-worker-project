# 아키텍처 문서

## 개요

이 문서는 AI 데이터 분석 웹 서비스 템플릿의 아키텍처를 상세히 설명합니다.

## 설계 원칙

### 1. 계층화된 아키텍처 (Layered Architecture)

각 계층은 명확한 책임을 가지며, 상위 계층은 하위 계층에만 의존합니다.

```
Presentation Layer (API)
    ↓
Business Logic Layer (Service)
    ↓
Data Access Layer (Provider)
    ↓
Database
```

### 2. 클래스 기반 비즈니스 로직

- **모든 비즈니스 로직은 클래스로 구현**
- 절차지향 함수 사용 금지
- 재사용성과 테스트 용이성 향상

### 3. 도메인 플러그인 구조

- 각 도메인은 독립적인 모듈
- 새로운 도메인을 쉽게 추가/제거 가능
- 도메인 간 의존성 최소화

### 4. 의존성 주입 (Dependency Injection)

- FastAPI의 Depends를 활용
- 테스트 시 모의 객체 주입 용이
- 결합도 감소

## 핵심 패턴

### 1. Facade Pattern (Service)

Service 클래스는 Facade 역할을 수행하여 Provider, Calculator, Formatter의 복잡성을 숨깁니다.

```python
class SampleDomainService(BaseService):
    def __init__(self, db):
        self.provider = SampleDataProvider(db)
        self.calculator = SampleAnalysisCalculator()
        self.formatter = SampleResponseFormatter()

    async def execute(self, request):
        # 1. 데이터 조회
        data = await self.provider.provide(...)

        # 2. 계산/분석
        result = await self.calculator.calculate(...)

        # 3. 응답 포맷팅
        response = await self.formatter.format(...)

        return response
```

### 2. Strategy Pattern (Provider)

Provider는 Strategy Context 역할을 하여 다양한 데이터 소스 전략을 캡슐화합니다.

```python
# 데이터베이스 Provider
class DatabaseProvider(BaseProvider):
    async def provide(self, input_data):
        return await self.db.execute(...)

# API Provider
class APIProvider(BaseProvider):
    async def provide(self, input_data):
        return await self.http_client.get(...)

# 파일 Provider
class FileProvider(BaseProvider):
    async def provide(self, input_data):
        return await self.read_file(...)
```

### 3. Template Method Pattern (BaseService)

BaseService는 Template Method를 통해 비즈니스 로직의 흐름을 정의합니다.

```python
class BaseService:
    async def execute(self, request):
        # 템플릿 메서드
        await self.before_execute(request)
        await self.validate_request(request)
        await self.check_permissions(request)

        # 서브클래스가 구현
        result = await self._execute_business_logic(request)

        await self.after_execute(request, result)
        return result
```

## 계층별 상세 설명

### Router (API Layer)

**책임**:
- HTTP 요청 수신 및 파싱
- 입력 데이터 검증 (Pydantic)
- Service 호출
- HTTP 응답 생성

**규칙**:
- 비즈니스 로직 포함 금지
- Service에 위임만
- FastAPI 의존성 활용

**예시**:
```python
@router.post("/analyze")
async def analyze_data(
    request: SampleAnalysisRequest,
    db: AsyncSession = Depends(get_database_session),
):
    service = SampleDomainService(db)
    result = await service.execute(request)

    if result.success:
        return result.data
    else:
        raise HTTPException(status_code=400, detail=result.error)
```

### Service (Business Logic Layer)

**책임**:
- Provider, Calculator, Formatter 조율
- 비즈니스 로직 흐름 제어
- 트랜잭션 관리
- 권한 검증
- 에러 핸들링

**규칙**:
- 반드시 BaseService 상속
- execute() 메서드 구현 필수
- 계산 로직은 Calculator에 위임
- 데이터 조회는 Provider에 위임

**예시**:
```python
class SampleDomainService(BaseService[Request, Response]):
    async def execute(self, request):
        # 1. 검증
        await self.validate_request(request)

        # 2. 데이터 조회
        data = await self.provider.provide(...)

        # 3. 계산
        result = await self.calculator.calculate(...)

        # 4. 포맷팅
        response = await self.formatter.format(...)

        return ServiceResult.ok(response)
```

### Provider (Data Access Layer)

**책임**:
- 데이터베이스 쿼리
- 외부 API 호출
- 파일 시스템 접근
- 캐시 조회

**규칙**:
- 반드시 BaseProvider 상속
- provide() 메서드 구현 필수
- 순수 데이터 조회만 (계산 로직 금지)
- 비즈니스 로직 없음

**예시**:
```python
class SampleDataProvider(BaseProvider[Input, Output]):
    async def provide(self, input_data):
        stmt = select(SampleDataModel).where(...)
        result = await self.db.execute(stmt)
        data = result.scalar_one_or_none()

        return Output(
            id=data.id,
            value=data.value,
        )
```

### Calculator (Computation Layer)

**책임**:
- 순수 계산 로직
- 데이터 분석
- 통계 처리
- 알고리즘 적용

**규칙**:
- 반드시 BaseCalculator 상속
- calculate() 메서드 구현 필수
- 순수 함수 (동일 입력 → 동일 출력)
- 외부 의존성 없음 (DB, API 접근 금지)
- 부수 효과 없음

**예시**:
```python
class SampleAnalysisCalculator(BaseCalculator[Input, Output]):
    async def calculate(self, input_data):
        # 순수한 계산 로직만
        mean = sum(input_data.values) / len(input_data.values)
        std_dev = statistics.stdev(input_data.values)

        return Output(
            metrics={"mean": mean, "std_dev": std_dev},
            insights=self._generate_insights(mean, std_dev),
        )

    def _generate_insights(self, mean, std_dev):
        # 헬퍼 메서드도 순수 함수
        insights = []
        if std_dev < mean * 0.1:
            insights.append("데이터가 균일합니다")
        return insights
```

### Formatter (Presentation Layer)

**책임**:
- 내부 데이터를 API 응답 형식으로 변환
- 데이터 직렬화
- 필드명 매핑
- 민감정보 마스킹
- 날짜/시간 포맷팅

**규칙**:
- 반드시 BaseFormatter 상속
- format() 메서드 구현 필수
- 순수 변환만 (계산 금지)
- 비즈니스 로직 없음

**예시**:
```python
class SampleResponseFormatter(BaseFormatter[Input, Output]):
    async def format(self, input_data):
        return SampleAnalysisResponse(
            data_id=input_data.data_id,
            result_summary=self._generate_summary(...),
            metrics=input_data.metrics,
            insights=input_data.insights,
            analyzed_at=datetime.now(timezone.utc),
        )

    def _generate_summary(self, ...):
        # 단순 문자열 생성
        return f"분석 완료: {num_metrics}개 지표"
```

## 데이터 흐름

### 요청 처리 흐름

```
1. Client → Router
   POST /api/v1/sample/analyze
   Body: {"data_id": 1, "analysis_type": "statistical"}

2. Router → Service
   service.execute(request)

3. Service → Provider
   provider.provide(ProviderInput(data_id=1))
   ← ProviderOutput(value=42.5, score=0.85)

4. Service → Calculator
   calculator.calculate(CalculatorInput(value=42.5, ...))
   ← CalculatorOutput(metrics={...}, insights=[...])

5. Service → Formatter
   formatter.format(FormatterInput(...))
   ← SampleAnalysisResponse(...)

6. Service → Router → Client
   HTTP 200 OK
   Body: {"data_id": 1, "metrics": {...}, ...}
```

### 에러 처리 흐름

```
1. 예외 발생 (어느 계층에서든)
   ↓
2. Service.handle_error()
   ↓
3. ServiceResult.fail(error_message)
   ↓
4. Router: HTTPException 발생
   ↓
5. FastAPI 예외 핸들러
   ↓
6. Client: HTTP 4xx/5xx 응답
```

## 확장 포인트

### 1. 새 도메인 추가

```
server/app/domain/my_domain/
├── models/         # SQLAlchemy 모델
├── schemas/        # Pydantic 스키마
├── providers/      # Provider 구현
├── calculators/    # Calculator 구현
├── formatters/     # Formatter 구현
└── service.py      # Service 구현
```

### 2. 새 Provider 전략 추가

```python
class CacheProvider(BaseProvider):
    """캐시에서 데이터 조회"""
    async def provide(self, input_data):
        return await self.cache.get(input_data.key)

class MLModelProvider(BaseProvider):
    """ML 모델 추론 결과 제공"""
    async def provide(self, input_data):
        return await self.model.predict(input_data.features)
```

### 3. 새 Calculator 타입 추가

```python
class MLCalculator(BaseCalculator):
    """머신러닝 기반 계산"""
    pass

class StatisticsCalculator(BaseCalculator):
    """통계 분석"""
    pass

class TimeSeriesCalculator(BaseCalculator):
    """시계열 분석"""
    pass
```

## 모범 사례

### DO

1. **각 계층의 책임을 명확히 준수**
2. **비즈니스 로직은 Service에 집중**
3. **Provider는 데이터 조회만**
4. **Calculator는 순수 함수로**
5. **에러는 적절한 예외 클래스 사용**
6. **모든 클래스에 Docstring 작성**
7. **타입 힌트 명시**

### DON'T

1. **Router에 비즈니스 로직 작성 금지**
2. **Provider에서 계산 로직 작성 금지**
3. **Calculator에서 DB 접근 금지**
4. **절차지향 함수 사용 금지**
5. **하위 계층이 상위 계층 참조 금지**
6. **도메인 간 직접 의존성 금지**

## 성능 고려사항

### 1. 데이터베이스 쿼리 최적화

- N+1 문제 방지 (eager loading)
- 인덱스 활용
- 쿼리 최소화

### 2. 비동기 처리

- async/await 일관성 유지
- 병렬 처리 가능한 작업은 gather() 사용
- 블로킹 작업은 thread pool 사용

### 3. 캐싱

- Provider 레벨에서 캐싱
- 계산 결과 캐싱 (Calculator)
- API 응답 캐싱 (필요시)

## 보안 고려사항

### 1. 인증/인가

- JWT 토큰 검증 (dependencies)
- 권한 확인 (Service.check_permissions)
- API 키 검증

### 2. 입력 검증

- Pydantic을 통한 타입 검증
- 비즈니스 규칙 검증 (Service.validate_request)
- SQL Injection 방지 (ORM 사용)

### 3. 민감정보 보호

- 비밀번호 해싱
- 민감정보 마스킹 (Formatter)
- 로그에 민감정보 제외

## 테스트 전략

### 1. 단위 테스트

- Provider, Calculator, Formatter 개별 테스트
- 모의 객체 사용
- 순수 함수 테스트 용이

### 2. 통합 테스트

- Service 전체 흐름 테스트
- 실제 DB 사용 (테스트 DB)
- API 엔드포인트 테스트

### 3. 테스트 커버리지

- 최소 80% 목표
- 핵심 비즈니스 로직 100%

## 마이그레이션 가이드

### 기존 절차지향 코드를 클래스 기반으로 변환

**Before (절차지향)**:
```python
async def analyze_data(data_id: int):
    data = await get_data_from_db(data_id)
    result = calculate_analysis(data)
    return format_response(result)
```

**After (클래스 기반)**:
```python
class AnalysisService(BaseService):
    async def execute(self, request):
        data = await self.provider.provide(...)
        result = await self.calculator.calculate(...)
        response = await self.formatter.format(...)
        return ServiceResult.ok(response)
```

## 참고 자료

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 문서](https://docs.sqlalchemy.org/en/20/)
- [Pydantic v2 문서](https://docs.pydantic.dev/latest/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
