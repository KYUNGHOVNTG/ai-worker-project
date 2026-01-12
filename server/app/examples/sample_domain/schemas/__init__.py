"""
Sample Domain Schemas

API 요청/응답 스키마를 정의합니다.
Pydantic v2 모델을 사용합니다.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


# ====================
# Request Schemas
# ====================


class SampleAnalysisRequest(BaseModel):
    """
    샘플 분석 요청 스키마

    클라이언트가 분석을 요청할 때 전송하는 데이터 구조입니다.

    TODO: 실제 구현 시 다음을 고려하세요
        - 필수/선택 필드 구분
        - 유효성 검증 규칙 (validators)
        - 기본값 설정
        - 필드 설명 (description)
    """

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "data_id": 1,
                "analysis_type": "statistical",
                "threshold": 0.5,
            }
        }
    )

    data_id: int = Field(
        ...,
        description="분석할 데이터의 ID",
        ge=1,
    )

    analysis_type: str = Field(
        default="statistical",
        description="분석 유형 (statistical, trend, anomaly 등)",
        max_length=50,
    )

    threshold: Optional[float] = Field(
        default=None,
        description="분석 임계값",
        ge=0.0,
        le=1.0,
    )

    include_details: bool = Field(
        default=False,
        description="상세 정보 포함 여부",
    )


class SampleDataCreateRequest(BaseModel):
    """
    샘플 데이터 생성 요청 스키마

    TODO: 필요한 필드를 추가하세요
    """

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


# ====================
# Response Schemas
# ====================


class SampleDataResponse(BaseModel):
    """
    샘플 데이터 응답 스키마

    데이터베이스 모델을 API 응답으로 변환할 때 사용합니다.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None
    value: float
    score: Optional[float] = None
    created_at: datetime
    updated_at: datetime


class SampleAnalysisResponse(BaseModel):
    """
    샘플 분석 결과 응답 스키마

    분석 결과를 클라이언트에 반환할 때 사용합니다.

    TODO: 실제 분석 결과에 맞게 필드를 수정하세요
    """

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "data_id": 1,
                "analysis_type": "statistical",
                "result_summary": "분석 완료",
                "metrics": {
                    "mean": 42.5,
                    "median": 40.0,
                    "std_dev": 10.2,
                },
                "insights": [
                    "데이터가 정규 분포를 따릅니다",
                    "이상치가 3개 발견되었습니다",
                ],
                "analyzed_at": "2024-01-01T12:00:00Z",
            }
        }
    )

    data_id: int = Field(
        ...,
        description="분석된 데이터의 ID"
    )

    analysis_type: str = Field(
        ...,
        description="수행된 분석 유형"
    )

    result_summary: str = Field(
        ...,
        description="분석 결과 요약"
    )

    metrics: dict[str, float] = Field(
        default_factory=dict,
        description="분석 지표"
    )

    insights: list[str] = Field(
        default_factory=list,
        description="분석에서 얻은 인사이트"
    )

    analyzed_at: datetime = Field(
        ...,
        description="분석 수행 시각"
    )


# ====================
# Internal Data Transfer Objects
# ====================


class SampleProviderInput(BaseModel):
    """Provider 입력 데이터"""
    data_id: int


class SampleProviderOutput(BaseModel):
    """Provider 출력 데이터"""
    id: int
    name: str
    value: float
    score: Optional[float] = None


class SampleCalculatorInput(BaseModel):
    """Calculator 입력 데이터"""
    value: float
    score: Optional[float] = None
    analysis_type: str
    threshold: Optional[float] = None


class SampleCalculatorOutput(BaseModel):
    """Calculator 출력 데이터"""
    metrics: dict[str, float]
    insights: list[str]


class SampleFormatterInput(BaseModel):
    """Formatter 입력 데이터"""
    data_id: int
    analysis_type: str
    metrics: dict[str, float]
    insights: list[str]
