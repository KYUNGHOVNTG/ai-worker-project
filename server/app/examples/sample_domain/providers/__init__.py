"""
Sample Domain Providers

데이터 제공자 구현체입니다.
BaseProvider를 상속받아 데이터 소스로부터 데이터를 가져옵니다.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.shared.base import BaseProvider
from server.app.shared.exceptions import NotFoundException, ProviderException
from server.app.examples.sample_domain.models import SampleDataModel
from server.app.examples.sample_domain.schemas import (
    SampleProviderInput,
    SampleProviderOutput,
)


class SampleDataProvider(BaseProvider[SampleProviderInput, SampleProviderOutput]):
    """
    샘플 데이터 제공자

    데이터베이스에서 샘플 데이터를 조회합니다.

    책임:
        - 데이터베이스 쿼리 실행
        - 데이터 존재 여부 확인
        - 조회한 데이터를 DTO로 변환

    사용 예시:
        provider = SampleDataProvider(db)
        input_data = SampleProviderInput(data_id=1)
        result = await provider.provide(input_data)
    """

    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def provide(self, input_data: SampleProviderInput) -> SampleProviderOutput:
        """
        데이터를 조회하고 반환합니다.

        Args:
            input_data: 조회할 데이터의 ID를 포함한 입력

        Returns:
            SampleProviderOutput: 조회된 데이터

        Raises:
            NotFoundException: 데이터를 찾을 수 없는 경우
            ProviderException: 데이터베이스 오류 발생 시

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
            # return SampleProviderOutput(
            #     id=data.id,
            #     name=data.name,
            #     value=data.value,
            #     score=data.score,
            # )

            # 스텁: 더미 데이터 반환
            return SampleProviderOutput(
                id=input_data.data_id,
                name=f"Sample Data {input_data.data_id}",
                value=42.5,
                score=0.85,
            )

        except NotFoundException:
            raise
        except Exception as e:
            raise ProviderException(
                f"Failed to provide data: {str(e)}",
                details={"data_id": input_data.data_id}
            )

    async def validate_input(self, input_data: SampleProviderInput) -> None:
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
    ) -> list[SampleProviderOutput]:
        """
        여러 데이터를 한 번에 조회합니다.

        Args:
            data_ids: 조회할 데이터 ID 목록

        Returns:
            list[SampleProviderOutput]: 조회된 데이터 목록

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
        #     SampleProviderOutput(
        #         id=data.id,
        #         name=data.name,
        #         value=data.value,
        #         score=data.score,
        #     )
        #     for data in data_list
        # ]

        # 스텁
        return [
            await self.provide(SampleProviderInput(data_id=data_id))
            for data_id in data_ids
        ]


class SampleAggregationProvider(BaseProvider[SampleProviderInput, dict]):
    """
    샘플 집계 데이터 제공자

    통계 데이터나 집계 결과를 제공합니다.

    TODO: 실제 집계 쿼리 구현
        - COUNT, SUM, AVG 등의 집계 함수 사용
        - GROUP BY를 사용한 그룹별 집계
        - 성능을 위한 인덱스 활용
    """

    async def provide(self, input_data: SampleProviderInput) -> dict:
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
