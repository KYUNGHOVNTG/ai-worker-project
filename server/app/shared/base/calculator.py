"""
BaseCalculator: 계산 로직 추상 클래스

비즈니스 로직 중 계산, 변환, 분석 등의 순수 함수적 작업을 담당합니다.
상태를 가지지 않으며 외부 의존성 없이 동작해야 합니다.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from server.app.shared.types import CalculatorInput, CalculatorOutput

# 제네릭 타입 변수
TInput = TypeVar("TInput", bound=CalculatorInput)
TOutput = TypeVar("TOutput", bound=CalculatorOutput)


class BaseCalculator(ABC, Generic[TInput, TOutput]):
    """
    Calculator 추상 베이스 클래스

    모든 Calculator는 이 클래스를 상속받아 구현해야 합니다.

    책임:
        - 데이터 계산 및 변환
        - 통계 분석
        - 알고리즘 적용
        - 규칙 기반 판단
        - 데이터 집계

    원칙:
        - 순수 함수여야 합니다 (동일 입력 → 동일 출력)
        - 외부 상태에 의존하지 않습니다
        - 부수 효과(side effect)가 없어야 합니다
        - 테스트가 용이해야 합니다

    사용 예시:
        class PriceCalculator(BaseCalculator[PriceInput, PriceOutput]):
            async def calculate(self, input_data: PriceInput) -> PriceOutput:
                # 가격 계산 로직
                total = input_data.base_price * input_data.quantity
                discount = self._apply_discount(total, input_data.discount_rate)
                return PriceOutput(total=total - discount)

            def _apply_discount(self, amount: float, rate: float) -> float:
                return amount * rate
    """

    @abstractmethod
    async def calculate(self, input_data: TInput) -> TOutput:
        """
        계산을 수행합니다.

        이 메서드를 구현할 때:
            1. input_data에서 필요한 값을 추출
            2. 계산 로직 수행 (헬퍼 메서드로 분리 권장)
            3. 계산 결과를 TOutput 형태로 반환

        Args:
            input_data: 계산에 필요한 입력 데이터

        Returns:
            TOutput: 계산 결과

        Raises:
            CalculatorException: 계산 중 오류 발생 시

        TODO: 구현 시 다음 사항을 고려하세요
            - 계산 로직을 작은 단위로 분리 (단일 책임 원칙)
            - 복잡한 계산은 헬퍼 메서드로 추출
            - 엣지 케이스 처리 (0으로 나누기, null 값 등)
            - 명확한 변수명과 주석 사용
        """
        raise NotImplementedError("Subclass must implement 'calculate' method")

    async def validate_input(self, input_data: TInput) -> None:
        """
        입력 데이터의 유효성을 검증합니다.

        계산 전에 데이터의 유효성을 확인합니다.
        기본 구현은 아무것도 하지 않습니다.

        Args:
            input_data: 검증할 입력 데이터

        Raises:
            ValidationException: 유효성 검증 실패 시

        TODO: 구현 예시
            - 필수 값 존재 여부
            - 숫자 범위 검증
            - 데이터 형식 검증
            - 비즈니스 규칙 검증
        """
        pass

    def validate_output(self, output_data: TOutput) -> None:
        """
        출력 데이터의 유효성을 검증합니다.

        계산 결과가 예상 범위 내에 있는지 확인합니다.
        기본 구현은 아무것도 하지 않습니다.

        Args:
            output_data: 검증할 출력 데이터

        Raises:
            CalculatorException: 출력 검증 실패 시

        TODO: 구현 예시
            - 결과값이 음수가 아닌지 확인
            - 결과값이 최대치를 초과하지 않는지 확인
            - 필수 필드가 모두 채워졌는지 확인
        """
        pass


class StatisticsCalculator(BaseCalculator[TInput, TOutput], ABC):
    """
    통계 계산 특화 Calculator

    통계 분석에 자주 사용되는 유틸리티를 제공합니다.
    """

    def calculate_mean(self, values: list[float]) -> float:
        """
        평균값을 계산합니다.

        Args:
            values: 숫자 리스트

        Returns:
            float: 평균값

        TODO: 구현 예시
            if not values:
                return 0.0
            return sum(values) / len(values)
        """
        raise NotImplementedError("Subclass must implement 'calculate_mean' method")

    def calculate_median(self, values: list[float]) -> float:
        """
        중앙값을 계산합니다.

        Args:
            values: 숫자 리스트

        Returns:
            float: 중앙값

        TODO: 구현 예시
            import statistics
            return statistics.median(values)
        """
        raise NotImplementedError("Subclass must implement 'calculate_median' method")

    def calculate_std_dev(self, values: list[float]) -> float:
        """
        표준편차를 계산합니다.

        Args:
            values: 숫자 리스트

        Returns:
            float: 표준편차

        TODO: 구현 예시
            import statistics
            return statistics.stdev(values)
        """
        raise NotImplementedError("Subclass must implement 'calculate_std_dev' method")


class TransformCalculator(BaseCalculator[TInput, TOutput], ABC):
    """
    데이터 변환 특화 Calculator

    데이터 형태를 변환하거나 정규화하는 작업을 수행합니다.
    """

    async def transform(self, input_data: TInput) -> TOutput:
        """
        데이터를 변환합니다.

        calculate 메서드의 별칭으로 사용할 수 있습니다.

        Args:
            input_data: 변환할 데이터

        Returns:
            TOutput: 변환된 데이터
        """
        return await self.calculate(input_data)

    def normalize(self, value: float, min_val: float, max_val: float) -> float:
        """
        값을 0-1 범위로 정규화합니다.

        Args:
            value: 정규화할 값
            min_val: 최소값
            max_val: 최대값

        Returns:
            float: 정규화된 값 (0-1 사이)

        TODO: 구현 예시
            if max_val == min_val:
                return 0.5
            return (value - min_val) / (max_val - min_val)
        """
        raise NotImplementedError("Subclass must implement 'normalize' method")
