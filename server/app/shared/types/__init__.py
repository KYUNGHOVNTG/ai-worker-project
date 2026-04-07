"""
공통 타입 정의

도메인 전반에서 사용되는 타입 힌트와 타입 별칭을 정의합니다.
"""

from typing import Any, TypeVar, Generic
from pydantic import BaseModel, Field


# ====================
# Generic Type Variables
# ====================

T = TypeVar("T")  # 일반 타입
TModel = TypeVar("TModel", bound=BaseModel)  # Pydantic 모델
TEntity = TypeVar("TEntity")  # 도메인 엔티티
TData = TypeVar("TData")  # 데이터 타입


# ====================
# Standard API Response (SDD 표준 응답 래퍼)
# ====================


class ApiResponse(BaseModel, Generic[T]):
    """
    표준 API 응답 래퍼

    모든 API 엔드포인트는 이 래퍼를 통해 일관된 응답 구조를 반환합니다.
    프론트엔드의 ApiResponse<T> 타입과 1:1 대응합니다.

    성공 예시:
        {"success": true, "data": {...}, "message": null}

    실패 예시:
        {"success": false, "data": null, "error": "Not found"}
    """

    success: bool = Field(description="요청 성공 여부")
    data: T | None = Field(default=None, description="응답 데이터")
    message: str | None = Field(default=None, description="성공 메시지")
    error: str | None = Field(default=None, description="에러 메시지")

    @classmethod
    def ok(cls, data: T, message: str | None = None) -> "ApiResponse[T]":
        """성공 응답 생성"""
        return cls(success=True, data=data, message=message)

    @classmethod
    def fail(cls, error: str) -> "ApiResponse[T]":
        """실패 응답 생성"""
        return cls(success=False, error=error)


class PaginatedApiResponse(BaseModel, Generic[T]):
    """
    페이지네이션 표준 API 응답 래퍼

    목록 조회 API에서 페이지네이션 메타데이터와 함께 응답합니다.
    """

    success: bool = Field(description="요청 성공 여부")
    data: list[T] = Field(default_factory=list, description="응답 데이터 목록")
    total: int = Field(description="전체 아이템 수")
    page: int = Field(description="현재 페이지")
    page_size: int = Field(description="페이지 크기")
    total_pages: int = Field(description="전체 페이지 수")
    message: str | None = Field(default=None, description="성공 메시지")
    error: str | None = Field(default=None, description="에러 메시지")


# ====================
# Common Response Types
# ====================


class ServiceResult(BaseModel, Generic[T]):
    """
    서비스 계층 결과 래퍼

    서비스 메서드의 실행 결과를 성공/실패 상태와 함께 반환합니다.
    """

    success: bool
    data: T | None = None
    error: str | None = None
    metadata: dict[str, Any] | None = None

    @classmethod
    def ok(cls, data: T, metadata: dict[str, Any] | None = None) -> "ServiceResult[T]":
        """성공 결과 생성"""
        return cls(success=True, data=data, metadata=metadata)

    @classmethod
    def fail(cls, error: str, metadata: dict[str, Any] | None = None) -> "ServiceResult[T]":
        """실패 결과 생성"""
        return cls(success=False, error=error, metadata=metadata)


class PaginatedResult(BaseModel, Generic[T]):
    """
    페이지네이션 결과

    페이지 정보와 함께 데이터를 반환합니다.
    """

    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int

    @classmethod
    def create(
        cls,
        items: list[T],
        total: int,
        skip: int = 0,
        limit: int = 100,
    ) -> "PaginatedResult[T]":
        """
        페이지네이션 결과 생성

        Args:
            items: 현재 페이지의 아이템 목록
            total: 전체 아이템 수
            skip: 건너뛴 아이템 수
            limit: 페이지 크기

        Returns:
            PaginatedResult: 페이지네이션 결과
        """
        page = (skip // limit) + 1 if limit > 0 else 1
        total_pages = (total + limit - 1) // limit if limit > 0 else 1

        return cls(
            items=items,
            total=total,
            page=page,
            page_size=limit,
            total_pages=total_pages,
        )


# ====================
# Data Transfer Types
# ====================


class RepositoryInput(BaseModel):
    """
    Repository 입력 데이터 베이스

    모든 Repository 입력은 이 클래스를 상속받아야 합니다.
    """

    pass


class RepositoryOutput(BaseModel):
    """
    Repository 출력 데이터 베이스

    모든 Repository 출력은 이 클래스를 상속받아야 합니다.
    """

    pass


class CalculatorInput(BaseModel):
    """
    Calculator 입력 데이터 베이스

    모든 Calculator 입력은 이 클래스를 상속받아야 합니다.
    """

    pass


class CalculatorOutput(BaseModel):
    """
    Calculator 출력 데이터 베이스

    모든 Calculator 출력은 이 클래스를 상속받아야 합니다.
    """

    pass


class FormatterInput(BaseModel):
    """
    Formatter 입력 데이터 베이스

    모든 Formatter 입력은 이 클래스를 상속받아야 합니다.
    """

    pass


class FormatterOutput(BaseModel):
    """
    Formatter 출력 데이터 베이스

    모든 Formatter 출력은 이 클래스를 상속받아야 합니다.
    """

    pass
