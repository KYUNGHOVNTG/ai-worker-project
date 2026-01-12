"""
Sample Domain Formatters

응답 포맷팅 로직 구현체입니다.
BaseFormatter를 상속받아 API 응답 형식으로 데이터를 변환합니다.
"""

from datetime import datetime, timezone
from typing import Any

from server.app.shared.base import BaseFormatter
from server.app.shared.exceptions import FormatterException
from server.app.examples.sample_domain.schemas import (
    SampleAnalysisResponse,
    SampleFormatterInput,
)


class SampleResponseFormatter(BaseFormatter[SampleFormatterInput, SampleAnalysisResponse]):
    """
    샘플 응답 포맷터

    분석 결과를 API 응답 형식으로 변환합니다.

    책임:
        - 내부 데이터 구조를 API 스키마로 변환
        - 날짜/시간 포맷팅
        - 민감 정보 마스킹
        - 응답 메시지 생성

    원칙:
        - 비즈니스 로직 없음 (단순 변환만)
        - 순수 함수
        - 명확한 매핑

    사용 예시:
        formatter = SampleResponseFormatter()
        input_data = SampleFormatterInput(
            data_id=1,
            analysis_type="statistical",
            metrics={"mean": 42.5},
            insights=["정규 분포를 따릅니다"]
        )
        response = await formatter.format(input_data)
    """

    async def format(self, input_data: SampleFormatterInput) -> SampleAnalysisResponse:
        """
        분석 결과를 API 응답 형식으로 변환합니다.

        Args:
            input_data: 포맷팅할 데이터

        Returns:
            SampleAnalysisResponse: API 응답 스키마

        Raises:
            FormatterException: 포맷팅 중 오류 발생 시
        """
        try:
            # 결과 요약 생성
            summary = self._generate_summary(
                input_data.analysis_type,
                input_data.metrics,
                input_data.insights
            )

            # 응답 객체 생성
            response = SampleAnalysisResponse(
                data_id=input_data.data_id,
                analysis_type=input_data.analysis_type,
                result_summary=summary,
                metrics=input_data.metrics,
                insights=input_data.insights,
                analyzed_at=datetime.now(timezone.utc),
            )

            return response

        except Exception as e:
            raise FormatterException(
                f"Failed to format response: {str(e)}",
                details={"data_id": input_data.data_id}
            )

    def _generate_summary(
        self,
        analysis_type: str,
        metrics: dict[str, float],
        insights: list[str]
    ) -> str:
        """
        분석 결과 요약을 생성합니다.

        Args:
            analysis_type: 분석 유형
            metrics: 분석 지표
            insights: 인사이트

        Returns:
            str: 요약 메시지

        TODO: 더 정교한 요약 로직 구현
            - 분석 유형별 템플릿
            - 주요 지표 강조
            - 다국어 지원
        """
        # 스텁: 간단한 요약 생성
        num_metrics = len(metrics)
        num_insights = len(insights)

        return (
            f"{analysis_type.capitalize()} 분석이 완료되었습니다. "
            f"{num_metrics}개의 지표와 {num_insights}개의 인사이트가 생성되었습니다."
        )

    def _format_metric_value(self, value: float, precision: int = 2) -> str:
        """
        메트릭 값을 포맷팅합니다.

        Args:
            value: 포맷팅할 값
            precision: 소수점 자릿수

        Returns:
            str: 포맷팅된 문자열
        """
        # TODO: 실제 구현
        return f"{value:.{precision}f}"

    def _format_percentage(self, value: float) -> str:
        """
        퍼센티지로 포맷팅합니다.

        Args:
            value: 0-1 사이의 값

        Returns:
            str: 퍼센티지 문자열
        """
        # TODO: 실제 구현
        return f"{value * 100:.1f}%"


class SampleListFormatter(BaseFormatter[list[dict], list[dict]]):
    """
    리스트 응답 포맷터

    여러 데이터를 리스트 형태로 포맷팅합니다.

    TODO: 리스트 포맷팅 로직 구현
        - 페이지네이션 메타데이터 추가
        - 정렬
        - 필터링
    """

    async def format(self, input_data: list[dict]) -> list[dict]:
        """
        데이터 리스트를 포맷팅합니다.

        Args:
            input_data: 원본 데이터 리스트

        Returns:
            list[dict]: 포맷팅된 데이터 리스트
        """
        # TODO: 실제 구현
        return input_data


class SampleChartFormatter(BaseFormatter[dict, dict]):
    """
    차트 데이터 포맷터

    차트 라이브러리에 맞는 데이터 형식을 생성합니다.

    TODO: 차트 데이터 포맷팅 로직 구현
        - Chart.js 형식
        - Recharts 형식
        - D3.js 형식
    """

    async def format(self, input_data: dict) -> dict:
        """
        차트 데이터를 포맷팅합니다.

        Args:
            input_data: 원본 데이터

        Returns:
            dict: 차트 라이브러리용 데이터
        """
        # TODO: 실제 구현
        # Chart.js 형식 예시
        return {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
            "datasets": [
                {
                    "label": "Sample Data",
                    "data": [65, 59, 80, 81, 56],
                    "backgroundColor": "rgba(75, 192, 192, 0.2)",
                    "borderColor": "rgba(75, 192, 192, 1)",
                    "borderWidth": 1,
                }
            ],
        }


class SampleExportFormatter(BaseFormatter[dict, dict]):
    """
    데이터 내보내기 포맷터

    CSV, Excel 등으로 내보낼 데이터를 준비합니다.

    TODO: 내보내기 포맷 구현
        - CSV 변환
        - Excel 변환
        - JSON 변환
    """

    async def format(self, input_data: dict) -> dict:
        """
        내보내기용 데이터를 포맷팅합니다.

        Args:
            input_data: 원본 데이터

        Returns:
            dict: 내보내기용 데이터
        """
        # TODO: 실제 구현
        return {
            "headers": ["ID", "Name", "Value", "Score"],
            "rows": [
                # 데이터 행들...
            ],
        }
