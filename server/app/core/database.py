"""
데이터베이스 설정 및 세션 관리
SQLAlchemy 2.0 + asyncpg 기반 비동기 데이터베이스 연결
"""

from typing import AsyncGenerator

from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from server.app.core.config import settings

# ====================
# Database Engine
# ====================

engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=settings.DB_ECHO,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=True,  # 연결 유효성 자동 검사
)

# ====================
# Session Factory
# ====================

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # 커밋 후에도 객체 접근 가능
    autoflush=False,
    autocommit=False,
)

# ====================
# Base Model
# ====================

# 네이밍 컨벤션 정의
# 인덱스, 제약조건 등의 이름을 자동으로 생성할 때 사용
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=convention)


class Base(DeclarativeBase):
    """
    모든 SQLAlchemy 모델의 베이스 클래스

    사용법:
        class User(Base):
            __tablename__ = "users"
            id = Column(Integer, primary_key=True)
            ...
    """

    metadata = metadata


# ====================
# Database Dependency
# ====================


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency: 데이터베이스 세션 제공

    비동기 컨텍스트 매니저를 통해 세션을 생성하고
    요청이 끝나면 자동으로 세션을 닫습니다.

    사용법:
        @router.get("/users")
        async def get_users(db: AsyncSession = Depends(get_db)):
            ...

    Yields:
        AsyncSession: 데이터베이스 세션
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


# ====================
# Database Utilities
# ====================


class DatabaseManager:
    """
    데이터베이스 관리 유틸리티 클래스

    테이블 생성, 삭제 등의 관리 작업을 담당합니다.
    주로 테스트나 초기 설정에서 사용됩니다.
    """

    @staticmethod
    async def create_tables() -> None:
        """
        모든 테이블을 생성합니다.

        주의: 운영 환경에서는 Alembic 마이그레이션을 사용하세요.
        """
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    @staticmethod
    async def drop_tables() -> None:
        """
        모든 테이블을 삭제합니다.

        주의: 운영 환경에서는 절대 사용하지 마세요.
        테스트 환경에서만 사용합니다.
        """
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)

    @staticmethod
    async def reset_database() -> None:
        """
        데이터베이스를 초기화합니다 (삭제 후 재생성).

        주의: 테스트 환경에서만 사용하세요.
        """
        await DatabaseManager.drop_tables()
        await DatabaseManager.create_tables()

    @staticmethod
    async def close_connections() -> None:
        """
        모든 데이터베이스 연결을 닫습니다.

        애플리케이션 종료 시 호출되어야 합니다.
        """
        await engine.dispose()
