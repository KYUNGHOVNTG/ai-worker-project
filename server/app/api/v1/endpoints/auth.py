"""
Auth Domain API 엔드포인트

회원가입, 로그인, 현재 사용자 조회 REST API를 정의합니다.
모든 응답은 ApiResponse[T] 표준 래퍼로 반환됩니다. (SDD)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.dependencies import get_current_user, get_database_session
from server.app.domain.auth.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from server.app.domain.auth.service import AuthService
from server.app.shared.exceptions import UnauthorizedException, ValidationException
from server.app.shared.types import ApiResponse

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={
        401: {"description": "Unauthorized"},
        400: {"description": "Bad request"},
    },
)


@router.post(
    "/register",
    response_model=ApiResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
    summary="회원가입",
    description="이메일+비밀번호로 새 사용자를 생성합니다.",
)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_database_session),
) -> ApiResponse[UserResponse]:
    service = AuthService(db)
    try:
        result = await service.register(request)
        return ApiResponse.ok(data=result.data, message="회원가입 완료")
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)


@router.post(
    "/login",
    response_model=ApiResponse[TokenResponse],
    status_code=status.HTTP_200_OK,
    summary="로그인",
    description="이메일+비밀번호로 JWT 액세스 토큰을 발급받습니다.",
)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_database_session),
) -> ApiResponse[TokenResponse]:
    service = AuthService(db)
    try:
        result = await service.login(request)
        return ApiResponse.ok(data=result.data)
    except UnauthorizedException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.message,
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get(
    "/me",
    response_model=ApiResponse[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="현재 사용자 정보",
    description="Bearer 토큰으로 인증된 현재 사용자 정보를 반환합니다.",
)
async def get_me(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_database_session),
) -> ApiResponse[UserResponse]:
    service = AuthService(db)
    result = await service.get_current_user(current_user["user_id"])
    return ApiResponse.ok(data=result.data)
