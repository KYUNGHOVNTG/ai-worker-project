"""
SampleScoreCalculator 단위 테스트

이 파일은 Calculator 계층의 단위 테스트 작성 예시입니다.
Calculator는 순수 계산 로직만 포함하므로 DB 없이 테스트할 수 있습니다.
"""

import pytest

from server.app.domain.sample.calculators import SampleScoreCalculator
from server.app.domain.sample.schemas import SampleCalculatorInput


@pytest.mark.unit
class TestSampleScoreCalculator:
    """SampleScoreCalculator 단위 테스트"""

    async def test_calculate_with_high_score(self):
        """score >= 0.8 → '높은 점수입니다.' 인사이트"""
        calculator = SampleScoreCalculator()
        input_data = SampleCalculatorInput(value=50.0, score=0.9)

        result = await calculator.calculate(input_data)

        assert result.metrics["value"] == 50.0
        assert result.metrics["score"] == 0.9
        assert result.metrics["normalized"] == 0.5
        assert "높은 점수입니다." in result.insights

    async def test_calculate_with_medium_score(self):
        """0.5 <= score < 0.8 → '보통 수준의 점수입니다.' 인사이트"""
        calculator = SampleScoreCalculator()
        input_data = SampleCalculatorInput(value=200.0, score=0.6)

        result = await calculator.calculate(input_data)

        assert result.metrics["score"] == 0.6
        assert result.metrics["normalized"] == 1.0  # 200/100 = 2.0, clamped to 1.0
        assert "보통 수준의 점수입니다." in result.insights

    async def test_calculate_with_low_score(self):
        """score < 0.5 → '낮은 점수입니다. 검토가 필요합니다.' 인사이트"""
        calculator = SampleScoreCalculator()
        input_data = SampleCalculatorInput(value=10.0, score=0.2)

        result = await calculator.calculate(input_data)

        assert result.metrics["score"] == 0.2
        assert result.metrics["normalized"] == 0.1  # 10/100
        assert "낮은 점수입니다. 검토가 필요합니다." in result.insights

    async def test_calculate_without_score(self):
        """score가 None이면 인사이트 비어있고 metrics.score는 0.0"""
        calculator = SampleScoreCalculator()
        input_data = SampleCalculatorInput(value=75.0, score=None)

        result = await calculator.calculate(input_data)

        assert result.metrics["score"] == 0.0
        assert result.metrics["normalized"] == 0.75
        assert result.insights == []

    async def test_normalized_clamped_to_zero(self):
        """value가 음수일 때 normalized는 0.0으로 클램핑"""
        calculator = SampleScoreCalculator()
        input_data = SampleCalculatorInput(value=-50.0, score=0.5)

        result = await calculator.calculate(input_data)

        assert result.metrics["normalized"] == 0.0
