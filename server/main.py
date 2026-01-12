"""
FastAPI 애플리케이션 진입점

AI 데이터 분석 웹 서비스의 메인 애플리케이션입니다.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from server.app.core.config import settings
from server.app.core.database import DatabaseManager
from server.app.api.v1.router import api_router
from server.app.shared.exceptions import ApplicationException


# ====================
# Lifespan Events
# ====================


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """
    애플리케이션 생명주기 관리

    시작 시:
        - 데이터베이스 연결 확인
        - 필요한 초기화 작업 수행

    종료 시:
        - 데이터베이스 연결 종료
        - 리소스 정리
    """
    # 시작 시 실행
    print("🚀 Starting application...")
    print(f"📦 Environment: {settings.ENVIRONMENT}")
    print(f"🗄️  Database: {settings.POSTGRES_DB}")

    # TODO: 필요한 초기화 작업
    # - 데이터베이스 마이그레이션 확인
    # - 캐시 워밍업
    # - 외부 서비스 연결 확인

    # 개발 환경에서는 테이블 자동 생성 (운영에서는 사용 금지!)
    if settings.ENVIRONMENT == "development" and settings.DEBUG:
        print("⚠️  Development mode: Creating database tables...")
        # await DatabaseManager.create_tables()

    yield

    # 종료 시 실행
    print("👋 Shutting down application...")
    await DatabaseManager.close_connections()
    print("✅ Application shutdown complete")


# ====================
# FastAPI Application
# ====================


def create_application() -> FastAPI:
    """
    FastAPI 애플리케이션을 생성하고 설정합니다.

    Returns:
        FastAPI: 설정된 애플리케이션 인스턴스
    """
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="""
        # AI 데이터 분석 웹 서비스 템플릿

        FastAPI + SQLAlchemy 기반의 확장 가능한 백엔드 아키텍처

        ## 주요 기능

        - **도메인 플러그인 구조**: 새로운 도메인을 쉽게 추가 가능
        - **계층화된 아키텍처**: Router → Service → Provider/Calculator/Formatter
        - **타입 안전성**: Pydantic v2 + SQLAlchemy 2.0
        - **비동기 처리**: async/await 기반

        ## 아키텍처

        ```
        Router (FastAPI)
            ↓
        Service (비즈니스 로직 조율)
            ↓
        ├─ Provider (데이터 조회)
        ├─ Calculator (계산/분석)
        └─ Formatter (응답 포맷팅)
        ```

        ## 새 도메인 추가 방법

        1. `server/app/examples/` 또는 `server/app/domain/` 에 새 디렉토리 생성
        2. Provider, Calculator, Formatter, Service 구현
        3. `server/app/api/v1/endpoints/` 에 라우터 추가
        4. `server/app/api/v1/router.py` 에 라우터 등록
        """,
        debug=settings.DEBUG,
        lifespan=lifespan,
        # docs_url="/docs" if settings.DEBUG else None,  # 운영에서는 문서 비활성화 가능
        # redoc_url="/redoc" if settings.DEBUG else None,
    )

    # ====================
    # Middleware 설정
    # ====================

    # CORS 설정
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Trusted Host 설정 (운영 환경)
    if settings.ENVIRONMENT == "production":
        # TODO: 운영 환경에서는 실제 호스트 목록으로 변경
        # app.add_middleware(
        #     TrustedHostMiddleware,
        #     allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
        # )
        pass

    # TODO: 추가 미들웨어
    # - 요청 ID 추적
    # - 로깅
    # - 메트릭 수집
    # - Rate Limiting

    # ====================
    # Exception Handlers
    # ====================

    @app.exception_handler(ApplicationException)
    async def application_exception_handler(
        request: Request,
        exc: ApplicationException
    ) -> JSONResponse:
        """
        애플리케이션 예외 핸들러

        비즈니스 로직에서 발생한 예외를 적절한 HTTP 응답으로 변환합니다.
        """
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.message,
                "details": exc.details,
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(
        request: Request,
        exc: Exception
    ) -> JSONResponse:
        """
        일반 예외 핸들러

        예상치 못한 예외를 처리합니다.
        """
        # TODO: 로깅 및 알림
        # logger.error(f"Unexpected error: {str(exc)}", exc_info=True)

        # 개발 환경에서는 상세 에러 표시
        if settings.DEBUG:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "Internal server error",
                    "details": {
                        "type": type(exc).__name__,
                        "message": str(exc),
                    },
                },
            )

        # 운영 환경에서는 간단한 에러 메시지만
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal server error",
            },
        )

    # ====================
    # Router 등록
    # ====================

    # API v1 라우터
    app.include_router(
        api_router,
        prefix=settings.API_V1_PREFIX,
    )

    # 루트 엔드포인트
    @app.get(
        "/",
        tags=["root"],
        summary="루트 엔드포인트",
    )
    async def root() -> dict:
        """
        루트 엔드포인트

        API 기본 정보를 반환합니다.
        """
        return {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "running",
            "docs": "/docs",
            "api_v1": settings.API_V1_PREFIX,
        }

    # 헬스체크 엔드포인트
    @app.get(
        "/health",
        tags=["health"],
        summary="헬스체크",
    )
    async def health() -> dict:
        """
        헬스체크 엔드포인트

        서비스 상태를 확인합니다.
        """
        # TODO: 데이터베이스, 외부 서비스 연결 상태 확인
        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
        }

    return app


# ====================
# Application Instance
# ====================

# 애플리케이션 인스턴스 생성
app = create_application()


# ====================
# CLI Entry Point
# ====================

if __name__ == "__main__":
    """
    개발 서버 실행

    사용법:
        python -m server.main
    """
    import uvicorn

    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
