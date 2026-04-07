# 개발 가이드

> 새 도메인 추가, 코딩 규칙, DB 마이그레이션 등 개발 시 참고하는 실무 가이드

---

## 새 도메인 추가 (6단계)

### 1단계: 백엔드 모델 + 마이그레이션

```powershell
# 디렉토리 생성
New-Item -ItemType Directory -Force -Path server\app\domain\{name}\models, server\app\domain\{name}\schemas, server\app\domain\{name}\repositories, server\app\domain\{name}\calculators, server\app\domain\{name}\formatters
```

`server/app/domain/{name}/models/__init__.py`:
```python
from sqlalchemy import Column, Integer, String
from server.app.core.database import Base

class MyModel(Base):
    __tablename__ = "my_table"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
```

마이그레이션:
```powershell
.venv\Scripts\alembic revision --autogenerate -m "YYYY-MM-DD-add-my-table"
.venv\Scripts\alembic upgrade head
```

### 2단계: 백엔드 스키마

`server/app/domain/{name}/schemas/__init__.py`:
```python
from pydantic import BaseModel

class MyItemCreate(BaseModel):
    name: str

class MyItemResponse(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}
```

### 3단계: 백엔드 Repository + Service

Repository — DB CRUD만 담당:
```python
from server.app.shared.base import BaseRepository

class MyRepository(BaseRepository):
    async def find_all(self, session):
        ...
```

Service — 로직 오케스트레이션:
```python
from server.app.shared.base import BaseService

class MyService(BaseService):
    async def execute(self, session, **kwargs):
        repo = MyRepository()
        data = await repo.find_all(session)
        return self.success(data=data)
```

### 4단계: 백엔드 Router (API 엔드포인트)

`server/app/api/v1/endpoints/{name}.py`:
```python
from fastapi import APIRouter, Depends
from server.app.core.dependencies import get_db

router = APIRouter(prefix="/{name}", tags=["{Name}"])

@router.get("/")
async def get_list(db=Depends(get_db)):
    service = MyService()
    result = await service.execute(db)
    return ApiResponse.from_service_result(result)
```

`server/app/api/v1/router.py`에 등록:
```python
from .endpoints.{name} import router as {name}_router
api_router.include_router({name}_router)
```

### 5단계: 프론트엔드

```powershell
New-Item -ItemType Directory -Force -Path client\src\domains\{name}\components, client\src\domains\{name}\pages
```

파일 생성 순서:
1. `types.ts` — 타입 정의
2. `api.ts` — API 호출 함수 (`apiClient` 사용 필수)
3. `store.ts` — Zustand 스토어
4. `components/` — UI 컴포넌트
5. `pages/` — 라우팅 페이지

### 6단계: 라우트 등록

`client/src/App.tsx`:
```tsx
import { MyPage } from './domains/{name}/pages';

<Route path="/{name}" element={<MyPage />} />
```

> 참고 구현: `server/app/examples/sample_domain/` + `client/src/domains/sample/`

---

## 핵심 코딩 규칙

### 반드시 지켜야 할 것

| 규칙 | 설명 |
|------|------|
| 레이어드 아키텍처 | Router → Service → Repository 구조 파괴 금지 |
| 도메인 격리 | 도메인 간 통신은 Service/Repository 인터페이스로만 |
| apiClient 사용 | 프론트에서 직접 axios 호출 금지 |
| 타입 필수 | Python: 타입 힌트, TypeScript: `any` 금지 |
| Alembic 사용 | DB 스키마 변경 시 반드시 마이그레이션 |
| 표준 응답 래퍼 | 모든 API는 `ApiResponse[T]`로 응답 |
| 스키마 동기화 | 백엔드 스키마 수정 후 `make sdd-sync` 실행 |

### 마이그레이션 Append-only

- 기존 `alembic/versions/` 파일 수정 **절대 금지**
- 변경이 필요하면 새 마이그레이션 파일 생성
- 파일명 규칙: `YYYY-MM-DD-{description}`

---

## DB 마이그레이션 워크플로

```powershell
# 1. 모델 수정
#    server\app\domain\{name}\models\ 에서 ORM 모델 변경

# 2. 마이그레이션 파일 생성
.venv\Scripts\alembic revision --autogenerate -m "2026-03-26-add-user-table"

# 3. 생성된 파일 검토
#    alembic\versions\ 에서 방금 생성된 파일 확인

# 4. 마이그레이션 적용
.venv\Scripts\alembic upgrade head
```

---

## 프론트엔드 규칙

### API 호출

```typescript
// 올바른 방법 — apiClient 사용
import { apiClient } from '@/core/api';
const response = await apiClient.get('/api/v1/users');

// 금지 — 직접 axios 사용
import axios from 'axios';  // ❌
```

### 상태 관리

```
전역 상태   → core/store/     (useAuthStore, useToastStore)
도메인 상태 → domains/{name}/store.ts
컴포넌트 상태 → useState()    (로컬/일시 데이터만)
```

### 컴포넌트 설계

```
공통 재사용 UI → core/ui/           (Button, Card, DataTable...)
도메인 전용   → domains/{name}/components/
```

---

## 스키마 동기화 (SDD)

백엔드 스키마 변경 후 반드시 실행:

```powershell
# Git Bash 또는 make 설치된 환경에서:
make sdd-sync
```

이 명령은:
1. 백엔드 서버를 잠시 실행하여 OpenAPI JSON 생성
2. JSON에서 TypeScript 타입을 자동 생성
3. `client/src/types/api.generated.ts`에 저장

프론트엔드에서는 생성된 타입을 re-export하여 사용:
```typescript
// domains/{name}/types.ts
export type { MyItemResponse } from '@/types/api.generated';
```

---

## 코드 품질 체크

커밋 전 확인:

```powershell
# Git Bash 또는 make 설치된 환경에서:
make lint   # Python + TypeScript 전체 검사
make test   # pytest + 프론트 lint
```

| 도구 | 명령어 | 대상 |
|------|--------|------|
| black | `black --check .` | Python 포매팅 |
| isort | `isort --check .` | Python import 정렬 |
| ruff | `ruff check .` | Python 린팅 |
| mypy | `mypy .` | Python 타입 체크 |
| tsc | `tsc --noEmit` | TypeScript 타입 체크 |
| eslint | `eslint .` | TypeScript 린팅 |
