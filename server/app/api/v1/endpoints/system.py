"""
System API 엔드포인트
시스템 관리 및 모니터링 관련 API
"""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.database import get_db
from server.app.domain.system.schemas import DBCheckResponse

router = APIRouter(prefix="/system", tags=["system"])


@router.get(
    "/db-check",
    response_model=DBCheckResponse,
    summary="데이터베이스 연결 테스트",
    description="데이터베이스 연결 상태를 확인합니다.",
)
async def check_database_connection(
    db: AsyncSession = Depends(get_db),
) -> DBCheckResponse:
    """
    데이터베이스 연결 테스트

    SELECT 1 쿼리로 DB 연결 상태를 확인합니다.

    Args:
        db: 데이터베이스 세션 (자동 주입)

    Returns:
        DBCheckResponse: 연결 상태 및 메시지

    Raises:
        HTTPException: 데이터베이스 연결 실패 시 500 에러
    """
    try:
        await db.execute(text("SELECT 1"))
        return DBCheckResponse(
            success=True,
            message="DB 연결 성공",
            timestamp=datetime.utcnow(),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"데이터베이스 연결 테스트 실패: {str(e)}",
        )
