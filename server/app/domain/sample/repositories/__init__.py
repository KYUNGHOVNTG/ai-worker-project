"""
Sample Domain Repositories

데이터베이스 CRUD 접근 계층입니다.
"""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.sample.models import SampleDataModel
from server.app.domain.sample.schemas import SampleDataCreate, SampleDataUpdate
from server.app.shared.exceptions import NotFoundException, RepositoryException


class SampleDataRepository:
    """샘플 데이터 CRUD Repository"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_all(self) -> list[SampleDataModel]:
        """전체 목록 조회"""
        try:
            result = await self.db.execute(select(SampleDataModel))
            return list(result.scalars().all())
        except Exception as e:
            raise RepositoryException(f"Failed to fetch sample data list: {str(e)}")

    async def get_by_id(self, item_id: int) -> SampleDataModel:
        """ID로 단건 조회"""
        try:
            result = await self.db.execute(
                select(SampleDataModel).where(SampleDataModel.id == item_id)
            )
            item = result.scalar_one_or_none()
            if item is None:
                raise NotFoundException(f"SampleData with id {item_id} not found")
            return item
        except NotFoundException:
            raise
        except Exception as e:
            raise RepositoryException(f"Failed to fetch sample data: {str(e)}")

    async def create(self, data: SampleDataCreate) -> SampleDataModel:
        """신규 생성"""
        try:
            item = SampleDataModel(
                name=data.name,
                description=data.description,
                value=data.value,
                score=data.score,
            )
            self.db.add(item)
            await self.db.commit()
            await self.db.refresh(item)
            return item
        except Exception as e:
            await self.db.rollback()
            raise RepositoryException(f"Failed to create sample data: {str(e)}")

    async def update(self, item_id: int, data: SampleDataUpdate) -> SampleDataModel:
        """수정"""
        item = await self.get_by_id(item_id)
        try:
            update_data = data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(item, field, value)
            await self.db.commit()
            await self.db.refresh(item)
            return item
        except Exception as e:
            await self.db.rollback()
            raise RepositoryException(f"Failed to update sample data: {str(e)}")

    async def delete(self, item_id: int) -> None:
        """삭제"""
        item = await self.get_by_id(item_id)
        try:
            await self.db.delete(item)
            await self.db.commit()
        except Exception as e:
            await self.db.rollback()
            raise RepositoryException(f"Failed to delete sample data: {str(e)}")
