"""
Sample Domain Service

샘플 데이터 CRUD 비즈니스 로직을 조율하는 서비스 계층입니다.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.sample.schemas import (
    SampleDataCreate,
    SampleDataResponse,
    SampleDataUpdate,
)
from server.app.domain.sample.repositories import SampleDataRepository
from server.app.domain.sample.formatters import SampleDataFormatter, SampleDataListFormatter
from server.app.shared.exceptions import NotFoundException


class SampleService:
    """
    샘플 데이터 CRUD 서비스

    Router에서 호출되며, Repository와 Formatter를 조합하여 비즈니스 로직을 처리합니다.
    """

    def __init__(self, db: AsyncSession) -> None:
        self.repository = SampleDataRepository(db)
        self.formatter = SampleDataFormatter()
        self.list_formatter = SampleDataListFormatter()

    async def get_all(self) -> list[SampleDataResponse]:
        """전체 목록 조회"""
        items = await self.repository.get_all()
        return await self.list_formatter.format(items)

    async def get_by_id(self, item_id: int) -> SampleDataResponse:
        """ID로 단건 조회. 없으면 NotFoundException 발생."""
        item = await self.repository.get_by_id(item_id)
        return await self.formatter.format(item)

    async def create(self, data: SampleDataCreate) -> SampleDataResponse:
        """신규 생성"""
        item = await self.repository.create(data)
        return await self.formatter.format(item)

    async def update(self, item_id: int, data: SampleDataUpdate) -> SampleDataResponse:
        """수정. 없으면 NotFoundException 발생."""
        item = await self.repository.update(item_id, data)
        return await self.formatter.format(item)

    async def delete(self, item_id: int) -> None:
        """삭제. 없으면 NotFoundException 발생."""
        await self.repository.delete(item_id)
