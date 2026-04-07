"""
Auth Domain Service

회원가입, 로그인, 현재 사용자 조회 비즈니스 로직을 처리합니다.
BaseService를 상속하고, ServiceResult로 결과를 반환합니다.
"""

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.security import create_access_token, hash_password, verify_password
from server.app.domain.auth.repositories import UserRepository
from server.app.domain.auth.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from server.app.shared.base.service import BaseService
from server.app.shared.exceptions import UnauthorizedException, ValidationException
from server.app.shared.types import ServiceResult


class AuthService(BaseService[RegisterRequest, UserResponse]):
    """
    인증 서비스

    BaseService를 상속하며, Repository를 조합하여 인증 로직을 오케스트레이션합니다.
    """

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)
        self.repository = UserRepository(db)

    async def execute(
        self, request: RegisterRequest, **kwargs: Any
    ) -> ServiceResult[UserResponse]:
        """기본 실행: 회원가입"""
        return await self.register(request)

    async def register(self, data: RegisterRequest) -> ServiceResult[UserResponse]:
        """회원가입 — 이메일 중복 검사 후 사용자 생성"""
        existing = await self.repository.get_by_email(data.email)
        if existing is not None:
            raise ValidationException(f"Email '{data.email}' is already registered")

        hashed = hash_password(data.password)
        user = await self.repository.create(email=data.email, hashed_password=hashed)
        return ServiceResult.ok(UserResponse.model_validate(user))

    async def login(self, data: LoginRequest) -> ServiceResult[TokenResponse]:
        """로그인 — 이메일+비밀번호 검증 후 JWT 발급"""
        user = await self.repository.get_by_email(data.email)
        if user is None or not verify_password(data.password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")

        if not user.is_active:
            raise UnauthorizedException("Account is deactivated")

        token = create_access_token(subject=str(user.id))
        return ServiceResult.ok(TokenResponse(access_token=token))

    async def get_current_user(self, user_id: int) -> ServiceResult[UserResponse]:
        """토큰에서 추출한 user_id로 사용자 정보 조회"""
        user = await self.repository.get_by_id(user_id)
        return ServiceResult.ok(UserResponse.model_validate(user))
