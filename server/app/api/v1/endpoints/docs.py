"""
문서 제공 엔드포인트

프로젝트 문서 파일(Markdown)을 클라이언트에 제공합니다.
"""

import os
from pathlib import Path
from typing import Dict

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import PlainTextResponse

from server.app.core.logging import get_logger

logger = get_logger(__name__)

# 라우터 생성
router = APIRouter(
    prefix="/docs",
    tags=["documentation"],
)

# 프로젝트 루트 경로
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent.parent.parent

# 허용된 문서 파일 매핑 (보안을 위해 화이트리스트 방식)
ALLOWED_DOCS: Dict[str, Path] = {
    "/ARCHITECTURE.md": PROJECT_ROOT / "ARCHITECTURE.md",
    "/server/README.md": PROJECT_ROOT / "server" / "README.md",
    "/client/README.md": PROJECT_ROOT / "client" / "README.md",
    "/DEVELOPMENT_GUIDE.md": PROJECT_ROOT / "DEVELOPMENT_GUIDE.md",
}


@router.get(
    "",
    response_class=PlainTextResponse,
    summary="문서 파일 조회",
    description="프로젝트 문서 파일(Markdown)을 조회합니다.",
)
async def get_document(
    path: str = Query(..., description="문서 파일 경로 (예: /ARCHITECTURE.md)")
) -> str:
    """
    프로젝트 문서 파일 조회

    Args:
        path: 문서 파일 경로

    Returns:
        str: 문서 파일 내용 (Markdown)

    Raises:
        HTTPException: 파일을 찾을 수 없거나 읽을 수 없는 경우
    """
    # 허용된 문서인지 확인
    if path not in ALLOWED_DOCS:
        logger.warning(f"Unauthorized document access attempt: {path}")
        raise HTTPException(
            status_code=404,
            detail="문서를 찾을 수 없습니다."
        )

    file_path = ALLOWED_DOCS[path]

    # 파일 존재 확인
    if not file_path.exists():
        logger.error(f"Document file not found: {file_path}")
        raise HTTPException(
            status_code=404,
            detail="문서 파일이 존재하지 않습니다."
        )

    # 파일 읽기
    try:
        content = file_path.read_text(encoding="utf-8")
        logger.info(f"Document served: {path}")
        return content
    except Exception as e:
        logger.error(f"Failed to read document {file_path}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="문서를 읽을 수 없습니다."
        )


@router.get(
    "/list",
    summary="문서 목록 조회",
    description="사용 가능한 문서 목록을 조회합니다.",
)
async def list_documents() -> Dict[str, list]:
    """
    사용 가능한 문서 목록 조회

    Returns:
        dict: 문서 목록 정보
    """
    documents = [
        {
            "path": path,
            "title": path.split("/")[-1],
            "exists": file_path.exists(),
        }
        for path, file_path in ALLOWED_DOCS.items()
    ]

    return {
        "documents": documents
    }
