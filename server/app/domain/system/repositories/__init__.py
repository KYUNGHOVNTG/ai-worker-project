"""
System 도메인 Repositories
데이터 조회 로직
"""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.system.models import ConnectionTest
from server.app.shared.base.repository import BaseRepository


class ConnectionTestRepository(BaseRepository[None, Optional[ConnectionTest]]):
    """
    연결 테스트 데이터 조회
    """

    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def provide(self, input_data: None = None) -> Optional[ConnectionTest]:
        """
        가장 최근의 연결 테스트 데이터 조회

        Returns:
            가장 최근의 ConnectionTest 레코드 또는 None
        """
        result = await self.db.execute(
            select(ConnectionTest).order_by(ConnectionTest.created_at.desc()).limit(1)
        )
        return result.scalar_one_or_none()
