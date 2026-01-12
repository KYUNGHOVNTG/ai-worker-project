"""
Domain 모듈

각 도메인(비즈니스 영역)을 독립적인 플러그인 형태로 구현합니다.

도메인 추가 방법:
    1. server/app/domain/ 또는 server/app/examples/ 아래에 새 디렉토리 생성
    2. 다음 구조로 구현:
        my_domain/
        ├── __init__.py
        ├── models/          # SQLAlchemy 모델
        ├── schemas/         # Pydantic 스키마
        ├── providers/       # BaseProvider 구현체
        ├── calculators/     # BaseCalculator 구현체
        ├── formatters/      # BaseFormatter 구현체
        └── service.py       # BaseService 구현체

    3. api/v1/endpoints/ 에 라우터 추가
    4. api/v1/router.py에 라우터 등록

예시:
    from server.app.examples.sample_domain import SampleDomainService
"""
