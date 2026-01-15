"""
BaseService: 서비스 레이어 추상 클래스

Facade Pattern을 통해 Provider, Calculator, Formatter를 조율합니다.
Template Method Pattern을 사용하여 비즈니스 로직의 흐름을 정의합니다.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.shared.base.calculator import BaseCalculator
from server.app.shared.base.formatter import BaseFormatter
from server.app.shared.base.repository import BaseRepository as BaseProvider
from server.app.shared.types import ServiceResult

# 제네릭 타입 변수
TRequest = TypeVar("TRequest")  # API 요청 데이터
TResponse = TypeVar("TResponse")  # API 응답 데이터


class BaseService(ABC, Generic[TRequest, TResponse]):
    """
    Service 추상 베이스 클래스

    모든 Service는 이 클래스를 상속받아 구현해야 합니다.

    책임:
        - 비즈니스 로직의 흐름 제어 (orchestration)
        - Provider, Calculator, Formatter 조율
        - 트랜잭션 관리
        - 에러 처리 및 로깅
        - 권한 검증

    패턴:
        - Facade Pattern: 복잡한 하위 시스템을 단순한 인터페이스로 제공
        - Template Method: 비즈니스 로직의 뼈대를 정의하고 세부 구현은 서브클래스에 위임

    일반적인 흐름:
        1. 요청 데이터 검증 (validate_request)
        2. 권한 확인 (check_permissions)
        3. 데이터 조회 (Provider)
        4. 비즈니스 로직 실행 (Calculator)
        5. 응답 포맷팅 (Formatter)
        6. 결과 반환

    사용 예시:
        class UserAnalysisService(BaseService[UserAnalysisRequest, UserAnalysisResponse]):
            def __init__(
                self,
                db: AsyncSession,
                user_provider: UserDataProvider,
                analysis_calculator: UserAnalysisCalculator,
                response_formatter: UserResponseFormatter,
            ):
                super().__init__(db)
                self.user_provider = user_provider
                self.analysis_calculator = analysis_calculator
                self.response_formatter = response_formatter

            async def execute(self, request: UserAnalysisRequest) -> ServiceResult[UserAnalysisResponse]:
                # 1. 데이터 조회
                user_data = await self.user_provider.provide(...)

                # 2. 분석 실행
                analysis_result = await self.analysis_calculator.calculate(...)

                # 3. 응답 포맷팅
                formatted_response = await self.response_formatter.format(...)

                return ServiceResult.ok(formatted_response)
    """

    def __init__(self, db: AsyncSession):
        """
        Args:
            db: 데이터베이스 세션
        """
        self.db = db

    @abstractmethod
    async def execute(self, request: TRequest, **kwargs: Any) -> ServiceResult[TResponse]:
        """
        서비스의 주요 비즈니스 로직을 실행합니다.

        이 메서드는 Template Method로, 전체 비즈니스 로직의 흐름을 정의합니다.

        표준 구현 패턴:
            async def execute(self, request: TRequest) -> ServiceResult[TResponse]:
                try:
                    # 1. 요청 검증
                    await self.validate_request(request)

                    # 2. 권한 확인 (필요 시)
                    await self.check_permissions(request)

                    # 3. 데이터 조회 (Provider)
                    data = await self._fetch_data(request)

                    # 4. 비즈니스 로직 실행 (Calculator)
                    result = await self._process_data(data)

                    # 5. 응답 포맷팅 (Formatter)
                    response = await self._format_response(result)

                    # 6. 성공 결과 반환
                    return ServiceResult.ok(response)

                except Exception as e:
                    # 에러 처리
                    return ServiceResult.fail(str(e))

        Args:
            request: 요청 데이터
            **kwargs: 추가 컨텍스트 정보 (user_id, request_id 등)

        Returns:
            ServiceResult[TResponse]: 실행 결과

        TODO: 구현 시 다음 사항을 고려하세요
            - 트랜잭션 경계 설정 (commit, rollback)
            - 에러 핸들링 및 로깅
            - 성능 모니터링 (실행 시간 측정)
            - 캐싱 전략
        """
        raise NotImplementedError("Subclass must implement 'execute' method")

    async def validate_request(self, request: TRequest) -> None:
        """
        요청 데이터의 유효성을 검증합니다.

        기본 구현은 아무것도 하지 않습니다.
        필요한 경우 서브클래스에서 오버라이드하세요.

        Args:
            request: 검증할 요청 데이터

        Raises:
            ValidationException: 유효성 검증 실패 시

        TODO: 구현 예시
            - 필수 필드 존재 여부
            - 데이터 타입 및 형식
            - 비즈니스 규칙 검증
            - 데이터 범위 확인
        """
        pass

    async def check_permissions(
        self,
        request: TRequest,
        user_id: Optional[int] = None,
        **context: Any
    ) -> None:
        """
        사용자의 권한을 확인합니다.

        기본 구현은 아무것도 하지 않습니다 (권한 검증 안 함).
        필요한 경우 서브클래스에서 오버라이드하세요.

        Args:
            request: 요청 데이터
            user_id: 요청한 사용자 ID
            **context: 추가 컨텍스트 정보

        Raises:
            ForbiddenException: 권한이 없을 경우

        TODO: 구현 예시
            - 리소스 소유권 확인
            - 역할 기반 권한 확인 (RBAC)
            - 속성 기반 권한 확인 (ABAC)
        """
        pass

    async def before_execute(self, request: TRequest) -> None:
        """
        execute 실행 전에 호출되는 훅입니다.

        로깅, 메트릭 수집, 캐시 확인 등에 사용할 수 있습니다.
        기본 구현은 아무것도 하지 않습니다.

        Args:
            request: 요청 데이터

        TODO: 구현 예시
            - 로깅: logger.info(f"Executing service with request: {request}")
            - 메트릭: metrics.increment("service.execute.count")
            - 캐시: cached = await self.cache.get(request.cache_key)
        """
        pass

    async def after_execute(
        self,
        request: TRequest,
        result: ServiceResult[TResponse]
    ) -> None:
        """
        execute 실행 후에 호출되는 훅입니다.

        로깅, 메트릭 기록, 이벤트 발행 등에 사용할 수 있습니다.
        기본 구현은 아무것도 하지 않습니다.

        Args:
            request: 요청 데이터
            result: 실행 결과

        TODO: 구현 예시
            - 로깅: logger.info(f"Service executed successfully")
            - 메트릭: metrics.record("service.execute.duration", duration)
            - 이벤트: await event_bus.publish("user.created", data)
        """
        pass

    async def handle_error(self, error: Exception, request: TRequest) -> ServiceResult[TResponse]:
        """
        에러를 처리하고 적절한 ServiceResult를 반환합니다.

        기본 구현은 에러 메시지를 그대로 반환합니다.
        필요한 경우 서브클래스에서 오버라이드하세요.

        Args:
            error: 발생한 예외
            request: 요청 데이터

        Returns:
            ServiceResult[TResponse]: 에러 결과

        TODO: 구현 예시
            - 에러 타입별 다른 처리
            - 에러 로깅 및 알림
            - 사용자 친화적 에러 메시지 생성
            - 에러 추적 시스템 연동
        """
        return ServiceResult.fail(str(error))


class CRUDService(BaseService[TRequest, TResponse], ABC):
    """
    CRUD 작업 특화 Service

    Create, Read, Update, Delete 작업을 위한 표준 메서드를 제공합니다.
    """

    @abstractmethod
    async def create(self, request: TRequest) -> ServiceResult[TResponse]:
        """
        새로운 리소스를 생성합니다.

        TODO: 구현 시 다음 사항을 고려하세요
            - 중복 데이터 확인
            - 기본값 설정
            - 관련 리소스 생성
            - 생성 이벤트 발행
        """
        raise NotImplementedError("Subclass must implement 'create' method")

    @abstractmethod
    async def read(self, resource_id: int) -> ServiceResult[TResponse]:
        """
        리소스를 조회합니다.

        TODO: 구현 시 다음 사항을 고려하세요
            - 존재 여부 확인
            - 권한 확인
            - 관련 데이터 eager loading
            - 캐시 활용
        """
        raise NotImplementedError("Subclass must implement 'read' method")

    @abstractmethod
    async def update(self, resource_id: int, request: TRequest) -> ServiceResult[TResponse]:
        """
        리소스를 수정합니다.

        TODO: 구현 시 다음 사항을 고려하세요
            - 존재 여부 확인
            - 권한 확인
            - 낙관적 잠금 (optimistic locking)
            - 변경 이력 기록
            - 수정 이벤트 발행
        """
        raise NotImplementedError("Subclass must implement 'update' method")

    @abstractmethod
    async def delete(self, resource_id: int) -> ServiceResult[bool]:
        """
        리소스를 삭제합니다.

        TODO: 구현 시 다음 사항을 고려하세요
            - 존재 여부 확인
            - 권한 확인
            - 연관 데이터 처리 (cascade, restrict)
            - 소프트 삭제 vs 하드 삭제
            - 삭제 이벤트 발행
        """
        raise NotImplementedError("Subclass must implement 'delete' method")

    async def list(
        self,
        skip: int = 0,
        limit: int = 100,
        **filters: Any
    ) -> ServiceResult[list[TResponse]]:
        """
        리소스 목록을 조회합니다.

        TODO: 구현 시 다음 사항을 고려하세요
            - 페이지네이션
            - 정렬
            - 필터링
            - 검색
            - 캐시 활용
        """
        raise NotImplementedError("Subclass must implement 'list' method")


class BatchService(BaseService[TRequest, TResponse], ABC):
    """
    배치 작업 특화 Service

    대량의 데이터를 처리하는 서비스를 위한 유틸리티를 제공합니다.
    """

    async def execute_batch(
        self,
        requests: list[TRequest],
        batch_size: int = 100
    ) -> list[ServiceResult[TResponse]]:
        """
        여러 요청을 배치로 처리합니다.

        Args:
            requests: 요청 리스트
            batch_size: 배치 크기

        Returns:
            list[ServiceResult[TResponse]]: 각 요청의 실행 결과

        TODO: 구현 예시
            results = []
            for i in range(0, len(requests), batch_size):
                batch = requests[i:i+batch_size]
                batch_results = await asyncio.gather(
                    *[self.execute(req) for req in batch]
                )
                results.extend(batch_results)
            return results
        """
        raise NotImplementedError("Subclass must implement 'execute_batch' method")
