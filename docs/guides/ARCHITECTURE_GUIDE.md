# 프로젝트 아키텍처 가이드

> vibe-web-starter의 전체 설계 철학과 구조를 설명합니다.

---

## 설계 철학

1. **유지보수성 최우선** — 코드를 쓰는 시간보다 읽는 시간이 길다. 읽기 쉬운 구조를 우선한다.
2. **도메인 플러그인** — 새 기능을 추가할 때 기존 코드를 건드리지 않는다.
3. **레이어드 아키텍처** — 각 레이어의 책임을 명확히 분리한다.
4. **타입 안전성** — Python 타입 힌트 + TypeScript로 런타임 에러를 최소화한다.

---

## 전체 구조

```
┌─────────────────────────────────────────────────────┐
│                    클라이언트 (React 19)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Pages   │→ │Components│→ │ Zustand Store     │   │
│  └──────────┘  └──────────┘  └────────┬─────────┘   │
│                                       ↓              │
│                              ┌──────────────────┐   │
│                              │ API Module        │   │
│                              │ (apiClient)       │   │
│                              └────────┬─────────┘   │
└───────────────────────────────────────┼─────────────┘
                                        │ HTTP
┌───────────────────────────────────────┼─────────────┐
│                    서버 (FastAPI)       ↓              │
│  ┌──────────────────────────────────────────────┐   │
│  │ Router (엔드포인트) — HTTP 요청/응답만 담당      │   │
│  └────────────────────┬─────────────────────────┘   │
│                       ↓                              │
│  ┌──────────────────────────────────────────────┐   │
│  │ Service (비즈니스 로직 오케스트레이션)            │   │
│  │  ├→ Repository (DB 접근)                       │   │
│  │  ├→ Calculator (순수 계산 로직)                  │   │
│  │  └→ Formatter (응답 변환)                       │   │
│  └────────────────────┬─────────────────────────┘   │
│                       ↓                              │
│  ┌──────────────────────────────────────────────┐   │
│  │ Database (SQLite / PostgreSQL)                │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 백엔드 아키텍처

### 레이어별 책임

| 레이어 | 파일 위치 | 책임 | 금지 사항 |
|--------|----------|------|----------|
| **Router** | `api/v1/endpoints/` | HTTP 요청 수신, 응답 반환 | 비즈니스 로직, DB 접근 |
| **Service** | `domain/{name}/service.py` | 비즈니스 로직 오케스트레이션 | 직접 DB 쿼리, HTTP 응답 생성 |
| **Repository** | `domain/{name}/repositories/` | DB CRUD 연산 | 비즈니스 규칙 판단 |
| **Calculator** | `domain/{name}/calculators/` | 순수 계산 로직 | DB 접근, 외부 API 호출 |
| **Formatter** | `domain/{name}/formatters/` | 응답 데이터 변환 | DB 접근, 외부 API 호출 |

### 데이터 흐름

```
HTTP Request
  → Router: 요청 파싱, 인증 확인
    → Service.execute(): 비즈니스 로직 실행
      → Repository: DB에서 데이터 조회
      → Calculator: 비즈니스 규칙 적용
      → Formatter: 응답 형태로 변환
    ← ServiceResult[T]: 성공/실패 + 데이터
  ← ApiResponse[T]: 표준 응답 래퍼
HTTP Response
```

### 핵심 패턴

**Service (Facade 패턴)**
- `BaseService` 상속 필수
- `execute()` 메서드에서 Repository → Calculator → Formatter 순서로 호출
- 반환: `ServiceResult[T]` (성공/실패 + 데이터 + 메타데이터)

**Repository (Strategy 패턴)**
- `BaseRepository` 상속
- 데이터 소스(DB, API, File 등)를 추상화
- `AsyncSession` 사용 (비동기)

**Calculator / Formatter**
- 순수 함수 (Side-effect Zero)
- DB·외부 호출 절대 금지
- 단위 테스트 최우선 대상

### 도메인 디렉토리 구조

```
server/app/domain/{name}/
  models/           # SQLAlchemy ORM 모델
  schemas/          # Pydantic 요청/응답 스키마
  repositories/     # 데이터 접근 계층
  calculators/      # 순수 비즈니스 로직
  formatters/       # 응답 포맷 변환
  service.py        # 도메인 서비스
```

---

## 프론트엔드 아키텍처

### 데이터 흐름

```
Page → Components → Zustand Store → API Module → apiClient (Axios 싱글톤)
```

### 핵심 구조

| 영역 | 위치 | 역할 |
|------|------|------|
| **core/api** | `core/api/client.ts` | Axios 싱글톤, 인터셉터, 에러 처리 |
| **core/ui** | `core/ui/` | 공통 UI 컴포넌트 (Button, Card, DataTable 등) |
| **core/hooks** | `core/hooks/` | 공통 훅 (useApi, useDebounce, usePagination 등) |
| **core/store** | `core/store/` | 전역 상태 (Auth, Toast 등) |
| **domains** | `domains/{name}/` | 도메인별 기능 (백엔드 1:1 대응) |

### 상태 관리 전략

| 범위 | 도구 | 위치 | 예시 |
|------|------|------|------|
| 전역 | Zustand | `core/store/` | 인증, 토스트 |
| 도메인 | Zustand | `domains/{name}/store.ts` | 목록 데이터, 필터 |
| 컴포넌트 | useState | 컴포넌트 내부 | 모달 열림, 폼 값 |

### 도메인 디렉토리 구조

```
client/src/domains/{name}/
  types.ts          # TypeScript 타입 정의
  api.ts            # API 호출 함수
  store.ts          # Zustand 스토어
  components/       # 도메인 전용 UI
  pages/            # 라우팅 페이지
```

---

## 표준 응답 형식

모든 API 엔드포인트는 `ApiResponse[T]`로 래핑:

```json
{
  "success": true,
  "data": { ... },
  "message": "조회 성공",
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

---

## 스키마 동기화 (SDD)

백엔드 Pydantic 스키마가 **SSOT (Single Source of Truth)**:

```
백엔드 스키마 수정
  → make sdd-sync
    → OpenAPI JSON 자동 생성
    → TypeScript 타입 자동 생성 (api.generated.ts)
  → 프론트엔드에서 타입 import
```

---

## 디자인 시스템

`client/src/core/ui/`에 20개 공통 컴포넌트가 정의되어 있습니다.

| 컴포넌트 | 용도 |
|----------|------|
| Button, Input, Select | 기본 폼 요소 |
| Card, Modal, Tabs | 레이아웃 |
| Badge, Avatar, StatCard | 데이터 표현 |
| DataTable, Pagination | 목록 |
| Toast, ConfirmDialog | 피드백 |
| Skeleton, EmptyState | 상태 표현 |
| Breadcrumb, ProgressBar | 네비게이션 |

쇼케이스: http://localhost:5173/design-system

---

## 참고 구현

새 도메인을 추가할 때 아래 예시를 참고하세요:

- 백엔드: `server/app/examples/sample_domain/`
- 프론트엔드: `client/src/domains/sample/`
