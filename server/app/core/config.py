"""
애플리케이션 설정 관리
Pydantic Settings를 사용한 타입 안전한 환경 변수 관리
"""

from functools import lru_cache
from typing import Optional

from pydantic import Field, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    애플리케이션 전역 설정

    환경 변수 또는 .env 파일에서 로드됩니다.
    모든 설정은 타입 안전하며 validation을 거칩니다.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ====================
    # Application Settings
    # ====================
    APP_NAME: str = Field(
        default="vibe-web-starter",
        description="애플리케이션 이름"
    )
    APP_VERSION: str = Field(
        default="0.1.0",
        description="애플리케이션 버전"
    )
    DEBUG: bool = Field(
        default=False,
        description="디버그 모드"
    )
    ENVIRONMENT: str = Field(
        default="development",
        description="실행 환경 (development, staging, production)"
    )

    # ====================
    # API Settings
    # ====================
    API_V1_PREFIX: str = Field(
        default="/api/v1",
        description="API v1 경로 prefix"
    )
    ALLOWED_ORIGINS: list[str] = Field(
        default=["http://localhost:3000"],
        description="CORS 허용 오리진"
    )

    # ====================
    # Database Settings
    # ====================
    POSTGRES_HOST: str = Field(
        default="localhost",
        description="PostgreSQL 호스트"
    )
    POSTGRES_PORT: int = Field(
        default=5432,
        description="PostgreSQL 포트"
    )
    POSTGRES_USER: str = Field(
        default="postgres",
        description="PostgreSQL 사용자명"
    )
    POSTGRES_PASSWORD: str = Field(
        default="postgres",
        description="PostgreSQL 비밀번호"
    )
    POSTGRES_DB: str = Field(
        default="vibe-web-starter",
        description="PostgreSQL 데이터베이스명"
    )

    DATABASE_URL: Optional[str] = Field(
        default=None,
        description="데이터베이스 URL. SQLite(기본) 및 PostgreSQL 모두 지원."
    )

    DB_ECHO: bool = Field(
        default=False,
        description="SQLAlchemy SQL 로깅 활성화"
    )
    DB_POOL_SIZE: int = Field(
        default=5,
        description="데이터베이스 커넥션 풀 크기"
    )
    DB_MAX_OVERFLOW: int = Field(
        default=10,
        description="데이터베이스 커넥션 풀 최대 오버플로우"
    )

    # SQLite 기본 폴백 경로
    SQLITE_FALLBACK_URL: str = Field(
        default="sqlite+aiosqlite:///./dev.db",
        description="DATABASE_URL 미설정 시 사용할 SQLite 기본 경로"
    )

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info) -> str:
        """
        DATABASE_URL을 결정합니다.

        우선순위:
        1. DATABASE_URL이 직접 제공된 경우 그대로 사용
        2. POSTGRES_HOST 등 개별 변수가 설정된 경우 PostgreSQL URL 조립
        3. 위 모두 없으면 SQLite 폴백 (dev.db)
        """
        if v:
            return v

        values = info.data
        # 개별 Postgres 변수가 기본값이 아닌 경우에만 PostgreSQL URL 조립
        host = values.get("POSTGRES_HOST", "localhost")
        if host != "localhost":
            return PostgresDsn.build(
                scheme="postgresql+asyncpg",
                username=values.get("POSTGRES_USER"),
                password=values.get("POSTGRES_PASSWORD"),
                host=host,
                port=values.get("POSTGRES_PORT"),
                path=f"{values.get('POSTGRES_DB') or ''}",
            ).unicode_string()

        # SQLite 폴백
        return values.get("SQLITE_FALLBACK_URL", "sqlite+aiosqlite:///./dev.db")

    # ====================
    # Security Settings
    # ====================
    SECRET_KEY: str = Field(
        default="your-secret-key-here-change-in-production",
        description="암호화 키 (운영환경에서 반드시 변경)"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        description="액세스 토큰 만료 시간 (분)"
    )

    # ====================
    # Logging Settings
    # ====================
    LOG_LEVEL: str = Field(
        default="INFO",
        description="로그 레벨 (DEBUG, INFO, WARNING, ERROR, CRITICAL)"
    )

    # ====================
    # Domain Plugin Settings
    # ====================
    # 여기에 도메인별 설정을 추가할 수 있습니다
    # 예: ENABLE_SAMPLE_DOMAIN: bool = True


@lru_cache()
def get_settings() -> Settings:
    """
    설정 인스턴스를 반환합니다.

    @lru_cache 데코레이터를 통해 싱글톤 패턴을 구현합니다.
    애플리케이션 생명주기 동안 설정은 한 번만 로드됩니다.

    Returns:
        Settings: 애플리케이션 설정 인스턴스
    """
    return Settings()


# 전역 설정 인스턴스
settings = get_settings()
