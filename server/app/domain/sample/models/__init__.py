"""
Sample Domain Models

데이터베이스 테이블과 매핑되는 SQLAlchemy 모델을 정의합니다.
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, Float, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from server.app.core.database import Base


class SampleDataModel(Base):
    """
    샘플 데이터 모델

    sample_data 테이블과 매핑되는 ORM 모델입니다.
    """

    __tablename__ = "sample_data"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="데이터 이름"
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="상세 설명"
    )

    value: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="수치 값"
    )

    score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="점수"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        comment="생성 시각"
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
        comment="수정 시각"
    )

    def __repr__(self) -> str:
        return f"<SampleDataModel(id={self.id}, name='{self.name}', value={self.value})>"
