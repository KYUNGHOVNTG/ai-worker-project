"""
FastAPI 공통 의존성 (Dependencies)

라우터에서 사용할 수 있는 재사용 가능한 의존성 함수들을 정의합니다.
"""

from typing import Optional

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.database import get_db
from server.app.core.security import decode_access_token

# Swagger UI "Authorize" 버튼 활성화를 위한 OAuth2 스킴
# tokenUrl은 Swagger에서 토큰을 발급받는 경로 (표시 전용)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


# ====================
# Database Dependency
# ====================


async def get_database_session() -> AsyncSession:
    """
    데이터베이스 세션 의존성

    사용법:
        @router.get("/items")
        async def get_items(db: AsyncSession = Depends(get_database_session)):
            ...
    """
    async for session in get_db():
        yield session


# ====================
# Authentication Dependencies
# ====================


def _verify_jwt(token: str) -> dict:
    """JWT 토큰을 디코딩하고 user_id를 반환한다."""
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = int(sub)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token subject is not a valid user ID",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"user_id": user_id}


class AuthenticationChecker:
    """인증 검증 클래스 — JWT 토큰 및 API 키 검증"""

    async def verify_token(
        self, token: Optional[str] = Depends(oauth2_scheme)
    ) -> dict:
        """
        JWT Bearer 토큰을 검증합니다.
        OAuth2PasswordBearer가 Authorization 헤더에서 토큰을 자동 추출합니다.

        Returns:
            dict: {"user_id": int}
        """
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header missing",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return _verify_jwt(token)

    async def verify_api_key(self, x_api_key: Optional[str] = Header(None)) -> dict:
        """
        API 키를 검증합니다.
        TODO: 실제 API 키 검증 로직 구현
        """
        if not x_api_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="API key missing",
            )
        return {"client_id": "test_client", "api_key": x_api_key}


# 전역 인증 체커 인스턴스
auth_checker = AuthenticationChecker()


# ====================
# Common Dependencies
# ====================


async def get_current_user(
    user_info: dict = Depends(auth_checker.verify_token),
) -> dict:
    """
    현재 인증된 사용자 정보를 반환합니다.

    Returns:
        dict: {"user_id": int}
    """
    return user_info


async def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
) -> Optional[dict]:
    """
    선택적 인증: 토큰이 있으면 검증하고, 없으면 None 반환
    """
    if not token:
        return None

    try:
        return _verify_jwt(token)
    except HTTPException:
        return None


# ====================
# Pagination Dependencies
# ====================


class PaginationParams:
    """
    페이지네이션 파라미터

    쿼리 파라미터로 전달되는 페이지네이션 정보를 관리합니다.
    """

    def __init__(
        self,
        skip: int = 0,
        limit: int = 100,
    ):
        """
        Args:
            skip: 건너뛸 항목 수 (기본값: 0)
            limit: 가져올 최대 항목 수 (기본값: 100)
        """
        self.skip = max(0, skip)
        self.limit = min(1000, max(1, limit))  # 최대 1000개로 제한


async def get_pagination(
    skip: int = 0,
    limit: int = 100,
) -> PaginationParams:
    """
    페이지네이션 의존성

    사용법:
        @router.get("/items")
        async def get_items(pagination: PaginationParams = Depends(get_pagination)):
            return await get_items_from_db(
                skip=pagination.skip,
                limit=pagination.limit
            )

    Args:
        skip: 건너뛸 항목 수
        limit: 가져올 최대 항목 수

    Returns:
        PaginationParams: 페이지네이션 파라미터
    """
    return PaginationParams(skip=skip, limit=limit)


# ====================
# Request Context Dependencies
# ====================


class RequestContext:
    """
    요청 컨텍스트

    요청과 관련된 메타 정보를 담는 컨텍스트 클래스입니다.
    서비스 계층에서 로깅, 추적 등에 사용할 수 있습니다.
    """

    def __init__(
        self,
        user_id: Optional[int] = None,
        request_id: Optional[str] = None,
        client_ip: Optional[str] = None,
    ):
        """
        Args:
            user_id: 요청한 사용자 ID
            request_id: 요청 추적 ID
            client_ip: 클라이언트 IP 주소
        """
        self.user_id = user_id
        self.request_id = request_id
        self.client_ip = client_ip


async def get_request_context(
    user: Optional[dict] = Depends(get_optional_current_user),
    x_request_id: Optional[str] = Header(None),
    x_forwarded_for: Optional[str] = Header(None),
) -> RequestContext:
    """
    요청 컨텍스트 의존성

    사용법:
        @router.post("/items")
        async def create_item(
            context: RequestContext = Depends(get_request_context)
        ):
            # context.user_id, context.request_id 등을 사용

    Args:
        user: 현재 사용자 정보 (선택)
        x_request_id: 요청 추적 ID
        x_forwarded_for: 클라이언트 IP (프록시 경유 시)

    Returns:
        RequestContext: 요청 컨텍스트
    """
    user_id = user.get("user_id") if user else None
    client_ip = x_forwarded_for.split(",")[0] if x_forwarded_for else None

    return RequestContext(
        user_id=user_id,
        request_id=x_request_id,
        client_ip=client_ip,
    )
