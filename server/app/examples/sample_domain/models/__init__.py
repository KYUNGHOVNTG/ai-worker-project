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

    예제 도메인의 데이터베이스 테이블입니다.
    실제 도메인에서는 비즈니스 요구사항에 맞게 수정하세요.

    TODO: 실제 구현 시 다음을 고려하세요
        - 적절한 인덱스 추가 (성능 최적화)
        - 외래키 관계 정의
        - 유니크 제약조건
        - 기본값 설정
        - 체크 제약조건
    """

    __tablename__ = "sample_data"

    # Primary Key
    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # 기본 필드
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

    # 수치 데이터 (분석용)
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

    # 타임스탬프
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
        """문자열 표현"""
        return f"<SampleDataModel(id={self.id}, name='{self.name}', value={self.value})>"

    # TODO: 필요한 경우 다음 메서드들을 추가하세요
    # - 비즈니스 로직 메서드
    # - 계산 프로퍼티
    # - 유효성 검증 메서드
