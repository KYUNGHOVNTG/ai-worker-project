"""
공통 예외 클래스

도메인 전반에서 사용할 수 있는 표준화된 예외를 정의합니다.
"""

from typing import Any, Optional


class ApplicationException(Exception):
    """
    애플리케이션 기본 예외

    모든 비즈니스 로직 예외의 기반 클래스입니다.
    HTTP 상태 코드와 상세 메시지를 포함합니다.
    """

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[dict[str, Any]] = None,
    ):
        """
        Args:
            message: 예외 메시지
            status_code: HTTP 상태 코드
            details: 추가 상세 정보
        """
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class ValidationException(ApplicationException):
    """
    유효성 검증 실패 예외

    입력 데이터의 유효성 검증이 실패했을 때 발생합니다.
    """

    def __init__(self, message: str, details: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=400, details=details)


class NotFoundException(ApplicationException):
    """
    리소스 없음 예외

    요청한 리소스를 찾을 수 없을 때 발생합니다.
    """

    def __init__(self, message: str, details: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=404, details=details)


class UnauthorizedException(ApplicationException):
    """
    인증 실패 예외

    인증이 필요하거나 인증 정보가 유효하지 않을 때 발생합니다.
    """

    def __init__(self, message: str = "Unauthorized", details: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=401, details=details)


class ForbiddenException(ApplicationException):
    """
    권한 없음 예외

    인증은 되었으나 해당 리소스에 대한 권한이 없을 때 발생합니다.
    """

    def __init__(self, message: str = "Forbidden", details: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=403, details=details)


class BusinessLogicException(ApplicationException):
    """
    비즈니스 로직 예외

    비즈니스 규칙 위반 시 발생합니다.
    """

    def __init__(self, message: str, details: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=422, details=details)


class ExternalServiceException(ApplicationException):
    """
    외부 서비스 오류 예외

    외부 API 호출이나 서드파티 서비스 연동 실패 시 발생합니다.
    """

    def __init__(self, message: str, details: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=502, details=details)


class RepositoryException(ApplicationException):
    """
    Repository 계층 예외

    데이터 접근 계층에서 오류가 발생했을 때 사용합니다.
    """

    def __init__(self, message: str, details: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=500, details=details)


# 하위 호환성을 위한 별칭 (deprecated)
ProviderException = RepositoryException


class CalculatorException(ApplicationException):
    """
    Calculator 계층 예외

    계산 로직에서 오류가 발생했을 때 사용합니다.
    """

    def __init__(self, message: str, details: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=500, details=details)


class FormatterException(ApplicationException):
    """
    Formatter 계층 예외

    포맷팅 로직에서 오류가 발생했을 때 사용합니다.
    """

    def __init__(self, message: str, details: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=500, details=details)
