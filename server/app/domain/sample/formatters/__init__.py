"""
Sample Domain Formatters

응답 포맷팅 로직 구현체입니다.
examples/sample_domain/formatters의 구조를 참고하세요.
"""

from server.app.shared.base import BaseFormatter
from server.app.shared.exceptions import FormatterException
from server.app.domain.sample.schemas import SampleDataResponse
from server.app.domain.sample.models import SampleDataModel


class SampleDataFormatter(BaseFormatter[SampleDataModel, SampleDataResponse]):
    """
    SampleDataModel → SampleDataResponse 변환 포맷터
    """

    async def format(self, input_data: SampleDataModel) -> SampleDataResponse:
        """ORM 모델을 API 응답 스키마로 변환합니다."""
        try:
            return SampleDataResponse.model_validate(input_data)
        except Exception as e:
            raise FormatterException(f"Failed to format sample data: {str(e)}")


class SampleDataListFormatter(BaseFormatter[list, list]):
    """
    list[SampleDataModel] → list[SampleDataResponse] 변환 포맷터
    """

    async def format(self, input_data: list[SampleDataModel]) -> list[SampleDataResponse]:
        """ORM 모델 리스트를 API 응답 스키마 리스트로 변환합니다."""
        try:
            return [SampleDataResponse.model_validate(item) for item in input_data]
        except Exception as e:
            raise FormatterException(f"Failed to format sample data list: {str(e)}")
