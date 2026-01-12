"""
Pytest 설정 및 공통 Fixture

모든 테스트에서 사용할 수 있는 fixture를 정의합니다.
"""

import asyncio
from typing import AsyncGenerator, Generator

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from server.main import app
from server.app.core.database import Base, get_db
from server.app.core.config import settings


# ====================
# 테스트 데이터베이스 설정
# ====================

# 테스트용 인메모리 SQLite 데이터베이스
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)

TestAsyncSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


# ====================
# Async Event Loop Fixture
# ====================

@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """
    세션 스코프의 이벤트 루프를 제공합니다.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# ====================
# 데이터베이스 Fixtures
# ====================

@pytest.fixture(scope="function")
async def test_db() -> AsyncGenerator[AsyncSession, None]:
    """
    테스트용 데이터베이스 세션을 제공합니다.

    각 테스트 함수마다 새로운 세션을 생성하고,
    테스트 종료 후 롤백합니다.
    """
    # 테이블 생성
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 세션 생성
    async with TestAsyncSessionLocal() as session:
        yield session
        await session.rollback()

    # 테이블 삭제
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


# ====================
# FastAPI Client Fixtures
# ====================

@pytest.fixture(scope="function")
def client() -> Generator:
    """
    동기 테스트 클라이언트를 제공합니다.

    TODO: 실제 데이터베이스 대신 테스트 DB를 사용하도록 설정
    """
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="function")
async def async_client(test_db: AsyncSession) -> AsyncGenerator:
    """
    비동기 테스트 클라이언트를 제공합니다.

    테스트 데이터베이스 세션을 사용하도록 의존성을 오버라이드합니다.
    """
    async def override_get_db():
        yield test_db

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


# ====================
# 인증 Fixtures
# ====================

@pytest.fixture
def mock_user() -> dict:
    """
    테스트용 사용자 정보를 제공합니다.
    """
    return {
        "user_id": 1,
        "username": "test_user",
        "email": "test@example.com",
    }


@pytest.fixture
def auth_headers(mock_user: dict) -> dict:
    """
    인증 헤더를 제공합니다.

    TODO: 실제 JWT 토큰 생성 로직 구현
    """
    # 실제로는 JWT 토큰을 생성해야 합니다
    # token = create_access_token(data={"sub": mock_user["username"]})
    # return {"Authorization": f"Bearer {token}"}

    # 현재는 더미 헤더 반환
    return {"Authorization": "Bearer test_token"}


# ====================
# 테스트 데이터 Fixtures
# ====================

@pytest.fixture
def sample_analysis_request() -> dict:
    """
    샘플 분석 요청 데이터를 제공합니다.
    """
    return {
        "data_id": 1,
        "analysis_type": "statistical",
        "threshold": 0.5,
        "include_details": True,
    }


# ====================
# Markers
# ====================

# pytest.ini에 정의된 마커들을 사용할 수 있습니다:
# - @pytest.mark.unit: 단위 테스트
# - @pytest.mark.integration: 통합 테스트
# - @pytest.mark.slow: 느린 테스트
