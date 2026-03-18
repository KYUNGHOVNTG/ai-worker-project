"""
Sample Domain Schemas

API 요청/응답 스키마를 정의합니다.
Pydantic v2 모델을 사용합니다.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class SampleDataCreate(BaseModel):
    """샘플 데이터 생성 요청 스키마"""

    name: str = Field(
        ...,
        description="데이터 이름",
        min_length=1,
        max_length=255,
    )

    description: Optional[str] = Field(
        default=None,
        description="상세 설명",
    )

    value: float = Field(
        ...,
        description="수치 값",
    )

    score: Optional[float] = Field(
        default=None,
        description="점수 (0.0 ~ 1.0)",
        ge=0.0,
        le=1.0,
    )


class SampleDataUpdate(BaseModel):
    """샘플 데이터 수정 요청 스키마"""

    name: Optional[str] = Field(
        default=None,
        description="데이터 이름",
        min_length=1,
        max_length=255,
    )

    description: Optional[str] = Field(
        default=None,
        description="상세 설명",
    )

    value: Optional[float] = Field(
        default=None,
        description="수치 값",
    )

    score: Optional[float] = Field(
        default=None,
        description="점수 (0.0 ~ 1.0)",
        ge=0.0,
        le=1.0,
    )


class SampleDataResponse(BaseModel):
    """샘플 데이터 응답 스키마"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None
    value: float
    score: Optional[float] = None
    created_at: datetime
    updated_at: datetime
