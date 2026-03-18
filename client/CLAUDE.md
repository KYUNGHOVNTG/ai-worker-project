# 프론트엔드 개발 지침 (React 19 + TypeScript + Tailwind CSS 4)

## 아키텍처 흐름

```
Page → Components → Zustand Store → API Module → apiClient (Axios 싱글톤)
```

## 디렉토리 구조

```
client/src/
  core/           # 인프라 (공유 컴포넌트·훅·레이아웃)
    api/          # Axios 싱글톤, 공통 타입
    errors/       # ErrorBoundary, ErrorFallback
    loading/      # LoadingOverlay, LoadingManager
    hooks/        # useApi, useDebounce
    layout/       # MainLayout, Header, Sidebar
    store/        # 전역 상태 (useAuthStore)
    ui/           # 재사용 UI (Button, Card, Input, Modal)
  domains/{name}/ # 도메인별 기능 (백엔드 1:1 대응)
    types.ts      # TypeScript 타입 정의
    api.ts        # API 호출 함수
    store.ts      # Zustand 도메인 스토어
    components/   # 도메인 전용 컴포넌트
    pages/        # 라우팅 페이지
  types/          # 전역 타입
```

## 핵심 규칙

### API 호출
- **반드시** `core/api/client.ts`의 `apiClient` 사용 (직접 axios 금지)
- 도메인별 API 함수는 `domains/{name}/api.ts`에 정의

### 상태 관리 (Zustand)
- **전역 상태**: `core/store/` (Auth, Theme 등)
- **도메인 상태**: `domains/{name}/store.ts`
- **컴포넌트 상태**: `useState()` (로컬/일시 데이터만)

### 스타일링 (Tailwind CSS 4)
- 인라인 `style` 금지 — Tailwind 클래스 사용
- 조건부 클래스: `cn()` 유틸 사용
- 커스텀 디자인 토큰: `tailwind.config.js`에서 확장

### 컴포넌트 설계
- React 19 함수형 컴포넌트만 사용
- `any` 타입 절대 금지 — 구체적 타입 정의
- 재사용 가능 UI → `core/ui/`, 도메인 전용 → `domains/{name}/components/`

## 새 도메인 추가 순서

1. `types.ts` — 타입 정의
2. `api.ts` — API 호출 함수
3. `store.ts` — Zustand 스토어
4. `components/` — UI 컴포넌트
5. `pages/` — 라우팅 페이지
6. `App.tsx` — 라우트 등록
7. 참고: `domains/sample/` 예시

## 코드 스타일

- ESLint 설정 준수, `tsc --noEmit`으로 타입 체크
- 상세: `README.md` 참조
