"""2026-03-18-add-sample-domain

Revision ID: a1b2c3d4e5f6
Revises:
Create Date: 2026-03-18 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "sample_data",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False, comment="데이터 이름"),
        sa.Column("description", sa.Text(), nullable=True, comment="상세 설명"),
        sa.Column("value", sa.Float(), nullable=False, comment="수치 값"),
        sa.Column("score", sa.Float(), nullable=True, comment="점수"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
            comment="생성 시각",
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
            comment="수정 시각",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_sample_data")),
    )
    op.create_index(op.f("ix_sample_data_id"), "sample_data", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_sample_data_id"), table_name="sample_data")
    op.drop_table("sample_data")
