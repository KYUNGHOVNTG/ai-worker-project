"""
System 도메인 ORM 모델
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column

from server.app.core.database import Base


class ConnectionTest(Base):
    """
    데이터베이스 연결 테스트 테이블
    Supabase 연결 상태를 확인하기 위한 간단한 테이블
    """

    __tablename__ = "connection_tests"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    def __repr__(self) -> str:
        return f"<ConnectionTest(id={self.id}, message='{self.message[:20]}...')>"
