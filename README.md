# AI 데이터 분석 웹 서비스 템플릿

FastAPI + SQLAlchemy 기반의 확장 가능한 백엔드 스켈레톤

## 프로젝트 개요

이 프로젝트는 AI 데이터 분석 웹 서비스를 위한 재사용 가능한 백엔드 템플릿입니다.
도메인 플러그인 구조를 통해 새로운 기능을 쉽게 추가할 수 있도록 설계되었습니다.

### 주요 특징

- **계층화된 아키텍처**: Router → Service → Provider/Calculator/Formatter
- **도메인 플러그인 구조**: 새로운 도메인을 독립적으로 추가 가능
- **모든 비즈니스 로직은 클래스 기반**: 절차지향 함수 사용 금지
- **타입 안전성**: Pydantic v2 + SQLAlchemy 2.0
- **비동기 처리**: async/await 기반
- **확장 가능**: 명확한 패턴과 추상 클래스 제공

## 기술 스택

- **Python**: 3.12
- **Web Framework**: FastAPI
- **ORM**: SQLAlchemy 2.0 (async)
- **Database**: PostgreSQL (asyncpg)
- **Validation**: Pydantic v2
- **Testing**: pytest + pytest-asyncio
- **Code Quality**: black, isort, ruff, mypy

## 프로젝트 구조

```
ai-worker-project/
├── server/
│   ├── main.py                 # FastAPI 애플리케이션 진입점
│   └── app/
│       ├── core/               # 핵심 인프라
│       │   ├── config.py       # 설정 관리
│       │   ├── database.py     # DB 연결 및 세션
│       │   └── dependencies.py # FastAPI 의존성
│       ├── shared/             # 공유 컴포넌트
│       │   ├── base/           # 추상 베이스 클래스
│       │   │   ├── service.py
│       │   │   ├── provider.py
│       │   │   ├── calculator.py
│       │   │   └── formatter.py
│       │   ├── exceptions/     # 커스텀 예외
│       │   └── types/          # 공통 타입
│       ├── domain/             # 비즈니스 도메인
│       ├── examples/           # 예제 도메인
│       │   └── sample_domain/  # 샘플 도메인 구현
│       │       ├── models/
│       │       ├── schemas/
│       │       ├── providers/
│       │       ├── calculators/
│       │       ├── formatters/
│       │       └── service.py
│       └── api/
│           └── v1/
│               ├── endpoints/  # API 엔드포인트
│               └── router.py   # 라우터 통합
├── tests/                      # 테스트
│   ├── unit/
│   └── integration/
├── requirements.txt
├── pyproject.toml
└── .env.example
```

## 아키텍처

```
┌─────────────────────────────────────────────┐
│            FastAPI Router (API)             │
│         /api/v1/sample/analyze              │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│          Service (비즈니스 로직 조율)          │
│       SampleDomainService.execute()         │
└─────┬───────────┬──────────────┬────────────┘
      │           │              │
      ▼           ▼              ▼
┌─────────┐ ┌────────────┐ ┌────────────┐
│Provider │ │Calculator  │ │Formatter   │
│데이터조회│ │계산/분석    │ │응답포맷팅   │
└─────────┘ └────────────┘ └────────────┘
```

### 각 계층의 역할

1. **Router** (API Layer)
   - HTTP 요청 수신
   - 입력 검증 (Pydantic)
   - Service 호출
   - HTTP 응답 반환

2. **Service** (Business Logic Layer)
   - Provider, Calculator, Formatter 조율
   - 트랜잭션 관리
   - 권한 검증
   - 에러 핸들링

3. **Provider** (Data Access Layer)
   - 데이터베이스 쿼리
   - 외부 API 호출
   - 파일 시스템 접근
   - 캐시 조회

4. **Calculator** (Computation Layer)
   - 순수한 계산 로직
   - 데이터 분석
   - 통계 처리
   - 알고리즘 적용

5. **Formatter** (Presentation Layer)
   - API 응답 형식 변환
   - 데이터 직렬화
   - 민감정보 마스킹

자세한 내용은 [ARCHITECTURE.md](ARCHITECTURE.md)를 참조하세요.

## 시작하기

### 1. 환경 설정

```bash
# Python 3.12 가상환경 생성
python3.12 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 개발 도구 설치 (선택)
pip install -e ".[dev]"
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정
# - DATABASE_URL 설정
# - SECRET_KEY 변경
```

### 3. 데이터베이스 설정

```bash
# PostgreSQL 실행 (Docker 사용 시)
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ai_analysis_db \
  -p 5432:5432 \
  postgres:16

# Alembic 마이그레이션 (TODO: 초기 마이그레이션 생성 필요)
# alembic upgrade head
```

### 4. 애플리케이션 실행

```bash
# 개발 서버 실행
python -m server.main

# 또는 uvicorn 직접 실행
uvicorn server.main:app --reload

# API 문서 확인
# http://localhost:8000/docs
```

## 새 도메인 추가하기

### 1. 도메인 디렉토리 생성

```bash
mkdir -p server/app/domain/my_domain/{models,schemas,providers,calculators,formatters}
```

### 2. 각 컴포넌트 구현

```python
# server/app/domain/my_domain/providers/__init__.py
from server.app.shared.base import BaseProvider

class MyDataProvider(BaseProvider[MyInput, MyOutput]):
    async def provide(self, input_data: MyInput) -> MyOutput:
        # 데이터 조회 로직
        pass

# server/app/domain/my_domain/calculators/__init__.py
from server.app.shared.base import BaseCalculator

class MyCalculator(BaseCalculator[MyInput, MyOutput]):
    async def calculate(self, input_data: MyInput) -> MyOutput:
        # 계산 로직
        pass

# server/app/domain/my_domain/formatters/__init__.py
from server.app.shared.base import BaseFormatter

class MyFormatter(BaseFormatter[MyInput, MyOutput]):
    async def format(self, input_data: MyInput) -> MyOutput:
        # 포맷팅 로직
        pass

# server/app/domain/my_domain/service.py
from server.app.shared.base import BaseService

class MyDomainService(BaseService[MyRequest, MyResponse]):
    async def execute(self, request: MyRequest) -> ServiceResult[MyResponse]:
        # Provider, Calculator, Formatter 조율
        pass
```

### 3. API 엔드포인트 추가

```python
# server/app/api/v1/endpoints/my_domain.py
from fastapi import APIRouter

router = APIRouter(prefix="/my-domain", tags=["my-domain"])

@router.post("/action")
async def my_action(...):
    service = MyDomainService(db)
    result = await service.execute(request)
    return result.data
```

### 4. 라우터 등록

```python
# server/app/api/v1/router.py
from server.app.api.v1.endpoints import my_domain

api_router.include_router(my_domain.router)
```

## 테스트

```bash
# 전체 테스트 실행
pytest

# 커버리지 포함
pytest --cov=server --cov-report=html

# 특정 테스트만 실행
pytest tests/unit/
pytest tests/integration/

# 마커 사용
pytest -m unit
pytest -m integration
```

## 코드 품질

```bash
# 코드 포맷팅
black server/
isort server/

# 린팅
ruff check server/

# 타입 체크
mypy server/
```

## 배포

TODO: 배포 가이드 작성
- Docker 이미지 빌드
- 환경별 설정
- CI/CD 파이프라인

## 라이센스

MIT

## 기여

이슈와 PR을 환영합니다!

## 문의

문제가 있거나 질문이 있으시면 이슈를 등록해주세요.
