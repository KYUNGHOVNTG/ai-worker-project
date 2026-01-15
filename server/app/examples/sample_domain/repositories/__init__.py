"""
Sample Domain Repositories

데이터 접근 계층 구현체입니다.
BaseRepository를 상속받아 데이터 소스로부터 데이터를 가져옵니다.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.shared.base import BaseRepository
from server.app.shared.exceptions import NotFoundException, RepositoryException
from server.app.examples.sample_domain.models import SampleDataModel
from server.app.examples.sample_domain.schemas import (
    SampleRepositoryInput,
    SampleRepositoryOutput,
    SimpleRepositoryInput,
    SimpleRepositoryOutput,
)


class SampleDataRepository(BaseRepository[SampleRepositoryInput, SampleRepositoryOutput]):
    """
    샘플 데이터 제공자

    데이터베이스에서 샘플 데이터를 조회합니다.

    책임:
        - 데이터베이스 쿼리 실행
        - 데이터 존재 여부 확인
        - 조회한 데이터를 DTO로 변환

    사용 예시:
        provider = SampleDataRepository(db)
        input_data = SampleRepositoryInput(data_id=1)
        result = await provider.provide(input_data)
    """

    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def provide(self, input_data: SampleRepositoryInput) -> SampleRepositoryOutput:
        """
        데이터를 조회하고 반환합니다.

        Args:
            input_data: 조회할 데이터의 ID를 포함한 입력

        Returns:
            SampleRepositoryOutput: 조회된 데이터

        Raises:
            NotFoundException: 데이터를 찾을 수 없는 경우
            RepositoryException: 데이터베이스 오류 발생 시

        TODO: 실제 구현 예시
        """
        try:
            # 1. 입력 데이터 검증
            await self.validate_input(input_data)

            # 2. 데이터베이스 쿼리 실행
            # TODO: 실제 쿼리 구현
            # stmt = select(SampleDataModel).where(
            #     SampleDataModel.id == input_data.data_id
            # )
            # result = await self.db.execute(stmt)
            # data = result.scalar_one_or_none()

            # 3. 데이터 존재 여부 확인
            # if not data:
            #     raise NotFoundException(
            #         f"Data with id {input_data.data_id} not found"
            #     )

            # 4. DTO로 변환하여 반환
            # return SampleRepositoryOutput(
            #     id=data.id,
            #     name=data.name,
            #     value=data.value,
            #     score=data.score,
            # )

            # 스텁: 더미 데이터 반환
            return SampleRepositoryOutput(
                id=input_data.data_id,
                name=f"Sample Data {input_data.data_id}",
                value=42.5,
                score=0.85,
            )

        except NotFoundException:
            raise
        except Exception as e:
            raise RepositoryException(
                f"Failed to provide data: {str(e)}",
                details={"data_id": input_data.data_id}
            )

    async def validate_input(self, input_data: SampleRepositoryInput) -> None:
        """
        입력 데이터의 유효성을 검증합니다.

        Args:
            input_data: 검증할 입력 데이터

        Raises:
            ValidationException: 유효성 검증 실패 시
        """
        # TODO: 필요한 검증 로직 추가
        # - data_id가 양수인지 확인
        # - 권한이 있는 데이터인지 확인
        pass

    async def get_multiple(
        self,
        data_ids: list[int]
    ) -> list[SampleRepositoryOutput]:
        """
        여러 데이터를 한 번에 조회합니다.

        Args:
            data_ids: 조회할 데이터 ID 목록

        Returns:
            list[SampleRepositoryOutput]: 조회된 데이터 목록

        TODO: 실제 구현 예시
            - IN 쿼리 사용하여 한 번에 조회
            - N+1 문제 방지
        """
        # TODO: 실제 구현
        # stmt = select(SampleDataModel).where(
        #     SampleDataModel.id.in_(data_ids)
        # )
        # result = await self.db.execute(stmt)
        # data_list = result.scalars().all()
        # return [
        #     SampleRepositoryOutput(
        #         id=data.id,
        #         name=data.name,
        #         value=data.value,
        #         score=data.score,
        #     )
        #     for data in data_list
        # ]

        # 스텁
        return [
            await self.provide(SampleRepositoryInput(data_id=data_id))
            for data_id in data_ids
        ]


class SampleAggregationRepository(BaseRepository[SampleRepositoryInput, dict]):
    """
    샘플 집계 데이터 제공자

    통계 데이터나 집계 결과를 제공합니다.

    TODO: 실제 집계 쿼리 구현
        - COUNT, SUM, AVG 등의 집계 함수 사용
        - GROUP BY를 사용한 그룹별 집계
        - 성능을 위한 인덱스 활용
    """

    async def provide(self, input_data: SampleRepositoryInput) -> dict:
        """
        집계 데이터를 제공합니다.

        Returns:
            dict: 집계 결과
        """
        # TODO: 실제 집계 쿼리 구현
        # from sqlalchemy import func
        # stmt = select(
        #     func.count(SampleDataModel.id).label('count'),
        #     func.avg(SampleDataModel.value).label('avg_value'),
        #     func.min(SampleDataModel.value).label('min_value'),
        #     func.max(SampleDataModel.value).label('max_value'),
        # )
        # result = await self.db.execute(stmt)
        # row = result.one()
        # return {
        #     'count': row.count,
        #     'avg_value': row.avg_value,
        #     'min_value': row.min_value,
        #     'max_value': row.max_value,
        # }

        # 스텁
        return {
            "count": 100,
            "avg_value": 42.5,
            "min_value": 10.0,
            "max_value": 95.0,
        }


# ====================
# Simple Mock Data Repository (교과서 예제)
# ====================


class SimpleMockDataRepository(BaseRepository[SimpleRepositoryInput, SimpleRepositoryOutput]):
    """
    간단한 Mock 데이터 제공자

    GET /api/v1/sample 엔드포인트를 위한 교과서 예제입니다.
    실제 비즈니스 로직 없이 고정된 mock 데이터를 반환합니다.

    책임:
        - Mock 데이터 생성
        - 데이터 반환 (DB 조회 없음)

    이 Repository는 다음을 보여줍니다:
        - Repository의 기본 구조
        - BaseRepository 상속 방법
        - 입력/출력 DTO 사용법
    """

    def __init__(self, db: AsyncSession | None = None):
        """
        Mock Repository는 DB가 필요 없을 수도 있습니다.
        하지만 인터페이스 일관성을 위해 받을 수 있습니다.
        """
        super().__init__(db)

    async def provide(self, input_data: SimpleRepositoryInput) -> SimpleRepositoryOutput:
        """
        Mock 데이터를 제공합니다.

        Args:
            input_data: 입력 (현재는 사용하지 않음)

        Returns:
            SimpleRepositoryOutput: Mock 데이터 리스트

        NOTE: 실제 구현에서는 DB 조회, API 호출, 파일 읽기 등을 수행합니다.
        """
        # Mock 데이터 생성
        mock_items = [
            {
                "id": 1,
                "name": "샘플 아이템 1",
                "description": "첫 번째 샘플 데이터입니다",
                "category": "example",
                "status": "active",
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 2,
                "name": "샘플 아이템 2",
                "description": "두 번째 샘플 데이터입니다",
                "category": "example",
                "status": "active",
                "created_at": "2024-01-02T00:00:00Z"
            },
            {
                "id": 3,
                "name": "샘플 아이템 3",
                "description": "세 번째 샘플 데이터입니다",
                "category": "demo",
                "status": "inactive",
                "created_at": "2024-01-03T00:00:00Z"
            }
        ]

        return SimpleRepositoryOutput(items=mock_items)
