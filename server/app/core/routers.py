"""
Core 레벨 라우터

도메인과 무관한 인프라 레벨의 공통 엔드포인트를 제공합니다.
- Health Check: 서비스 상태 확인 (운영 모니터링용)
- Version: 배포 버전 확인 (배포 추적용)

사용 가이드:
    이 라우터는 main.py에서 직접 등록되며,
    어떤 비즈니스 도메인에도 의존하지 않습니다.

    새로운 인프라 엔드포인트를 추가할 때는 여기에 추가하세요.
    예: /metrics, /ready, /alive 등
"""

from typing import Dict, Any
from fastapi import APIRouter, status

from server.app.core.config import settings


# ====================
# Core Router 생성
# ====================

router = APIRouter(
    prefix="/core",
    tags=["core"],
)


# ====================
# Health Check Service
# ====================

class HealthCheckService:
    """
    헬스체크 서비스

    서버의 상태를 확인하고 반환합니다.
    운영 환경에서 로드밸런서나 모니터링 툴이 사용합니다.

    확장 가이드:
        - 데이터베이스 연결 상태 확인 추가
        - 외부 API 연결 상태 확인 추가
        - 캐시 서버 상태 확인 추가
    """

    @staticmethod
    async def get_health_status() -> Dict[str, Any]:
        """
        서비스 헬스 상태 반환

        Returns:
            Dict: 헬스 상태 정보
                - status: "ok" | "degraded" | "error"
                - env: 현재 환경 (development, staging, production)

        TODO: 프로덕션에서는 아래 체크 추가
            - await DatabaseManager.check_connection()
            - await RedisClient.ping()
            - await check_external_services()
        """
        return {
            "status": "ok",
            "env": settings.ENVIRONMENT,
        }


# ====================
# Version Service
# ====================

class VersionService:
    """
    버전 정보 서비스

    애플리케이션의 버전 정보를 제공합니다.
    배포 후 올바른 버전이 배포되었는지 확인할 때 사용합니다.

    확장 가이드:
        - Git commit hash 추가
        - 빌드 타임스탬프 추가
        - 의존성 버전 정보 추가
    """

    @staticmethod
    async def get_version_info() -> Dict[str, Any]:
        """
        버전 정보 반환

        Returns:
            Dict: 버전 정보
                - version: 애플리케이션 버전
                - env: 현재 환경
                - app_name: 애플리케이션 이름

        TODO: CI/CD 파이프라인과 연동
            - GIT_COMMIT_HASH 환경변수 추가
            - BUILD_TIMESTAMP 환경변수 추가
        """
        return {
            "version": settings.APP_VERSION,
            "env": settings.ENVIRONMENT,
            "app_name": settings.APP_NAME,
        }


# ====================
# Endpoints
# ====================

@router.get(
    "/health",
    summary="헬스체크",
    description="""
    서비스의 상태를 확인합니다.

    **사용 사례:**
    - 로드밸런서의 헬스체크 타겟
    - 모니터링 툴 (Datadog, New Relic 등)
    - Kubernetes Liveness Probe

    **응답 상태:**
    - `ok`: 정상 작동
    - `degraded`: 일부 기능 제한 (예: DB 연결 불안정)
    - `error`: 서비스 이용 불가
    """,
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
async def health_check() -> Dict[str, Any]:
    """
    헬스체크 엔드포인트

    Returns:
        Dict: 서비스 상태 정보
    """
    service = HealthCheckService()
    return await service.get_health_status()


@router.get(
    "/version",
    summary="버전 정보",
    description="""
    애플리케이션의 버전 정보를 반환합니다.

    **사용 사례:**
    - 배포 후 버전 확인
    - 프론트엔드에서 API 버전 체크
    - 디버깅 시 환경 확인

    **활용 예시:**
    ```bash
    # 배포 확인
    curl https://api.example.com/core/version

    # 프론트엔드에서 버전 불일치 감지
    if (apiVersion !== expectedVersion) {
      alert('새 버전이 배포되었습니다. 페이지를 새로고침해주세요.');
    }
    ```
    """,
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
async def version_info() -> Dict[str, Any]:
    """
    버전 정보 엔드포인트

    Returns:
        Dict: 버전 정보
    """
    service = VersionService()
    return await service.get_version_info()


# ====================
# 확장 가이드
# ====================

"""
새로운 인프라 엔드포인트 추가 방법:

1. Service 클래스 생성
   class MyInfraService:
       @staticmethod
       async def do_something() -> Dict[str, Any]:
           return {"result": "data"}

2. Endpoint 추가
   @router.get("/my-endpoint")
   async def my_endpoint() -> Dict[str, Any]:
       service = MyInfraService()
       return await service.do_something()

3. 주석으로 사용 가이드 명확히
   - 이 엔드포인트의 목적은?
   - 누가 사용하는가? (사람? 시스템?)
   - 어떤 상황에서 호출되는가?

예시 엔드포인트:
- /core/metrics - Prometheus 메트릭
- /core/ready - Kubernetes Readiness Probe
- /core/alive - Kubernetes Liveness Probe
- /core/config - 현재 설정 정보 (민감 정보 제외)
"""
