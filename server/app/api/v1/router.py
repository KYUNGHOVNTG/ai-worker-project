"""
API v1 라우터 통합

모든 v1 엔드포인트를 하나의 라우터로 통합합니다.
"""

from fastapi import APIRouter

from server.app.api.v1.endpoints import auth, sample, docs, system

# v1 메인 라우터 생성
api_router = APIRouter()

# 각 도메인의 라우터를 포함
api_router.include_router(
    auth.router,
)

api_router.include_router(
    sample.router,
)

# 문서 제공 라우터
api_router.include_router(
    docs.router,
)

# System 도메인 라우터
api_router.include_router(
    system.router,
)


# 헬스체크 엔드포인트 (v1 루트)
@api_router.get(
    "/health",
    tags=["health"],
    summary="API 헬스체크",
    description="API v1의 전체 상태를 확인합니다.",
)
async def health_check() -> dict:
    """
    전체 API 헬스체크

    Returns:
        dict: API 상태 정보
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "api": "v1",
    }
