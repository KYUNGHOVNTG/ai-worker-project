"""
Auth Domain Repositories

사용자 데이터 접근 계층입니다.
"""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.domain.auth.models import UserModel
from server.app.shared.exceptions import NotFoundException, RepositoryException


class UserRepository:
    """사용자 CRUD Repository"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_email(self, email: str) -> Optional[UserModel]:
        """이메일로 사용자 조회 (없으면 None)"""
        try:
            result = await self.db.execute(
                select(UserModel).where(UserModel.email == email)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            raise RepositoryException(f"Failed to fetch user by email: {str(e)}")

    async def get_by_id(self, user_id: int) -> UserModel:
        """ID로 사용자 조회 (없으면 NotFoundException)"""
        try:
            result = await self.db.execute(
                select(UserModel).where(UserModel.id == user_id)
            )
            user = result.scalar_one_or_none()
            if user is None:
                raise NotFoundException(f"User with id {user_id} not found")
            return user
        except NotFoundException:
            raise
        except Exception as e:
            raise RepositoryException(f"Failed to fetch user: {str(e)}")

    async def create(self, email: str, hashed_password: str) -> UserModel:
        """사용자 생성"""
        try:
            user = UserModel(
                email=email,
                hashed_password=hashed_password,
            )
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)
            return user
        except Exception as e:
            await self.db.rollback()
            raise RepositoryException(f"Failed to create user: {str(e)}")
