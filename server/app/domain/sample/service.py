"""
Sample Domain Service

샘플 데이터 CRUD 비즈니스 로직을 조율하는 서비스 계층입니다.
BaseService를 상속하고, Repository·Calculator·Formatter를 조합합니다.
"""

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.sample.calculators import SampleScoreCalculator
from server.app.domain.sample.formatters import SampleDataFormatter, SampleDataListFormatter
from server.app.domain.sample.repositories import SampleDataRepository
from server.app.domain.sample.schemas import (
    SampleCalculatorInput,
    SampleDataCreate,
    SampleDataResponse,
    SampleDataUpdate,
)
from server.app.shared.base.service import BaseService
from server.app.shared.types import ServiceResult


class SampleService(BaseService[SampleDataCreate, SampleDataResponse]):
    """
    샘플 데이터 CRUD 서비스

    BaseService를 상속하며, Repository·Calculator·Formatter를 조합하여
    비즈니스 로직을 오케스트레이션합니다.
    """

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)
        self.repository = SampleDataRepository(db)
        self.calculator = SampleScoreCalculator()
        self.formatter = SampleDataFormatter()
        self.list_formatter = SampleDataListFormatter()

    async def execute(
        self, request: SampleDataCreate, **kwargs: Any
    ) -> ServiceResult[SampleDataResponse]:
        """기본 실행: 데이터 생성"""
        return await self.create(request)

    async def get_all(self) -> ServiceResult[list[SampleDataResponse]]:
        """전체 목록 조회"""
        items = await self.repository.get_all()
        formatted = await self.list_formatter.format(items)
        return ServiceResult.ok(formatted)

    async def get_by_id(self, item_id: int) -> ServiceResult[SampleDataResponse]:
        """ID로 단건 조회. 없으면 NotFoundException 발생."""
        item = await self.repository.get_by_id(item_id)

        # Calculator 연동: 점수 분석
        analysis = await self.calculator.calculate(
            SampleCalculatorInput(value=item.value, score=item.score)
        )

        formatted = await self.formatter.format(item)
        return ServiceResult.ok(formatted, metadata={"analysis": analysis.model_dump()})

    async def create(self, data: SampleDataCreate) -> ServiceResult[SampleDataResponse]:
        """신규 생성"""
        item = await self.repository.create(data)
        formatted = await self.formatter.format(item)
        return ServiceResult.ok(formatted)

    async def update(
        self, item_id: int, data: SampleDataUpdate
    ) -> ServiceResult[SampleDataResponse]:
        """수정. 없으면 NotFoundException 발생."""
        item = await self.repository.update(item_id, data)
        formatted = await self.formatter.format(item)
        return ServiceResult.ok(formatted)

    async def delete(self, item_id: int) -> ServiceResult[bool]:
        """삭제. 없으면 NotFoundException 발생."""
        await self.repository.delete(item_id)
        return ServiceResult.ok(True)
