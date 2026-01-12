"""
BaseFormatter: 데이터 포맷팅 추상 클래스

계산된 데이터를 API 응답 형식으로 변환하는 책임을 가집니다.
Presentation Layer와 Business Layer 사이의 어댑터 역할을 수행합니다.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Any

from server.app.shared.types import FormatterInput, FormatterOutput

# 제네릭 타입 변수
TInput = TypeVar("TInput", bound=FormatterInput)
TOutput = TypeVar("TOutput", bound=FormatterOutput)


class BaseFormatter(ABC, Generic[TInput, TOutput]):
    """
    Formatter 추상 베이스 클래스

    모든 Formatter는 이 클래스를 상속받아 구현해야 합니다.

    책임:
        - 내부 데이터를 API 응답 형식으로 변환
        - 데이터 직렬화
        - 응답 구조 구성
        - 필드명 매핑
        - 데이터 마스킹 (민감 정보)

    원칙:
        - 순수 함수여야 합니다
        - 비즈니스 로직을 포함하지 않습니다
        - 단순 변환만 수행합니다

    사용 예시:
        class UserResponseFormatter(BaseFormatter[UserData, UserResponse]):
            async def format(self, input_data: UserData) -> UserResponse:
                return UserResponse(
                    id=input_data.user_id,
                    name=input_data.full_name,
                    email=self._mask_email(input_data.email),
                    created_at=input_data.created_at.isoformat()
                )

            def _mask_email(self, email: str) -> str:
                parts = email.split('@')
                return f"{parts[0][:3]}***@{parts[1]}"
    """

    @abstractmethod
    async def format(self, input_data: TInput) -> TOutput:
        """
        데이터를 포맷팅합니다.

        이 메서드를 구현할 때:
            1. input_data에서 필요한 필드를 추출
            2. API 응답 형식에 맞게 필드명 변환
            3. 민감 정보 마스킹 처리
            4. TOutput 형태로 반환

        Args:
            input_data: 포맷팅할 입력 데이터

        Returns:
            TOutput: 포맷팅된 출력 데이터

        Raises:
            FormatterException: 포맷팅 중 오류 발생 시

        TODO: 구현 시 다음 사항을 고려하세요
            - API 응답 스키마와 일치하는지 확인
            - 민감 정보(이메일, 전화번호, 주소 등) 마스킹
            - 날짜/시간 형식 통일 (ISO 8601 권장)
            - null 값 처리 정책
            - 다국어 지원 고려
        """
        raise NotImplementedError("Subclass must implement 'format' method")

    async def format_list(self, items: list[TInput]) -> list[TOutput]:
        """
        여러 데이터를 한 번에 포맷팅합니다.

        Args:
            items: 포맷팅할 데이터 리스트

        Returns:
            list[TOutput]: 포맷팅된 데이터 리스트

        TODO: 구현 예시
            return [await self.format(item) for item in items]
        """
        return [await self.format(item) for item in items]

    def mask_string(self, value: str, visible_chars: int = 3, mask_char: str = "*") -> str:
        """
        문자열을 마스킹합니다.

        Args:
            value: 마스킹할 문자열
            visible_chars: 보이는 문자 수
            mask_char: 마스킹 문자

        Returns:
            str: 마스킹된 문자열

        TODO: 구현 예시
            if len(value) <= visible_chars:
                return value
            return value[:visible_chars] + mask_char * (len(value) - visible_chars)
        """
        raise NotImplementedError("Subclass must implement 'mask_string' method")

    def format_currency(self, amount: float, currency: str = "USD") -> str:
        """
        금액을 포맷팅합니다.

        Args:
            amount: 금액
            currency: 통화 코드

        Returns:
            str: 포맷팅된 금액 문자열

        TODO: 구현 예시
            return f"{currency} {amount:,.2f}"
        """
        raise NotImplementedError("Subclass must implement 'format_currency' method")


class JSONFormatter(BaseFormatter[TInput, TOutput], ABC):
    """
    JSON 응답 특화 Formatter

    JSON API 응답 생성을 위한 추가 유틸리티를 제공합니다.
    """

    def to_dict(self, output_data: TOutput) -> dict[str, Any]:
        """
        출력 데이터를 딕셔너리로 변환합니다.

        Args:
            output_data: 변환할 출력 데이터

        Returns:
            dict: 딕셔너리 형태의 데이터

        TODO: 구현 예시
            if isinstance(output_data, BaseModel):
                return output_data.model_dump()
            return dict(output_data)
        """
        raise NotImplementedError("Subclass must implement 'to_dict' method")

    def remove_null_fields(self, data: dict[str, Any]) -> dict[str, Any]:
        """
        딕셔너리에서 null 값을 제거합니다.

        Args:
            data: 원본 딕셔너리

        Returns:
            dict: null 값이 제거된 딕셔너리

        TODO: 구현 예시
            return {k: v for k, v in data.items() if v is not None}
        """
        raise NotImplementedError("Subclass must implement 'remove_null_fields' method")


class CSVFormatter(BaseFormatter[TInput, TOutput], ABC):
    """
    CSV 파일 생성 특화 Formatter

    CSV 형식의 데이터 생성을 위한 유틸리티를 제공합니다.
    """

    def get_csv_headers(self) -> list[str]:
        """
        CSV 헤더를 반환합니다.

        Returns:
            list[str]: CSV 헤더 목록

        TODO: 구현 예시
            return ["id", "name", "email", "created_at"]
        """
        raise NotImplementedError("Subclass must implement 'get_csv_headers' method")

    def to_csv_row(self, output_data: TOutput) -> list[Any]:
        """
        출력 데이터를 CSV 행으로 변환합니다.

        Args:
            output_data: 변환할 출력 데이터

        Returns:
            list[Any]: CSV 행 데이터

        TODO: 구현 예시
            return [
                output_data.id,
                output_data.name,
                output_data.email,
                output_data.created_at.isoformat()
            ]
        """
        raise NotImplementedError("Subclass must implement 'to_csv_row' method")


class ChartDataFormatter(BaseFormatter[TInput, TOutput], ABC):
    """
    차트 데이터 생성 특화 Formatter

    프론트엔드 차트 라이브러리에 맞는 데이터 형식을 생성합니다.
    """

    def format_for_chart(self, input_data: TInput, chart_type: str) -> dict[str, Any]:
        """
        차트 타입에 맞는 데이터를 생성합니다.

        Args:
            input_data: 원본 데이터
            chart_type: 차트 타입 (line, bar, pie 등)

        Returns:
            dict: 차트 라이브러리용 데이터 구조

        TODO: 구현 예시
            if chart_type == "line":
                return {
                    "labels": [...],
                    "datasets": [{
                        "label": "...",
                        "data": [...]
                    }]
                }
        """
        raise NotImplementedError("Subclass must implement 'format_for_chart' method")
