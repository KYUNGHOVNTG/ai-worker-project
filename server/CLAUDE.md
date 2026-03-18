# 백엔드 개발 지침 (FastAPI + SQLAlchemy 2.0)

## 아키텍처 흐름

```
HTTP Request → Router (엔드포인트) → Service (비즈니스 로직) → Repository (DB 접근)
                                                            → Calculator (순수 계산)
                                                            → Formatter (응답 변환)
```

## 디렉토리 구조

```
server/app/
  core/           # 인프라 (config, database, dependencies, middleware)
  shared/base/    # BaseService, BaseRepository, BaseCalculator, BaseFormatter
  shared/exceptions/  # ApplicationException 계층
  shared/types/       # ServiceResult, 공통 DTO
  domain/{name}/      # 도메인별 비즈니스 로직
    models/           # SQLAlchemy ORM 모델
    schemas/          # Pydantic 요청/응답 스키마
    repositories/     # 데이터 접근 계층
    calculators/      # 순수 비즈니스 로직
    formatters/       # 응답 포맷 변환
    service.py        # 도메인 서비스 (BaseService 상속)
  api/v1/endpoints/   # API 엔드포인트 (Router)
  examples/           # sample_domain 참고 구현
```

## 핵심 패턴

### Service (Facade 패턴)
- `BaseService` 상속 필수, `execute()` 메서드로 흐름 정의
- Repository·Calculator·Formatter를 조합하여 로직 오케스트레이션
- 반환: `ServiceResult[T]`

### Repository (Strategy 패턴)
- `BaseRepository` 상속, DB/API/File 등 데이터 소스 추상화
- 비동기 세션: `AsyncSession` 사용

### Calculator / Formatter
- 순수 함수(Side-effect Zero) — DB·외부 호출 금지
- 단위 테스트 최우선 대상

## Alembic 마이그레이션 워크플로

1. `server/app/domain/{name}/models/` 에서 ORM 모델 수정
2. `alembic revision --autogenerate -m "YYYY-MM-DD-설명"` (날짜 접두사 필수)
3. 생성된 마이그레이션 파일 검토
4. `alembic upgrade head` 실행
5. **기존 마이그레이션 파일 수정 절대 금지** (Append-only)

## 의존성 주입

```python
# FastAPI Depends 사용
async def get_db() -> AsyncGenerator[AsyncSession, None]: ...
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User: ...
```

## 코드 스타일

- `black --line-length 100` · `isort --profile black` · `ruff check`
- Pydantic v2 `BaseModel` 필수 (v1 호환 모드 사용 금지)
- 모든 로그에 `request_id` 포함, 민감 정보 로깅 금지
- 상세: `README.md` 참조
