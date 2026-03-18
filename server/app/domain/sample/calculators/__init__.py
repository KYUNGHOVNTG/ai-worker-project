"""
Sample Domain Calculators

순수 계산 로직 구현체입니다.
examples/sample_domain/calculators의 구조를 참고하세요.
"""

from server.app.shared.base import BaseCalculator
from server.app.shared.exceptions import CalculatorException
from server.app.domain.sample.schemas import (
    SampleCalculatorInput,
    SampleCalculatorOutput,
)


class SampleScoreCalculator(BaseCalculator[SampleCalculatorInput, SampleCalculatorOutput]):
    """
    샘플 점수 계산기

    value와 score를 받아 분석 지표를 계산합니다.
    DB·외부 호출 없이 순수 계산만 수행합니다.
    """

    async def calculate(self, input_data: SampleCalculatorInput) -> SampleCalculatorOutput:
        """분석 지표를 계산합니다."""
        try:
            metrics: dict[str, float] = {
                "value": input_data.value,
                "score": input_data.score or 0.0,
                "normalized": min(1.0, max(0.0, input_data.value / 100.0)),
            }

            insights: list[str] = []
            if input_data.score is not None:
                if input_data.score >= 0.8:
                    insights.append("높은 점수입니다.")
                elif input_data.score >= 0.5:
                    insights.append("보통 수준의 점수입니다.")
                else:
                    insights.append("낮은 점수입니다. 검토가 필요합니다.")

            return SampleCalculatorOutput(metrics=metrics, insights=insights)
        except Exception as e:
            raise CalculatorException(f"Score calculation failed: {str(e)}")
