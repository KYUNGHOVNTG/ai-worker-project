"""
SampleDataFormatter / SampleDataListFormatter 단위 테스트

이 파일은 Formatter 계층의 단위 테스트 작성 예시입니다.
Formatter는 ORM 모델 → Pydantic 스키마 변환만 수행하므로 DB 없이 테스트할 수 있습니다.
"""

from datetime import datetime, timezone

import pytest

from server.app.domain.sample.formatters import SampleDataFormatter, SampleDataListFormatter
from server.app.domain.sample.models import SampleDataModel


def _make_model(
    id: int = 1,
    name: str = "테스트",
    value: float = 100.0,
    description: str | None = None,
    score: float | None = None,
) -> SampleDataModel:
    """테스트용 SampleDataModel 인스턴스 생성 헬퍼"""
    now = datetime.now(timezone.utc)
    model = SampleDataModel(
        id=id,
        name=name,
        value=value,
        description=description,
        score=score,
        created_at=now,
        updated_at=now,
    )
    return model


@pytest.mark.unit
class TestSampleDataFormatter:
    """SampleDataFormatter 단위 테스트"""

    async def test_format_basic(self):
        """기본 모델 → 응답 스키마 변환"""
        formatter = SampleDataFormatter()
        model = _make_model(id=1, name="매출", value=1500.0, score=0.85)

        result = await formatter.format(model)

        assert result.id == 1
        assert result.name == "매출"
        assert result.value == 1500.0
        assert result.score == 0.85

    async def test_format_nullable_fields(self):
        """nullable 필드가 None인 경우"""
        formatter = SampleDataFormatter()
        model = _make_model(id=2, name="빈 데이터", value=0.0)

        result = await formatter.format(model)

        assert result.id == 2
        assert result.description is None
        assert result.score is None

    async def test_format_has_timestamps(self):
        """변환 결과에 created_at, updated_at 포함"""
        formatter = SampleDataFormatter()
        model = _make_model()

        result = await formatter.format(model)

        assert result.created_at is not None
        assert result.updated_at is not None


@pytest.mark.unit
class TestSampleDataListFormatter:
    """SampleDataListFormatter 단위 테스트"""

    async def test_format_list(self):
        """모델 리스트 → 응답 스키마 리스트 변환"""
        formatter = SampleDataListFormatter()
        models = [
            _make_model(id=1, name="A", value=10.0),
            _make_model(id=2, name="B", value=20.0),
            _make_model(id=3, name="C", value=30.0),
        ]

        result = await formatter.format(models)

        assert len(result) == 3
        assert result[0].name == "A"
        assert result[2].value == 30.0

    async def test_format_empty_list(self):
        """빈 리스트 → 빈 리스트 반환"""
        formatter = SampleDataListFormatter()

        result = await formatter.format([])

        assert result == []
