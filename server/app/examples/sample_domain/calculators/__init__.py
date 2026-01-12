"""
Sample Domain Calculators

계산 및 분석 로직 구현체입니다.
BaseCalculator를 상속받아 순수한 계산 로직을 구현합니다.
"""

from typing import Optional

from server.app.shared.base import BaseCalculator
from server.app.shared.exceptions import CalculatorException
from server.app.examples.sample_domain.schemas import (
    SampleCalculatorInput,
    SampleCalculatorOutput,
)


class SampleAnalysisCalculator(BaseCalculator[SampleCalculatorInput, SampleCalculatorOutput]):
    """
    샘플 분석 계산기

    데이터 분석 로직을 수행합니다.

    책임:
        - 통계 계산
        - 인사이트 생성
        - 이상치 탐지
        - 트렌드 분석

    원칙:
        - 순수 함수 (동일 입력 → 동일 출력)
        - 외부 의존성 없음
        - 부수 효과 없음

    사용 예시:
        calculator = SampleAnalysisCalculator()
        input_data = SampleCalculatorInput(
            value=42.5,
            score=0.85,
            analysis_type="statistical"
        )
        result = await calculator.calculate(input_data)
    """

    async def calculate(self, input_data: SampleCalculatorInput) -> SampleCalculatorOutput:
        """
        분석을 수행합니다.

        Args:
            input_data: 분석할 데이터

        Returns:
            SampleCalculatorOutput: 분석 결과

        Raises:
            CalculatorException: 계산 중 오류 발생 시

        TODO: 실제 분석 로직 구현
        """
        try:
            # 1. 입력 데이터 검증
            await self.validate_input(input_data)

            # 2. 분석 유형에 따라 다른 로직 수행
            if input_data.analysis_type == "statistical":
                metrics, insights = await self._statistical_analysis(input_data)
            elif input_data.analysis_type == "trend":
                metrics, insights = await self._trend_analysis(input_data)
            elif input_data.analysis_type == "anomaly":
                metrics, insights = await self._anomaly_detection(input_data)
            else:
                # 기본 분석
                metrics, insights = await self._default_analysis(input_data)

            # 3. 결과 검증
            output = SampleCalculatorOutput(
                metrics=metrics,
                insights=insights,
            )
            self.validate_output(output)

            return output

        except Exception as e:
            raise CalculatorException(
                f"Analysis calculation failed: {str(e)}",
                details={"analysis_type": input_data.analysis_type}
            )

    async def _statistical_analysis(
        self,
        input_data: SampleCalculatorInput
    ) -> tuple[dict[str, float], list[str]]:
        """
        통계 분석을 수행합니다.

        Args:
            input_data: 입력 데이터

        Returns:
            tuple[dict, list]: (지표, 인사이트)

        TODO: 실제 통계 분석 로직 구현
            - 평균, 중앙값, 표준편차 계산
            - 분포 분석
            - 상관관계 분석
        """
        # 스텁: 더미 통계 지표
        metrics = {
            "mean": input_data.value,
            "median": input_data.value * 0.95,
            "std_dev": input_data.value * 0.1,
            "variance": (input_data.value * 0.1) ** 2,
        }

        # 스텁: 더미 인사이트
        insights = [
            "데이터가 정규 분포를 따릅니다",
            f"평균값은 {metrics['mean']:.2f}입니다",
        ]

        # 임계값 기반 인사이트 추가
        if input_data.threshold and input_data.score:
            if input_data.score > input_data.threshold:
                insights.append(
                    f"점수({input_data.score:.2f})가 임계값({input_data.threshold:.2f})을 초과합니다"
                )

        return metrics, insights

    async def _trend_analysis(
        self,
        input_data: SampleCalculatorInput
    ) -> tuple[dict[str, float], list[str]]:
        """
        트렌드 분석을 수행합니다.

        TODO: 실제 트렌드 분석 로직 구현
            - 시계열 분석
            - 추세선 계산
            - 계절성 분석
            - 예측
        """
        # 스텁
        metrics = {
            "trend_direction": 1.0,  # 1: 상승, -1: 하락, 0: 보합
            "trend_strength": 0.7,
            "change_rate": 0.05,
        }

        insights = [
            "상승 트렌드가 관찰됩니다",
            "트렌드 강도는 중간 수준입니다",
        ]

        return metrics, insights

    async def _anomaly_detection(
        self,
        input_data: SampleCalculatorInput
    ) -> tuple[dict[str, float], list[str]]:
        """
        이상치 탐지를 수행합니다.

        TODO: 실제 이상치 탐지 로직 구현
            - Z-score 계산
            - IQR 방법
            - Isolation Forest
            - DBSCAN
        """
        # 스텁
        is_anomaly = False
        if input_data.score and input_data.score < 0.3:
            is_anomaly = True

        metrics = {
            "anomaly_score": 0.2 if is_anomaly else 0.8,
            "is_anomaly": 1.0 if is_anomaly else 0.0,
            "confidence": 0.85,
        }

        insights = []
        if is_anomaly:
            insights.append("이상치가 감지되었습니다")
            insights.append("추가 검토가 필요합니다")
        else:
            insights.append("정상 범위 내의 데이터입니다")

        return metrics, insights

    async def _default_analysis(
        self,
        input_data: SampleCalculatorInput
    ) -> tuple[dict[str, float], list[str]]:
        """
        기본 분석을 수행합니다.
        """
        metrics = {
            "value": input_data.value,
            "score": input_data.score or 0.0,
        }

        insights = [
            f"값: {input_data.value}",
            f"점수: {input_data.score or 'N/A'}",
        ]

        return metrics, insights

    async def validate_input(self, input_data: SampleCalculatorInput) -> None:
        """
        입력 데이터의 유효성을 검증합니다.

        TODO: 필요한 검증 로직 추가
        """
        # 값 범위 검증 예시
        if input_data.value < 0:
            raise CalculatorException("Value must be non-negative")

        if input_data.score is not None and not (0 <= input_data.score <= 1):
            raise CalculatorException("Score must be between 0 and 1")


class SampleMetricsCalculator(BaseCalculator[dict, dict]):
    """
    메트릭 계산기

    다양한 메트릭을 계산합니다.

    TODO: 필요한 메트릭 계산 로직 구현
        - 성장률
        - 전환율
        - ROI
        - 기타 KPI
    """

    async def calculate(self, input_data: dict) -> dict:
        """
        메트릭을 계산합니다.

        Args:
            input_data: 계산에 필요한 원본 데이터

        Returns:
            dict: 계산된 메트릭
        """
        # TODO: 실제 구현
        return {
            "growth_rate": 0.15,
            "conversion_rate": 0.03,
            "roi": 1.25,
        }


class SampleScoreCalculator(BaseCalculator[dict, float]):
    """
    점수 계산기

    여러 요소를 종합하여 점수를 계산합니다.

    TODO: 점수 계산 로직 구현
        - 가중치 적용
        - 정규화
        - 복합 점수 계산
    """

    def __init__(self, weights: Optional[dict[str, float]] = None):
        """
        Args:
            weights: 각 요소별 가중치
        """
        self.weights = weights or {
            "quality": 0.4,
            "performance": 0.3,
            "reliability": 0.3,
        }

    async def calculate(self, input_data: dict) -> float:
        """
        종합 점수를 계산합니다.

        Args:
            input_data: 각 요소별 점수

        Returns:
            float: 종합 점수 (0-1)
        """
        # TODO: 실제 구현
        # total_score = sum(
        #     input_data.get(key, 0) * weight
        #     for key, weight in self.weights.items()
        # )
        # return min(1.0, max(0.0, total_score))

        # 스텁
        return 0.75
