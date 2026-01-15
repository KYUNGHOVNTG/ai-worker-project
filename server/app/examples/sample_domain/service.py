"""
Sample Domain Service

비즈니스 로직을 조율하는 서비스 계층입니다.
Repository, Calculator, Formatter를 사용하여 전체 흐름을 제어합니다.
"""

from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.shared.base import BaseService
from server.app.shared.types import ServiceResult
from server.app.shared.exceptions import ValidationException, NotFoundException
from server.app.examples.sample_domain.schemas import (
    SampleAnalysisRequest,
    SampleAnalysisResponse,
    SampleRepositoryInput,
    SampleCalculatorInput,
    SampleFormatterInput,
    SimpleRepositoryInput,
    SimpleCalculatorInput,
    SimpleFormatterInput,
    SampleListResponse,
)
from server.app.examples.sample_domain.repositories import (
    SampleDataRepository,
    SimpleMockDataRepository,
)
from server.app.examples.sample_domain.calculators import (
    SampleAnalysisCalculator,
    SimpleMockCalculator,
)
from server.app.examples.sample_domain.formatters import (
    SampleResponseFormatter,
    SimpleMockFormatter,
)


class SampleDomainService(BaseService[SampleAnalysisRequest, SampleAnalysisResponse]):
    """
    샘플 도메인 서비스

    분석 요청을 받아서 다음 단계를 수행합니다:
        1. 데이터 조회 (Repository)
        2. 분석 수행 (Calculator)
        3. 응답 포맷팅 (Formatter)

    이 클래스는 새로운 도메인 서비스를 만들 때 참고할 수 있는 템플릿입니다.

    사용 예시:
        # FastAPI 엔드포인트에서
        service = SampleDomainService(db)
        result = await service.execute(request)

        if result.success:
            return result.data
        else:
            raise HTTPException(status_code=400, detail=result.error)
    """

    def __init__(self, db: AsyncSession):
        """
        Args:
            db: 데이터베이스 세션
        """
        super().__init__(db)

        # 의존성 주입: Repository, Calculator, Formatter 인스턴스 생성
        self.data_repository = SampleDataRepository(db)
        self.analysis_calculator = SampleAnalysisCalculator()
        self.response_formatter = SampleResponseFormatter()

    async def execute(
        self,
        request: SampleAnalysisRequest,
        user_id: Optional[int] = None,
        **kwargs
    ) -> ServiceResult[SampleAnalysisResponse]:
        """
        분석 요청을 실행합니다.

        이것이 Template Method의 구현입니다.
        전체 비즈니스 로직의 흐름을 정의합니다.

        Args:
            request: 분석 요청 데이터
            user_id: 요청한 사용자 ID (선택)
            **kwargs: 추가 컨텍스트

        Returns:
            ServiceResult[SampleAnalysisResponse]: 실행 결과
        """
        try:
            # 실행 전 훅
            await self.before_execute(request)

            # 1. 요청 검증
            await self.validate_request(request)

            # 2. 권한 확인 (필요 시)
            await self.check_permissions(request, user_id=user_id)

            # 3. 데이터 조회 (Repository)
            data = await self._fetch_data(request)

            # 4. 분석 수행 (Calculator)
            analysis_result = await self._perform_analysis(request, data)

            # 5. 응답 포맷팅 (Formatter)
            response = await self._format_response(request, analysis_result)

            # 6. 성공 결과 생성
            result = ServiceResult.ok(
                response,
                metadata={
                    "user_id": user_id,
                    "analysis_type": request.analysis_type,
                }
            )

            # 실행 후 훅
            await self.after_execute(request, result)

            return result

        except (ValidationException, NotFoundException) as e:
            # 예상된 예외는 그대로 전달
            return await self.handle_error(e, request)
        except Exception as e:
            # 예상치 못한 예외 처리
            return await self.handle_error(e, request)

    async def _fetch_data(self, request: SampleAnalysisRequest) -> dict:
        """
        데이터를 조회합니다 (Repository 사용).

        Args:
            request: 분석 요청

        Returns:
            dict: 조회된 데이터

        TODO: 실제 구현 시
            - 여러 Provider 조합 가능
            - 캐시 확인
            - 병렬 데이터 조회
        """
        # Provider 입력 생성
        provider_input = SampleProviderInput(
            data_id=request.data_id
        )

        # Provider 호출
        provider_output = await self.data_repository.provide(provider_input)

        # dict로 변환 (Calculator에 전달하기 위해)
        return {
            "id": provider_output.id,
            "name": provider_output.name,
            "value": provider_output.value,
            "score": provider_output.score,
        }

    async def _perform_analysis(
        self,
        request: SampleAnalysisRequest,
        data: dict
    ) -> dict:
        """
        분석을 수행합니다 (Calculator 사용).

        Args:
            request: 분석 요청
            data: 조회된 데이터

        Returns:
            dict: 분석 결과

        TODO: 실제 구현 시
            - 여러 Calculator 조합 가능
            - 조건부 분석
            - 병렬 계산
        """
        # Calculator 입력 생성
        calculator_input = SampleCalculatorInput(
            value=data["value"],
            score=data.get("score"),
            analysis_type=request.analysis_type,
            threshold=request.threshold,
        )

        # Calculator 호출
        calculator_output = await self.analysis_calculator.calculate(calculator_input)

        # dict로 변환 (Formatter에 전달하기 위해)
        return {
            "metrics": calculator_output.metrics,
            "insights": calculator_output.insights,
        }

    async def _format_response(
        self,
        request: SampleAnalysisRequest,
        analysis_result: dict
    ) -> SampleAnalysisResponse:
        """
        응답을 포맷팅합니다 (Formatter 사용).

        Args:
            request: 분석 요청
            analysis_result: 분석 결과

        Returns:
            SampleAnalysisResponse: API 응답

        TODO: 실제 구현 시
            - 조건부 포맷팅 (상세/요약)
            - 다국어 지원
            - 사용자 정의 포맷
        """
        # Formatter 입력 생성
        formatter_input = SampleFormatterInput(
            data_id=request.data_id,
            analysis_type=request.analysis_type,
            metrics=analysis_result["metrics"],
            insights=analysis_result["insights"],
        )

        # Formatter 호출
        response = await self.response_formatter.format(formatter_input)

        return response

    async def validate_request(self, request: SampleAnalysisRequest) -> None:
        """
        요청 데이터의 유효성을 검증합니다.

        Args:
            request: 검증할 요청

        Raises:
            ValidationException: 유효성 검증 실패 시

        TODO: 실제 검증 로직 구현
        """
        # 기본 검증은 Pydantic이 수행
        # 추가 비즈니스 규칙 검증
        if request.data_id <= 0:
            raise ValidationException("data_id must be positive")

        # 분석 유형 검증
        valid_types = ["statistical", "trend", "anomaly"]
        if request.analysis_type not in valid_types:
            raise ValidationException(
                f"Invalid analysis_type. Must be one of: {valid_types}"
            )

    async def check_permissions(
        self,
        request: SampleAnalysisRequest,
        user_id: Optional[int] = None,
        **context
    ) -> None:
        """
        사용자 권한을 확인합니다.

        Args:
            request: 요청 데이터
            user_id: 사용자 ID
            **context: 추가 컨텍스트

        Raises:
            ForbiddenException: 권한이 없을 경우

        TODO: 실제 권한 확인 로직 구현
            - 리소스 소유권 확인
            - 역할 기반 권한 확인
            - 구독 플랜 확인
        """
        # 예시: 인증된 사용자만 접근 가능
        # if not user_id:
        #     raise UnauthorizedException("Authentication required")

        # 예시: 데이터 소유권 확인
        # data_owner = await self._get_data_owner(request.data_id)
        # if data_owner != user_id:
        #     raise ForbiddenException("You don't have permission to access this data")

        pass

    async def before_execute(self, request: SampleAnalysisRequest) -> None:
        """
        실행 전 훅: 로깅, 메트릭 수집 등

        TODO: 필요한 전처리 로직 추가
            - 로깅
            - 메트릭 수집
            - 캐시 확인
        """
        # 예시: 로깅
        # logger.info(
        #     f"Starting analysis for data_id={request.data_id}, "
        #     f"type={request.analysis_type}"
        # )
        pass

    async def after_execute(
        self,
        request: SampleAnalysisRequest,
        result: ServiceResult[SampleAnalysisResponse]
    ) -> None:
        """
        실행 후 훅: 로깅, 이벤트 발행 등

        TODO: 필요한 후처리 로직 추가
            - 성공/실패 로깅
            - 이벤트 발행
            - 캐시 업데이트
            - 알림 전송
        """
        # 예시: 로깅
        # if result.success:
        #     logger.info(f"Analysis completed successfully for data_id={request.data_id}")
        # else:
        #     logger.error(f"Analysis failed: {result.error}")

        # 예시: 이벤트 발행
        # if result.success:
        #     await event_bus.publish("analysis.completed", {
        #         "data_id": request.data_id,
        #         "analysis_type": request.analysis_type,
        #     })
        pass

    async def handle_error(
        self,
        error: Exception,
        request: SampleAnalysisRequest
    ) -> ServiceResult[SampleAnalysisResponse]:
        """
        에러를 처리하고 적절한 결과를 반환합니다.

        Args:
            error: 발생한 예외
            request: 요청 데이터

        Returns:
            ServiceResult: 에러 결과

        TODO: 에러 타입별 처리 로직 구현
        """
        # 예시: 에러 로깅
        # logger.error(
        #     f"Error in SampleDomainService: {str(error)}",
        #     exc_info=True,
        #     extra={"data_id": request.data_id}
        # )

        # 에러 타입에 따라 다른 메시지 반환
        error_message = str(error)

        return ServiceResult.fail(
            error_message,
            metadata={
                "error_type": type(error).__name__,
                "data_id": request.data_id,
            }
        )


# ====================
# Simple GET Service (교과서 예제)
# ====================


class SimpleGetService(BaseService[None, SampleListResponse]):
    """
    간단한 GET 서비스

    GET /api/v1/sample 엔드포인트를 위한 교과서 예제입니다.
    Router → Service → Provider → Calculator → Formatter 흐름을 보여줍니다.

    이 서비스는 다음을 보여줍니다:
        1. BaseService 상속 및 템플릿 메서드 패턴
        2. Provider, Calculator, Formatter 조합
        3. 각 레이어의 책임 분리
        4. 에러 핸들링
        5. 로깅 포인트

    사용 예시:
        # FastAPI 엔드포인트에서
        service = SimpleGetService(db)
        result = await service.execute(None)

        if result.success:
            return result.data
        else:
            raise HTTPException(status_code=500, detail=result.error)
    """

    def __init__(self, db: AsyncSession):
        """
        Args:
            db: 데이터베이스 세션 (이 예제에서는 사용하지 않음)
        """
        super().__init__(db)

        # 의존성 주입: Provider, Calculator, Formatter 인스턴스 생성
        self.provider = SimpleMockDataProvider(db)
        self.calculator = SimpleMockCalculator()
        self.formatter = SimpleMockFormatter()

    async def execute(
        self,
        request: None,
        user_id: Optional[int] = None,
        **kwargs
    ) -> ServiceResult[SampleListResponse]:
        """
        GET 요청을 실행합니다.

        Args:
            request: None (GET 요청이므로 request body 없음)
            user_id: 요청한 사용자 ID (선택)
            **kwargs: 추가 컨텍스트

        Returns:
            ServiceResult[SampleListResponse]: 실행 결과

        Flow:
            1. Provider: Mock 데이터 생성
            2. Calculator: 데이터 필터링 및 가공
            3. Formatter: API 응답 형식으로 변환
        """
        try:
            # 1. Provider: 데이터 조회 (여기서는 mock 데이터)
            provider_input = SimpleProviderInput()
            provider_output = await self.provider.provide(provider_input)

            # 2. Calculator: 데이터 가공
            calculator_input = SimpleCalculatorInput(items=provider_output.items)
            calculator_output = await self.calculator.calculate(calculator_input)

            # 3. Formatter: API 응답 형식으로 변환
            formatter_input = SimpleFormatterInput(
                processed_items=calculator_output.processed_items,
                total_count=calculator_output.total_count
            )
            response = await self.formatter.format(formatter_input)

            # 4. 성공 결과 반환
            return ServiceResult.success(
                response,
                metadata={
                    "total_count": calculator_output.total_count,
                }
            )

        except Exception as error:
            # 에러 처리
            return await self.handle_error(error, request)

    async def validate_request(self, request: None) -> None:
        """
        요청 검증

        GET 요청이므로 검증할 것이 없습니다.
        """
        pass

    async def check_permissions(
        self,
        request: None,
        user_id: Optional[int] = None
    ) -> None:
        """
        권한 확인

        이 예제에서는 권한 확인이 필요 없습니다.
        실제 구현 시 여기에 권한 로직을 추가할 수 있습니다.
        """
        pass

    async def before_execute(self, request: None) -> None:
        """
        실행 전 훅

        TODO: 필요한 전처리 로직 추가
            - 로깅
            - 캐시 확인
            - 요청 변환
        """
        # 예시: 로깅
        # logger.info("Starting SimpleGetService execution")
        pass

    async def after_execute(
        self,
        request: None,
        result: ServiceResult[SampleListResponse]
    ) -> None:
        """
        실행 후 훅

        TODO: 필요한 후처리 로직 추가
            - 로깅
            - 캐시 업데이트
            - 이벤트 발행
        """
        # 예시: 로깅
        # if result.success:
        #     logger.info(f"SimpleGetService completed successfully: {result.data.total_count} items")
        # else:
        #     logger.error(f"SimpleGetService failed: {result.error}")
        pass

    async def handle_error(
        self,
        error: Exception,
        request: None
    ) -> ServiceResult[SampleListResponse]:
        """
        에러 처리

        Args:
            error: 발생한 예외
            request: 요청 데이터 (None)

        Returns:
            ServiceResult: 에러 결과
        """
        # 예시: 에러 로깅
        # logger.error(
        #     f"Error in SimpleGetService: {str(error)}",
        #     exc_info=True
        # )

        error_message = f"샘플 데이터 조회 중 오류가 발생했습니다: {str(error)}"

        return ServiceResult.fail(
            error_message,
            metadata={
                "error_type": type(error).__name__,
            }
        )
