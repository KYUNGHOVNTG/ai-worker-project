"""
Auth Domain Service

회원가입, 로그인, 현재 사용자 조회 비즈니스 로직을 처리합니다.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.security import create_access_token, hash_password, verify_password
from server.app.domain.auth.repositories import UserRepository
from server.app.domain.auth.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from server.app.shared.exceptions import UnauthorizedException, ValidationException


class AuthService:
    """인증 서비스"""

    def __init__(self, db: AsyncSession) -> None:
        self.repository = UserRepository(db)

    async def register(self, data: RegisterRequest) -> UserResponse:
        """회원가입 — 이메일 중복 검사 후 사용자 생성"""
        existing = await self.repository.get_by_email(data.email)
        if existing is not None:
            raise ValidationException(f"Email '{data.email}' is already registered")

        hashed = hash_password(data.password)
        user = await self.repository.create(email=data.email, hashed_password=hashed)
        return UserResponse.model_validate(user)

    async def login(self, data: LoginRequest) -> TokenResponse:
        """로그인 — 이메일+비밀번호 검증 후 JWT 발급"""
        user = await self.repository.get_by_email(data.email)
        if user is None or not verify_password(data.password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")

        if not user.is_active:
            raise UnauthorizedException("Account is deactivated")

        token = create_access_token(subject=str(user.id))
        return TokenResponse(access_token=token)

    async def get_current_user(self, user_id: int) -> UserResponse:
        """토큰에서 추출한 user_id로 사용자 정보 조회"""
        user = await self.repository.get_by_id(user_id)
        return UserResponse.model_validate(user)
