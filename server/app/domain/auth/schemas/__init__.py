"""
Auth Domain Schemas

인증 관련 요청/응답 Pydantic 스키마를 정의합니다.
SDD: 이 스키마가 Single Source of Truth입니다.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    """회원가입 요청"""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "email": "user@example.com",
                    "password": "securePassword123!",
                }
            ]
        }
    )

    email: EmailStr = Field(
        ...,
        description="이메일 주소 (로그인 ID로 사용)",
    )

    password: str = Field(
        ...,
        description="비밀번호 (8자 이상)",
        min_length=8,
        max_length=128,
    )


class LoginRequest(BaseModel):
    """로그인 요청"""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "email": "user@example.com",
                    "password": "securePassword123!",
                }
            ]
        }
    )

    email: EmailStr = Field(
        ...,
        description="이메일 주소",
    )

    password: str = Field(
        ...,
        description="비밀번호",
    )


class TokenResponse(BaseModel):
    """토큰 응답"""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "token_type": "bearer",
                }
            ]
        }
    )

    access_token: str = Field(description="JWT 액세스 토큰")
    token_type: str = Field(default="bearer", description="토큰 타입")


class UserResponse(BaseModel):
    """사용자 정보 응답"""

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "examples": [
                {
                    "id": 1,
                    "email": "user@example.com",
                    "is_active": True,
                    "created_at": "2026-03-26T09:00:00+09:00",
                }
            ]
        },
    )

    id: int = Field(description="사용자 ID")
    email: str = Field(description="이메일 주소")
    is_active: bool = Field(description="활성 여부")
    created_at: datetime = Field(description="가입 시각")
