"""
Sample Domain API 엔드포인트

샘플 도메인의 CRUD REST API 엔드포인트를 정의합니다.
모든 응답은 ApiResponse[T] 표준 래퍼로 반환됩니다. (SDD)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.dependencies import get_database_session
from server.app.domain.sample.schemas import (
    SampleDataCreate,
    SampleDataUpdate,
    SampleDataResponse,
)
from server.app.domain.sample.service import SampleService
from server.app.shared.exceptions import NotFoundException
from server.app.shared.types import ApiResponse

router = APIRouter(
    prefix="/sample",
    tags=["sample"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"},
    },
)


@router.get(
    "/",
    response_model=ApiResponse[list[SampleDataResponse]],
    status_code=status.HTTP_200_OK,
    summary="샘플 데이터 목록 조회",
    description="전체 샘플 데이터 목록을 반환합니다.",
)
async def list_sample(
    db: AsyncSession = Depends(get_database_session),
) -> ApiResponse[list[SampleDataResponse]]:
    service = SampleService(db)
    result = await service.get_all()
    return ApiResponse.ok(data=result.data)


@router.get(
    "/{item_id}",
    response_model=ApiResponse[SampleDataResponse],
    status_code=status.HTTP_200_OK,
    summary="샘플 데이터 단건 조회",
    description="ID로 샘플 데이터를 조회합니다.",
)
async def get_sample(
    item_id: int,
    db: AsyncSession = Depends(get_database_session),
) -> ApiResponse[SampleDataResponse]:
    service = SampleService(db)
    try:
        result = await service.get_by_id(item_id)
        return ApiResponse.ok(data=result.data)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)


@router.post(
    "/",
    response_model=ApiResponse[SampleDataResponse],
    status_code=status.HTTP_201_CREATED,
    summary="샘플 데이터 생성",
    description="새로운 샘플 데이터를 생성합니다.",
)
async def create_sample(
    request: SampleDataCreate,
    db: AsyncSession = Depends(get_database_session),
) -> ApiResponse[SampleDataResponse]:
    service = SampleService(db)
    result = await service.create(request)
    return ApiResponse.ok(data=result.data, message="생성 완료")


@router.put(
    "/{item_id}",
    response_model=ApiResponse[SampleDataResponse],
    status_code=status.HTTP_200_OK,
    summary="샘플 데이터 수정",
    description="기존 샘플 데이터를 수정합니다.",
)
async def update_sample(
    item_id: int,
    request: SampleDataUpdate,
    db: AsyncSession = Depends(get_database_session),
) -> ApiResponse[SampleDataResponse]:
    service = SampleService(db)
    try:
        result = await service.update(item_id, request)
        return ApiResponse.ok(data=result.data, message="수정 완료")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)


@router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="샘플 데이터 삭제",
    description="샘플 데이터를 삭제합니다.",
)
async def delete_sample(
    item_id: int,
    db: AsyncSession = Depends(get_database_session),
) -> None:
    service = SampleService(db)
    try:
        await service.delete(item_id)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
