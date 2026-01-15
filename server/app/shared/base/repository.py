"""
BaseRepository: 데이터 접근 계층 추상 클래스

Repository Pattern을 구현합니다.
외부 데이터 소스(DB, API, 파일 등)로부터 데이터를 가져오는 책임을 가집니다.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Any

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.shared.types import RepositoryInput, RepositoryOutput

# 제네릭 타입 변수
TInput = TypeVar("TInput", bound=RepositoryInput)
TOutput = TypeVar("TOutput", bound=RepositoryOutput)


class BaseRepository(ABC, Generic[TInput, TOutput]):
    """
    Repository 추상 베이스 클래스

    모든 Repository는 이 클래스를 상속받아 구현해야 합니다.

    책임:
        - 외부 데이터 소스로부터 데이터를 가져옴
        - 데이터베이스 쿼리 실행
        - 외부 API 호출
        - 파일 시스템 접근
        - 캐시 조회

    사용 예시:
        class UserDataRepository(BaseRepository[UserRepositoryInput, UserRepositoryOutput]):
            async def provide(self, input_data: UserRepositoryInput) -> UserRepositoryOutput:
                # 데이터베이스에서 사용자 정보 조회
                user = await self.db.execute(...)
                return UserRepositoryOutput(user=user)
    """

    def __init__(self, db: AsyncSession):
        """
        Args:
            db: 데이터베이스 세션
        """
        self.db = db

    @abstractmethod
    async def provide(self, input_data: TInput) -> TOutput:
        """
        데이터를 제공합니다.

        이 메서드를 구현할 때:
            1. input_data에서 필요한 파라미터를 추출
            2. 데이터 소스(DB, API 등)에서 데이터 조회
            3. 조회한 데이터를 TOutput 형태로 변환하여 반환

        Args:
            input_data: Provider 입력 데이터

        Returns:
            TOutput: Provider 출력 데이터

        Raises:
            RepositoryException: 데이터 제공 중 오류 발생 시

        TODO: 구현 시 다음 사항을 고려하세요
            - 데이터베이스 쿼리 최적화 (N+1 문제, eager loading)
            - 외부 API 호출 시 타임아웃 처리
            - 에러 핸들링 및 로깅
            - 캐싱 전략 적용 여부
        """
        raise NotImplementedError("Subclass must implement 'provide' method")

    async def validate_input(self, input_data: TInput) -> None:
        """
        입력 데이터의 유효성을 검증합니다.

        기본 구현은 아무것도 하지 않습니다.
        필요한 경우 서브클래스에서 오버라이드하세요.

        Args:
            input_data: 검증할 입력 데이터

        Raises:
            ValidationException: 유효성 검증 실패 시

        TODO: 구현 예시
            - 필수 필드 존재 여부 확인
            - 데이터 형식 검증
            - 비즈니스 규칙 검증
        """
        pass

    async def prepare(self) -> None:
        """
        Repository 사용 전 준비 작업을 수행합니다.

        연결 설정, 캐시 워밍업 등의 작업을 수행할 수 있습니다.
        기본 구현은 아무것도 하지 않습니다.

        TODO: 구현 예시
            - 데이터베이스 연결 확인
            - 외부 API 헬스체크
            - 캐시 초기화
        """
        pass

    async def cleanup(self) -> None:
        """
        Repository 사용 후 정리 작업을 수행합니다.

        리소스 해제, 연결 종료 등의 작업을 수행할 수 있습니다.
        기본 구현은 아무것도 하지 않습니다.

        TODO: 구현 예시
            - 열린 파일 핸들 닫기
            - 임시 데이터 정리
            - 연결 풀 반환
        """
        pass


class DatabaseRepository(BaseRepository[TInput, TOutput], ABC):
    """
    데이터베이스 Repository 베이스 클래스

    데이터베이스 특화 Repository를 위한 추가 유틸리티를 제공합니다.
    """

    async def execute_query(self, query: Any) -> Any:
        """
        데이터베이스 쿼리를 실행합니다.

        Args:
            query: SQLAlchemy 쿼리 객체

        Returns:
            Any: 쿼리 실행 결과

        TODO: 구현 예시
            result = await self.db.execute(query)
            return result.scalars().all()
        """
        raise NotImplementedError("Subclass must implement 'execute_query' method")


class APIRepository(BaseRepository[TInput, TOutput], ABC):
    """
    외부 API Repository 베이스 클래스

    외부 API 호출을 위한 추가 유틸리티를 제공합니다.
    """

    def __init__(self, db: AsyncSession, base_url: str, timeout: int = 30):
        """
        Args:
            db: 데이터베이스 세션
            base_url: API 기본 URL
            timeout: 요청 타임아웃 (초)
        """
        super().__init__(db)
        self.base_url = base_url
        self.timeout = timeout

    async def make_request(self, endpoint: str, method: str = "GET", **kwargs: Any) -> Any:
        """
        외부 API에 HTTP 요청을 보냅니다.

        Args:
            endpoint: API 엔드포인트
            method: HTTP 메서드
            **kwargs: 추가 요청 파라미터

        Returns:
            Any: API 응답 데이터

        TODO: 구현 예시
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.request(
                    method=method,
                    url=f"{self.base_url}/{endpoint}",
                    timeout=self.timeout,
                    **kwargs
                )
                response.raise_for_status()
                return response.json()
        """
        raise NotImplementedError("Subclass must implement 'make_request' method")
