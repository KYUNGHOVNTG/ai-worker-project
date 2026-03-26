"""
Sample Domain Schemas

API 요청/응답 스키마를 정의합니다.
Pydantic v2 모델을 사용합니다.

SDD: 이 스키마가 Single Source of Truth입니다.
     - OpenAPI 스펙 자동 생성 → 프론트엔드 TypeScript 타입 자동 생성
     - description, examples를 충실히 작성하면 API 문서와 프론트 타입에 모두 반영됩니다.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class SampleDataCreate(BaseModel):
    """샘플 데이터 생성 요청 스키마"""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "name": "매출 데이터",
                    "description": "2026년 1분기 매출 실적",
                    "value": 1500000.0,
                    "score": 0.85,
                }
            ]
        }
    )

    name: str = Field(
        ...,
        description="데이터 이름 (1~255자)",
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
    """샘플 데이터 수정 요청 스키마 (부분 수정 가능)"""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "name": "수정된 매출 데이터",
                    "value": 1800000.0,
                }
            ]
        }
    )

    name: Optional[str] = Field(
        default=None,
        description="데이터 이름 (1~255자)",
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

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "examples": [
                {
                    "id": 1,
                    "name": "매출 데이터",
                    "description": "2026년 1분기 매출 실적",
                    "value": 1500000.0,
                    "score": 0.85,
                    "created_at": "2026-03-26T09:00:00+09:00",
                    "updated_at": "2026-03-26T09:00:00+09:00",
                }
            ]
        },
    )

    id: int = Field(description="고유 식별자")
    name: str = Field(description="데이터 이름")
    description: Optional[str] = Field(default=None, description="상세 설명")
    value: float = Field(description="수치 값")
    score: Optional[float] = Field(default=None, description="점수 (0.0 ~ 1.0)")
    created_at: datetime = Field(description="생성 시각 (ISO 8601)")
    updated_at: datetime = Field(description="수정 시각 (ISO 8601)")
