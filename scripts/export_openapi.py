"""
OpenAPI 스펙 추출 스크립트

서버 실행 없이 FastAPI 앱에서 openapi.json을 추출합니다.
SDD 파이프라인의 첫 번째 단계입니다.

사용법:
    python scripts/export_openapi.py
    → client/src/types/openapi.json 에 저장됨
"""

import json
import sys
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from server.main import app  # noqa: E402


def export_openapi_schema() -> None:
    """FastAPI 앱에서 OpenAPI 스키마를 추출하여 JSON 파일로 저장합니다."""
    schema = app.openapi()

    output_dir = project_root / "client" / "src" / "types"
    output_dir.mkdir(parents=True, exist_ok=True)

    output_path = output_dir / "openapi.json"
    output_path.write_text(json.dumps(schema, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"✅ OpenAPI 스펙 추출 완료: {output_path}")
    print(f"   엔드포인트 수: {sum(len(v) for v in schema.get('paths', {}).values())}")
    print(f"   스키마 수: {len(schema.get('components', {}).get('schemas', {}))}")


if __name__ == "__main__":
    export_openapi_schema()
