"""
Sample Domain API 통합 테스트

sample CRUD 엔드포인트의 전체 흐름을 테스트합니다.
SQLite in-memory DB를 사용하므로 외부 DB 없이 실행 가능합니다.
"""

import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.mark.integration
class TestSampleCRUD:
    """샘플 데이터 CRUD API 통합 테스트 (6개 시나리오)"""

    async def test_create_sample(self, async_client: AsyncClient):
        """POST /api/v1/sample/ → 201, 생성된 데이터 반환"""
        payload = {
            "name": "매출 데이터",
            "description": "2026년 1분기",
            "value": 1500000.0,
            "score": 0.85,
        }

        response = await async_client.post("/api/v1/sample/", json=payload)

        assert response.status_code == status.HTTP_201_CREATED
        body = response.json()
        assert body["success"] is True
        data = body["data"]
        assert data["name"] == payload["name"]
        assert data["description"] == payload["description"]
        assert data["value"] == payload["value"]
        assert data["score"] == payload["score"]
        assert "id" in data
        assert "created_at" in data

    async def test_get_sample_list(self, async_client: AsyncClient):
        """GET /api/v1/sample/ → 200, 배열 반환"""
        # 데이터 2건 생성
        await async_client.post("/api/v1/sample/", json={"name": "A", "value": 1.0})
        await async_client.post("/api/v1/sample/", json={"name": "B", "value": 2.0})

        response = await async_client.get("/api/v1/sample/")

        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert body["success"] is True
        assert isinstance(body["data"], list)
        assert len(body["data"]) >= 2

    async def test_get_sample_by_id(self, async_client: AsyncClient):
        """GET /api/v1/sample/{id} → 200, 단일 항목 반환"""
        # 데이터 생성
        create_resp = await async_client.post(
            "/api/v1/sample/", json={"name": "조회 테스트", "value": 42.0}
        )
        created_id = create_resp.json()["data"]["id"]

        response = await async_client.get(f"/api/v1/sample/{created_id}")

        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert body["success"] is True
        assert body["data"]["id"] == created_id
        assert body["data"]["name"] == "조회 테스트"

    async def test_get_sample_not_found(self, async_client: AsyncClient):
        """GET /api/v1/sample/99999 → 404"""
        response = await async_client.get("/api/v1/sample/99999")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    async def test_update_sample(self, async_client: AsyncClient):
        """PUT /api/v1/sample/{id} → 200, 업데이트된 데이터 반환"""
        # 데이터 생성
        create_resp = await async_client.post(
            "/api/v1/sample/", json={"name": "수정 전", "value": 10.0}
        )
        created_id = create_resp.json()["data"]["id"]

        # 수정
        update_payload = {"name": "수정 후", "value": 99.9}
        response = await async_client.put(
            f"/api/v1/sample/{created_id}", json=update_payload
        )

        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert body["success"] is True
        assert body["data"]["name"] == "수정 후"
        assert body["data"]["value"] == 99.9

    async def test_delete_sample(self, async_client: AsyncClient):
        """DELETE /api/v1/sample/{id} → 204"""
        # 데이터 생성
        create_resp = await async_client.post(
            "/api/v1/sample/", json={"name": "삭제 대상", "value": 0.0}
        )
        created_id = create_resp.json()["data"]["id"]

        # 삭제
        response = await async_client.delete(f"/api/v1/sample/{created_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # 삭제 확인
        get_resp = await async_client.get(f"/api/v1/sample/{created_id}")
        assert get_resp.status_code == status.HTTP_404_NOT_FOUND
