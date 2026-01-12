"""
Sample Domain

도메인 플러그인 구조의 예제입니다.
새로운 도메인을 추가할 때 이 구조를 참고하세요.

구성 요소:
    - models: 데이터베이스 모델 (SQLAlchemy)
    - schemas: API 스키마 (Pydantic)
    - providers: 데이터 제공자
    - calculators: 계산/분석 로직
    - formatters: 응답 포맷터
    - service: 비즈니스 로직 조율자
"""

from server.app.examples.sample_domain.service import SampleDomainService

__all__ = ["SampleDomainService"]
