# SDD (Schema-Driven Development) 가이드

> Pydantic 스키마 하나만 수정하면 프론트엔드 타입이 자동으로 따라온다.

## SDD란?

**Schema-Driven Development**는 백엔드의 데이터 스키마를 **Single Source of Truth(SSOT)**로 삼아,
API 문서와 프론트엔드 타입을 자동 생성하는 개발 방법론입니다.

### 기존 방식 (수동)

```
Pydantic 스키마 수정 → 수동으로 TypeScript 타입 복사 → 빠뜨리면 버그
```

### SDD 방식 (자동)

```
Pydantic 스키마 수정 → make sdd-sync → TypeScript 타입 자동 갱신 → 불일치 불가능
```

---

## 핵심 구조

```
[1] Pydantic 스키마 (SSOT)
    server/app/domain/{name}/schemas/__init__.py
         │
         ▼
[2] OpenAPI JSON (자동 추출)
    client/src/types/openapi.json
         │
         ▼
[3] TypeScript 타입 (자동 생성)
    client/src/types/api.generated.ts
         │
         ▼
[4] 도메인 타입 (re-export)
    client/src/domains/{name}/types.ts
```

---

## 일일 워크플로

### 백엔드 스키마를 수정했을 때

```bash
# 1. Pydantic 스키마 수정
#    server/app/domain/sample/schemas/__init__.py

# 2. 타입 동기화 (한 줄이면 끝)
make sdd-sync

# 3. 프론트엔드에서 바로 사용 (타입 자동 반영)
```

### 새 도메인을 추가했을 때

```bash
# 1. 백엔드 도메인 생성 (모델, 스키마, 서비스, 엔드포인트)
# 2. make sdd-sync 실행
# 3. 프론트엔드 types.ts에서 자동 생성 타입 re-export

# 예시: client/src/domains/payment/types.ts
import type { components } from '@/types/api.generated';
export type Payment = components['schemas']['PaymentResponse'];
export type PaymentCreate = components['schemas']['PaymentCreate'];
```

---

## 표준 API 응답 래퍼

모든 API는 `ApiResponse[T]` 래퍼로 응답합니다.

### 백엔드 (Python)

```python
from server.app.shared.types import ApiResponse

@router.get("/", response_model=ApiResponse[list[ItemResponse]])
async def list_items(db=Depends(get_database_session)):
    service = ItemService(db)
    items = await service.get_all()
    return ApiResponse.ok(data=items)
```

### 프론트엔드 (TypeScript)

```typescript
import type { ApiResponse } from '@/core/api/types';

export async function fetchItems(): Promise<Item[]> {
  const response = await apiClient.get<ApiResponse<Item[]>>('/v1/items/');
  return response.data.data ?? [];
}
```

### 응답 구조

```json
// 성공
{
  "success": true,
  "data": { ... },
  "message": null,
  "error": null
}

// 실패
{
  "success": false,
  "data": null,
  "message": null,
  "error": "에러 메시지"
}
```

---

## Pydantic 스키마 작성 규칙

SDD에서 스키마 품질이 곧 문서 품질입니다. 다음을 준수하세요:

### 1. 모든 필드에 description 추가

```python
name: str = Field(
    ...,
    description="데이터 이름 (1~255자)",  # ← OpenAPI 문서 + TS JSDoc에 반영
    min_length=1,
    max_length=255,
)
```

### 2. model_config에 examples 추가

```python
class ItemCreate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [{
                "name": "매출 데이터",
                "value": 1500000.0,
            }]
        }
    )
```

### 3. Response 스키마에 from_attributes=True

```python
class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    # ORM 모델 → Pydantic 자동 변환
```

---

## 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `make sdd-sync` | OpenAPI 추출 → TS 타입 생성 (가장 많이 사용) |
| `python scripts/export_openapi.py` | OpenAPI JSON만 추출 |
| `cd client && npm run generate:types` | TS 타입만 생성 |
| `cd client && npm run sdd:sync` | npm에서 직접 실행 |

---

## FAQ

### Q: 서버를 실행해야 하나요?
**A: 아니요.** `export_openapi.py`가 서버 없이 FastAPI 앱에서 직접 스키마를 추출합니다.

### Q: 자동 생성된 파일을 직접 수정해도 되나요?
**A: 안 됩니다.** `api.generated.ts`와 `openapi.json`은 `make sdd-sync`를 실행하면 덮어씌워집니다.
커스텀 타입이 필요하면 `domains/{name}/types.ts`에서 re-export하며 추가하세요.

### Q: 타입이 안 맞는 것 같아요.
**A:** `make sdd-sync`를 다시 실행하세요. 백엔드 스키마와 프론트 타입이 항상 동기화됩니다.
