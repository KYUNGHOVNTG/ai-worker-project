"""
시드 스크립트: sample_data 테이블에 예시 데이터 삽입

이미 데이터가 있으면 건너뜁니다 (멱등성 보장).

실행 방법:
    python scripts/seed.py
    make seed
"""

import asyncio
import sys
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가 (어디서 실행하든 import 가능하도록)
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select  # noqa: E402

from server.app.core.database import AsyncSessionLocal  # noqa: E402
from server.app.domain.sample.models import SampleDataModel  # noqa: E402

# ====================
# 시드 데이터 정의
# ====================

SAMPLE_SEED_DATA = [
    {
        "name": "알파 데이터",
        "description": "첫 번째 샘플 데이터입니다. 기본 CRUD 동작을 확인할 수 있습니다.",
        "value": 100.0,
        "score": 95.5,
    },
    {
        "name": "베타 데이터",
        "description": "두 번째 샘플 데이터입니다. 수정(PUT) 기능 테스트에 활용하세요.",
        "value": 200.0,
        "score": 87.3,
    },
    {
        "name": "감마 데이터",
        "description": "세 번째 샘플 데이터입니다. 목록 조회(GET) 테스트에 활용하세요.",
        "value": 150.5,
        "score": 92.1,
    },
    {
        "name": "델타 데이터",
        "description": "네 번째 샘플 데이터입니다. score가 없는 경우(null)를 확인합니다.",
        "value": 300.0,
        "score": None,
    },
    {
        "name": "엡실론 데이터",
        "description": None,
        "value": 75.0,
        "score": 78.9,
    },
]


# ====================
# 시드 함수
# ====================


async def seed_sample_data() -> None:
    async with AsyncSessionLocal() as session:
        # 이미 데이터가 있으면 건너뜀 (멱등성)
        result = await session.execute(select(SampleDataModel).limit(1))
        if result.scalars().first() is not None:
            print("  ℹ  sample_data: 이미 데이터가 존재합니다. 건너뜁니다.")
            return

        for item_data in SAMPLE_SEED_DATA:
            session.add(SampleDataModel(**item_data))

        await session.commit()
        print(f"  ✅ sample_data: {len(SAMPLE_SEED_DATA)}건 삽입 완료.")


async def main() -> None:
    print("\n🌱 시드 데이터 삽입 시작...")
    await seed_sample_data()
    print("🌱 완료!\n")


if __name__ == "__main__":
    asyncio.run(main())
