# 디자인시스템 구현 로드맵

> 작성일: 2026-03-26
> 메뉴명: 디자인시스템
> 도메인명: design-system
> 프론트 경로: `/design-system`
> API 경로: 없음 (프론트엔드 전용)
> 산출물: `docs/specs/design-system/`

---

## 수집된 요구사항

MNS_PMS 프로젝트(`D:\cursorAI\MNS_PMS\client\src\core\`)의 디자인시스템을 현재 프로젝트에 이식한다.
단, 동일 복제가 아니라 **이 프로젝트 고유의 디자인 톤**을 적용한다.

### 디자인 차별화 방향

| 구분 | MNS_PMS (원본) | vibe-web-starter-2 (이 프로젝트) |
|------|---------------|--------------------------------|
| Brand 컬러 | Blue (`#3b82f6`) | **Indigo** (`#4f46e5`) |
| Primary 버튼 | `bg-slate-900` | `bg-indigo-600 hover:bg-indigo-700` |
| Focus ring | `ring-brand-500/20` | `ring-indigo-500/20` |
| @theme 토큰명 | `--color-brand-*` (Blue) | `--color-brand-*` (**Indigo**) |
| prose 링크 색 | `#2563eb` (Blue 600) | `#4f46e5` (Indigo 600) — 기존 유지 |
| bg-mesh 그라데이션 | Blue 계열 | Indigo/Violet 계열 — 기존 유지 |

> **원칙**: 컴포넌트 구조·로직은 원본 그대로, 색상 토큰만 Indigo 계열로 치환.
> 원본에서 `brand-*` 토큰을 사용하므로 CSS `@theme`의 brand 값만 Indigo로 정의하면 자동 반영됨.

### 이식 대상 목록

**UI 컴포넌트 (20개)**
- 교체: Button, Card, Input, Modal (기존 대비 기능 추가)
- 신규: Badge, Select, StatCard, ProgressBar, Avatar, DataTable, Pagination, Skeleton(5종), ConfirmDialog, EmptyState, Breadcrumb, Tabs, Toast, ToastContainer, YearSelect

**훅 (3개)**: useConfirm, usePagination, useTableFilter

**유틸 (3개)**: formatters.ts, exportExcel.ts, toast.ts (교체)

**스토어 (1개)**: useToastStore.ts

**쇼케이스**: DesignSystemPage.tsx + 라우트 등록

**인프라**: CSS 토큰, Tailwind 설정, 의존성, App.tsx 전역 마운트

---

## 현재 코드베이스 상태

| 영역 | 상태 |
|------|------|
| `client/src/core/ui/` | Button, Card, Input, Modal, index.ts 있음 (교체 필요) |
| `client/src/core/hooks/` | useApi, useDebounce, index.ts 있음 (훅 3개 추가 필요) |
| `client/src/core/utils/` | toast.ts 있음 (교체 필요, formatters·exportExcel 추가) |
| `client/src/core/store/` | useAuthStore, index.ts 있음 (useToastStore 추가 필요) |
| `client/src/domains/design-system/` | 없음 (신규 생성) |
| `client/tailwind.config.js` | 빈 extend (slide-in 애니메이션 추가 필요) |
| `client/src/index.css` | Noto Sans KR, prose, bg-mesh 있음 (@theme brand 토큰 추가 필요) |
| 의존성 | framer-motion, zustand, lucide-react 설치됨 / **xlsx 미설치** |

---

## DB 마이그레이션 필요 항목

없음 (프론트엔드 전용 작업)

---

## 전체 Task 요약 및 실행 순서

| # | Task | 설명 | 추천 모델 | 상태 |
|---|------|------|----------|------|
| 1 | 인프라 셋업 | CSS 토큰, Tailwind 설정, 의존성 설치 | Sonnet 4.6 | ✅ |
| 2 | 기존 UI 컴포넌트 교체 | Button, Card, Input, Modal 업데이트 | Sonnet 4.6 | ✅ |
| 3 | 핵심 UI 컴포넌트 추가 (1) | Badge, Select, StatCard, ProgressBar, Avatar | Sonnet 4.6 | ✅ |
| 4 | 핵심 UI 컴포넌트 추가 (2) | DataTable, Pagination, Skeleton | Sonnet 4.6 | ✅ |
| 5 | 상호작용 UI 컴포넌트 | Toast, ToastContainer, ConfirmDialog, EmptyState, Breadcrumb, Tabs, YearSelect | Sonnet 4.6 | ✅ |
| 6 | 훅 + 유틸 + 스토어 | useConfirm, usePagination, useTableFilter, formatters, exportExcel, toast 교체, useToastStore | Sonnet 4.6 | ⬜ |
| 7 | index 배럴 업데이트 + 전역 마운트 | core/ui/index.ts, core/hooks/index.ts, core/store/index.ts, App.tsx | Sonnet 4.6 | ⬜ |
| 8 | 쇼케이스 페이지 + 라우트 | DesignSystemPage.tsx 생성, App.tsx 라우트 등록 | Opus 4.6 | ⬜ |

상태: ⬜ 대기 / 🔄 진행중 / ✅ 완료

---

## Task 1: 인프라 셋업

**추천 모델**: `claude-sonnet-4-6`
> CSS 토큰과 설정 파일 수정, 구조적 반복 작업

**작업 목표**
디자인 시스템의 기반이 되는 CSS 토큰, Tailwind 설정, npm 의존성을 준비한다.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 수정 | `client/src/index.css` |
| 수정 | `client/tailwind.config.js` |
| 실행 | `cd client && npm install xlsx` |

**상세 작업**

1. **`client/src/index.css`** — `@import "tailwindcss";` 바로 아래에 `@theme` 블록 추가:
   ```css
   @theme {
     --color-brand-50: #eef2ff;
     --color-brand-100: #e0e7ff;
     --color-brand-200: #c7d2fe;
     --color-brand-300: #a5b4fc;
     --color-brand-400: #818cf8;
     --color-brand-500: #6366f1;
     --color-brand-600: #4f46e5;
     --color-brand-700: #4338ca;
     --color-brand-800: #3730a3;
     --color-brand-900: #312e81;
   }
   ```
   > **Indigo 계열** (MNS_PMS는 Blue). Tailwind의 indigo 팔레트 값을 brand 토큰으로 등록.

2. **`client/src/index.css`** — body 아래에 `.card-hover` 유틸 클래스 추가:
   ```css
   .card-hover {
     transition: transform 0.2s ease, box-shadow 0.2s ease;
   }
   .card-hover:hover {
     transform: translateY(-2px);
     box-shadow: 0 6px 24px rgba(0,0,0,0.06);
   }
   ```

3. **`client/tailwind.config.js`** — slide-in 애니메이션 추가 (Toast에서 사용):
   ```js
   theme: {
     extend: {
       keyframes: {
         'slide-in': {
           '0%': { opacity: '0', transform: 'translateX(100%)' },
           '100%': { opacity: '1', transform: 'translateX(0)' },
         },
       },
       animation: {
         'slide-in': 'slide-in 0.25s ease-out',
       },
     },
   },
   ```

4. **xlsx 패키지 설치**: `cd client && npm install xlsx`

**완료 기준**
- [ ] `@theme` 블록에 brand-50 ~ brand-900 (Indigo 계열) 정의됨
- [ ] `.card-hover` 클래스가 index.css에 존재
- [ ] tailwind.config.js에 slide-in 키프레임/애니메이션 정의됨
- [ ] `xlsx` 패키지가 client/package.json dependencies에 추가됨
- [ ] `npm run build` 또는 dev 서버 정상 기동 확인

**검수 체크리스트**
- [ ] 기존 .prose, .bg-mesh 스타일 깨지지 않음
- [ ] @theme 토큰이 Tailwind 4 문법에 맞게 작성됨
- [ ] 기존 파일의 의도치 않은 변경 없음

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `client/src/index.css` (수정 — @theme brand 토큰, .card-hover 추가)
  - `client/tailwind.config.js` (수정 — slide-in 키프레임/애니메이션 추가)
  - `client/package.json` (수정 — xlsx 의존성 추가)
- **커밋**: `2306847` — [SDD] 디자인시스템 - Task 1: 인프라 셋업
- **다음 태스크 참고사항**:
  - brand-* 토큰이 Indigo 계열로 정의됨 → 컴포넌트에서 `brand-600` 사용 시 `#4f46e5` (Indigo 600) 적용
  - `.card-hover` 클래스가 CSS에 정의됨 → Card hover prop에서 사용 가능
  - `animate-slide-in` 클래스가 Tailwind에 등록됨 → Toast 컴포넌트에서 사용 가능
- **미해결 이슈**: 없음

---

## Task 2: 기존 UI 컴포넌트 교체

**추천 모델**: `claude-sonnet-4-6`
> 기존 파일 덮어쓰기, 패턴 반복

**작업 목표**
기존 Button, Card, Input, Modal을 MNS_PMS 버전 기반으로 교체한다. 디자인은 Indigo 톤 적용.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 교체 | `client/src/core/ui/Button.tsx` |
| 교체 | `client/src/core/ui/Card.tsx` |
| 교체 | `client/src/core/ui/Input.tsx` |
| 교체 | `client/src/core/ui/Modal.tsx` |

**상세 작업 — 디자인 차별화**

1. **Button.tsx** — MNS_PMS 소스 기반이되, primary variant를 Indigo 톤으로:
   - `bg-slate-900` → `bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800`
   - outline: `text-brand-600 border-brand-300 hover:bg-brand-50` → `text-indigo-600 border-indigo-300 hover:bg-indigo-50`
   - `danger` variant 추가 (원본에는 없지만 ConfirmDialog에서 custom className으로 처리하므로 선택사항)
   - `framer-motion` 제거 (MNS_PMS에서 이미 제거됨), `Loader2` 사용

2. **Card.tsx** — MNS_PMS 소스 그대로 이식:
   - `hover` prop 추가
   - `motion` 애니메이션 제거 (MNS_PMS에서 이미 제거됨)
   - shadow 스타일: `shadow-[0_2px_12px_rgba(0,0,0,0.03)]`

3. **Input.tsx** — MNS_PMS 소스 기반, brand → indigo:
   - `focus:ring-brand-500/20 focus:border-brand-500` 사용 (brand = indigo @theme)
   - `border-slate-200` 기본

4. **Modal.tsx** — MNS_PMS 소스 기반:
   - `title`, `showCloseButton` prop 추가
   - `createPortal` 제거, `X` 아이콘 닫기 버튼
   - 기존 LandingPage의 DocumentViewer가 Modal을 사용하지 않으므로 하위호환 문제 없음

**완료 기준**
- [ ] Button에 `isLoading` prop 동작, primary가 indigo 계열
- [ ] Card에 `hover` prop 동작 (card-hover 클래스 적용)
- [ ] Input에 brand 포커스 링 동작, error/helperText 표시
- [ ] Modal에 `title` prop 동작, `showCloseButton` 제어 가능
- [ ] 기존 SamplePage에서 사용하는 Button/Card/Input/Modal이 깨지지 않음

**주의사항**
- SamplePage가 기존 Button/Card/Input을 사용 중일 수 있으므로 props 하위호환성 확인
- `framer-motion`은 Modal의 AnimatePresence만 유지, Button/Card에서는 제거

**검수 체크리스트**
- [ ] 타입 힌트 누락 없음
- [ ] 기존 파일의 의도치 않은 변경 없음
- [ ] 하위 호환성 검증 (SamplePage 동작 확인)

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `client/src/core/ui/Button.tsx` (교체 — motion 제거, Loader2, indigo primary, danger variant)
  - `client/src/core/ui/Card.tsx` (교체 — hover prop 추가, motion 제거, 새 shadow)
  - `client/src/core/ui/Input.tsx` (교체 — brand 포커스 링, rounded-xl, 새 padding)
  - `client/src/core/ui/Modal.tsx` (교체 — title/showCloseButton prop, createPortal 제거)
- **커밋**: `27ba7d9` — [SDD] 디자인시스템 - Task 2: 기존 UI 컴포넌트 교체
- **다음 태스크 참고사항**:
  - Button에서 `framer-motion` 의존성 제거됨 (Loader2 아이콘으로 대체)
  - Card에서 `motion` 제거됨 → 렌더링 즉시 표시 (진입 애니메이션 없음)
  - Modal에서 `createPortal` 제거됨 → AnimatePresence 직접 렌더링
  - Input의 focus ring이 `brand-500` 토큰 사용 → Indigo 자동 반영
  - SamplePage 하위호환성 확인 완료 (기존 props 모두 유지)
- **미해결 이슈**: 없음

---

## Task 3: 핵심 UI 컴포넌트 추가 (1)

**추천 모델**: `claude-sonnet-4-6`
> 독립적 컴포넌트, 패턴 반복

**작업 목표**
Badge, Select, StatCard, ProgressBar, Avatar 컴포넌트를 추가한다.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 생성 | `client/src/core/ui/Badge.tsx` |
| 생성 | `client/src/core/ui/Select.tsx` |
| 생성 | `client/src/core/ui/StatCard.tsx` |
| 생성 | `client/src/core/ui/ProgressBar.tsx` |
| 생성 | `client/src/core/ui/Avatar.tsx` |

**상세 작업 — 디자인 차별화**

1. **Badge** — MNS_PMS 그대로 (시맨틱 컬러 사용, brand 직접 사용 없음)
2. **Select** — `brand-500` 토큰 사용 → @theme에서 Indigo로 자동 반영
   - 드롭다운 패널: rounded-2xl, shadow 스타일 유지
3. **StatCard** — brand 컬러가 @theme Indigo로 자동 반영
   - `card-hover` 클래스 사용 (Task 1에서 추가됨)
4. **ProgressBar** — 그대로 (emerald/brand/amber 자동 색상)
5. **Avatar** — 그대로 (COLOR_POOL에 brand 포함, @theme으로 Indigo 반영)

**완료 기준**
- [ ] 각 컴포넌트가 `client/src/core/ui/` 에 생성됨
- [ ] TypeScript 타입 완전 정의 (any 없음)
- [ ] 각 컴포넌트 독립 import 가능

**검수 체크리스트**
- [ ] 타입 힌트 누락 없음
- [ ] lucide-react 아이콘 import 정확
- [ ] 기존 파일의 의도치 않은 변경 없음

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `client/src/core/ui/Badge.tsx` (생성)
  - `client/src/core/ui/Select.tsx` (생성)
  - `client/src/core/ui/StatCard.tsx` (생성)
  - `client/src/core/ui/ProgressBar.tsx` (생성)
  - `client/src/core/ui/Avatar.tsx` (생성)
- **커밋**: `16ff038` — [SDD] 디자인시스템 - Task 3: 핵심 UI 컴포넌트 추가 (1)
- **다음 태스크 참고사항**:
  - Select가 `brand-500` 토큰 사용 → Indigo 자동 반영
  - StatCard가 `card-hover` CSS 클래스 사용 (Task 1에서 추가됨)
  - ProgressBar 50~79% 구간이 `brand-500` 사용
  - Avatar COLOR_POOL에 `brand-100/brand-700` 포함
- **미해결 이슈**: 없음

---

## Task 4: 핵심 UI 컴포넌트 추가 (2)

**추천 모델**: `claude-sonnet-4-6`
> DataTable은 복잡하지만 원본 소스 복사 기반

**작업 목표**
DataTable, Pagination, Skeleton(5종) 컴포넌트를 추가한다.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 생성 | `client/src/core/ui/DataTable.tsx` |
| 생성 | `client/src/core/ui/Pagination.tsx` |
| 생성 | `client/src/core/ui/Skeleton.tsx` |

**상세 작업**

1. **DataTable** — MNS_PMS 소스 기반:
   - `columns`, `data`, `pagination`, `exportConfig`, `rowClassName`, `sort/onSortChange` prop
   - 내부 정렬 + 외부 제어 모드 이중 지원
   - `../utils/exportExcel` import (Task 6에서 생성 — **import 경로만 맞추고, Task 6 완료 전까지는 exportConfig 미사용**)
   - Pagination 컴포넌트 import

2. **Pagination** — MNS_PMS 소스 기반:
   - 처음/이전/번호(최대5)/다음/끝 네비게이션
   - 건수 선택 드롭다운
   - `brand-500` 토큰 사용 → Indigo 자동 반영

3. **Skeleton** — 5종: Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonStatCard
   - 모두 `animate-pulse` 기반

**주의사항**
- DataTable이 `../utils/exportExcel`을 import하는데, 해당 파일은 Task 6에서 생성됨
- **해결**: Task 4에서 DataTable 생성 시 exportExcel import를 포함하되, Task 6 이전에는 빌드 시 에러 가능 → Task 4~6을 같은 세션에서 연속 실행 권장

**완료 기준**
- [ ] DataTable이 columns/data로 테이블 렌더링
- [ ] Pagination이 페이지 번호 네비게이션 동작
- [ ] Skeleton 5종이 각각 다른 레이아웃의 로딩 UI 제공

**검수 체크리스트**
- [ ] 타입 힌트 누락 없음
- [ ] TableColumn 타입이 generic `<T>` 지원
- [ ] 기존 파일의 의도치 않은 변경 없음

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `client/src/core/ui/DataTable.tsx` (생성)
  - `client/src/core/ui/Pagination.tsx` (생성)
  - `client/src/core/ui/Skeleton.tsx` (생성)
  - `client/src/core/utils/exportExcel.ts` (생성 — DataTable 의존성으로 선행 생성)
- **커밋**: `fe24731` — [SDD] 디자인시스템 - Task 4: 핵심 UI 컴포넌트 추가 (2)
- **다음 태스크 참고사항**:
  - exportExcel.ts가 이미 생성됨 → Task 6에서 다시 생성할 필요 없음
  - DataTable의 `ExportConfig` 타입은 exportExcel.ts에서 export
  - Pagination의 `PaginationProps` 타입은 Pagination.tsx에서 export
- **미해결 이슈**: 없음

---

## Task 5: 상호작용 UI 컴포넌트

**추천 모델**: `claude-sonnet-4-6`
> Toast/ConfirmDialog는 Zustand store 연동, 원본 소스 기반 작업

**작업 목표**
Toast 시스템, ConfirmDialog, EmptyState, Breadcrumb, Tabs, YearSelect를 추가한다.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 생성 | `client/src/core/ui/Toast.tsx` |
| 생성 | `client/src/core/ui/ToastContainer.tsx` |
| 생성 | `client/src/core/ui/ConfirmDialog.tsx` |
| 생성 | `client/src/core/ui/EmptyState.tsx` |
| 생성 | `client/src/core/ui/Breadcrumb.tsx` |
| 생성 | `client/src/core/ui/Tabs.tsx` |
| 생성 | `client/src/core/ui/YearSelect.tsx` |

**상세 작업**

1. **Toast + ToastContainer** — MNS_PMS 기반:
   - `useToastStore` 연동 (Task 6에서 생성 — 함께 세션 실행 권장)
   - border-left 컬러: emerald/rose/amber/brand
   - `animate-slide-in` 사용 (Task 1 tailwind 설정)
   - 3초 자동 dismiss, 최대 5개 스택

2. **ConfirmDialog** — MNS_PMS 기반:
   - Zustand store 내장 (`useConfirmStore` export)
   - danger/warning/default 3종 variant
   - Modal 컴포넌트 사용
   - danger 버튼: `bg-rose-600` (brand 대신 rose 직접 사용)

3. **EmptyState** — MNS_PMS 그대로 (lucide 아이콘 사용)
4. **Breadcrumb** — MNS_PMS 기반 (`react-router-dom` Link 사용, `useBreadcrumbStore` 포함)
5. **Tabs** — MNS_PMS 기반 (`brand-700`/`brand-600` → Indigo 자동 반영)
6. **YearSelect** — MNS_PMS 기반 (Select 컴포넌트 재사용)

**주의사항**
- Toast.tsx가 `../store/useToastStore`를 import → Task 6과 동일 세션 권장
- ConfirmDialog가 Modal, Button을 import → Task 2 완료 후 실행

**완료 기준**
- [ ] ToastContainer가 `fixed top-4 right-4`에 렌더링
- [ ] ConfirmDialog가 `useConfirmStore.open()`으로 Promise 반환
- [ ] EmptyState 3종 variant (default/search/error) 동작
- [ ] Breadcrumb이 react-router-dom Link로 네비게이션
- [ ] Tabs이 activeTab 기반 콘텐츠 전환
- [ ] YearSelect가 현재 연도까지 옵션 자동 생성

**검수 체크리스트**
- [ ] 타입 힌트 누락 없음
- [ ] Zustand store 패턴 일관성 (create 사용)
- [ ] 기존 파일의 의도치 않은 변경 없음

### 완료 기록

- **완료일**: 2026-03-26
- **변경 파일**:
  - `client/src/core/ui/Toast.tsx` (생성)
  - `client/src/core/ui/ToastContainer.tsx` (생성)
  - `client/src/core/ui/ConfirmDialog.tsx` (생성)
  - `client/src/core/ui/EmptyState.tsx` (생성)
  - `client/src/core/ui/Breadcrumb.tsx` (생성)
  - `client/src/core/ui/Tabs.tsx` (생성)
  - `client/src/core/ui/YearSelect.tsx` (생성)
  - `client/src/core/store/useToastStore.ts` (생성 — Toast 의존성으로 선행 생성)
- **커밋**: TBD
- **다음 태스크 참고사항**:
  - useToastStore가 이미 생성됨 → Task 6에서 다시 생성할 필요 없음
  - ConfirmDialog의 `useConfirmStore`가 export됨 → useConfirm 훅에서 import
  - Breadcrumb의 `useBreadcrumbStore`, `useBreadcrumb`이 export됨
- **미해결 이슈**: 없음

---

## Task 6: 훅 + 유틸 + 스토어

**추천 모델**: `claude-sonnet-4-6`
> 유틸리티 함수와 훅, 패턴 반복

**작업 목표**
커스텀 훅 3개, 유틸 함수 2개, toast.ts 교체, useToastStore 추가.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 생성 | `client/src/core/hooks/useConfirm.ts` |
| 생성 | `client/src/core/hooks/usePagination.ts` |
| 생성 | `client/src/core/hooks/useTableFilter.ts` |
| 생성 | `client/src/core/utils/formatters.ts` |
| 생성 | `client/src/core/utils/exportExcel.ts` |
| 교체 | `client/src/core/utils/toast.ts` |
| 생성 | `client/src/core/store/useToastStore.ts` |

**상세 작업**

1. **useConfirm** — `useConfirmStore`에서 `open` 가져와서 Promise 반환
2. **usePagination** — page/pageSize 상태 + `paginationProps(total)` 헬퍼
3. **useTableFilter** — generic 필터 상태 + `useDebounce` 연동
4. **formatters.ts** — formatDate, formatDateShort, formatDateTime, formatDateRange, formatCurrency, formatNumber, formatPercent, formatEmpNo
5. **exportExcel.ts** — `xlsx` 기반 exportToExcel 함수
6. **toast.ts** — `alert()` 기반 → `useToastStore.getState().addToast()` 기반으로 교체
7. **useToastStore** — `ToastItem[]` 관리, `addToast`, `removeToast`, 최대 5개

**주의사항**
- useConfirm이 `../ui/ConfirmDialog`의 `useConfirmStore`를 import → Task 5 완료 후 실행
- toast.ts가 `useToastStore`를 import → 같은 Task 내에서 useToastStore 먼저 생성
- **기존 `core/hooks/useDebounce.ts`는 이미 존재하므로 건드리지 않음**

**완료 기준**
- [ ] `useConfirm()` 호출 시 ConfirmDialog가 열리고 boolean Promise 반환
- [ ] `usePagination()` 이 page/pageSize 상태 관리
- [ ] `useTableFilter()` 이 필터 즉시반영 + debounced 값 제공
- [ ] `formatCurrency(1234567)` → `"1,234,567원"`
- [ ] `exportToExcel()` 호출 시 .xlsx 파일 다운로드
- [ ] `toast.success('msg')` 호출 시 Toast UI 표시 (alert 아님)

**검수 체크리스트**
- [ ] 타입 힌트 누락 없음
- [ ] 기존 useDebounce, useApi 훅 변경 없음
- [ ] toast.ts 교체 후 기존 호출부(App.tsx 등) 동작 확인

### 완료 기록 (태스크 완료 후 작성)

- **완료일**: -
- **변경 파일**: -
- **커밋**: -
- **다음 태스크 참고사항**: -
- **미해결 이슈**: -

---

## Task 7: index 배럴 업데이트 + 전역 마운트

**추천 모델**: `claude-sonnet-4-6`
> 간단한 export 추가와 App.tsx 수정

**작업 목표**
모든 컴포넌트/훅/유틸의 배럴 export를 업데이트하고, ToastContainer·ConfirmDialog를 App.tsx에 전역 마운트한다.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 수정 | `client/src/core/ui/index.ts` |
| 수정 | `client/src/core/hooks/index.ts` |
| 수정 | `client/src/core/store/index.ts` |
| 생성 | `client/src/core/utils/index.ts` |
| 수정 | `client/src/App.tsx` |

**상세 작업**

1. **`core/ui/index.ts`** — Task 2~5에서 추가된 모든 컴포넌트 export:
   ```ts
   export { Button } from './Button';
   export { Card, CardHeader, CardBody, CardFooter } from './Card';
   export { Input } from './Input';
   export { Modal } from './Modal';
   export { Badge } from './Badge';
   export { StatCard } from './StatCard';
   export { ProgressBar } from './ProgressBar';
   export { Avatar } from './Avatar';
   export { DataTable } from './DataTable';
   export type { TableColumn } from './DataTable';
   export { Select } from './Select';
   export { ToastContainer } from './ToastContainer';
   export { Pagination } from './Pagination';
   export type { PaginationProps } from './Pagination';
   export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonStatCard } from './Skeleton';
   export { ConfirmDialog } from './ConfirmDialog';
   export { EmptyState } from './EmptyState';
   export { Breadcrumb, useBreadcrumb, useBreadcrumbStore } from './Breadcrumb';
   export type { BreadcrumbItem, BreadcrumbProps } from './Breadcrumb';
   export { Tabs } from './Tabs';
   export type { TabItem } from './Tabs';
   export { YearSelect } from './YearSelect';
   ```

2. **`core/hooks/index.ts`** — 훅 3개 추가:
   ```ts
   export { useApi } from './useApi';
   export { useDebounce } from './useDebounce';
   export { useConfirm } from './useConfirm';
   export { usePagination } from './usePagination';
   export { useTableFilter } from './useTableFilter';
   ```

3. **`core/store/index.ts`** — useToastStore 추가
4. **`core/utils/index.ts`** — 유틸 배럴 export 생성
5. **`App.tsx`** — `<ToastContainer />` 와 `<ConfirmDialog />`를 루트에 마운트:
   - `<ToastContainer />`는 App 컴포넌트 return 최상단에 추가
   - `<ConfirmDialog />`는 ToastContainer 바로 아래 추가

**완료 기준**
- [ ] `import { Button, Badge, DataTable, ... } from '@/core/ui'` 동작
- [ ] `import { useConfirm, usePagination } from '@/core/hooks'` 동작
- [ ] `import { toast, formatCurrency } from '@/core/utils'` 동작
- [ ] App.tsx에서 ToastContainer, ConfirmDialog 전역 렌더링
- [ ] `npm run build` (또는 `tsc --noEmit`) 에러 없음

**검수 체크리스트**
- [ ] 기존 import 경로 깨지지 않음
- [ ] App.tsx 기존 라우트(/, /sample) 동작 유지
- [ ] TypeScript 타입 누락 없음
- [ ] 기존 파일의 의도치 않은 변경 없음

### 완료 기록 (태스크 완료 후 작성)

- **완료일**: -
- **변경 파일**: -
- **커밋**: -
- **다음 태스크 참고사항**: -
- **미해결 이슈**: -

---

## Task 8: 쇼케이스 페이지 + 라우트

**추천 모델**: `claude-opus-4-6`
> 1200줄 규모의 쇼케이스 페이지. 모든 컴포넌트를 조합하는 통합 작업이므로 Opus 권장.

**작업 목표**
MNS_PMS의 DesignSystemPage를 기반으로 이 프로젝트용 쇼케이스 페이지를 생성하고, 라우트에 등록한다.

**작업 범위**

| 작업 | 파일 경로 |
|------|-----------|
| 생성 | `client/src/domains/design-system/pages/DesignSystemPage.tsx` |
| 생성 | `client/src/domains/design-system/pages/index.ts` |
| 생성 | `client/src/domains/design-system/index.ts` |
| 수정 | `client/src/App.tsx` |

**상세 작업**

1. **DesignSystemPage.tsx** — MNS_PMS 기반이되 차별화:
   - 페이지 제목: "디자인 시스템" → "vibe-web-starter 디자인 시스템" 또는 비슷한 프로젝트 문맥 반영
   - import 경로를 현재 프로젝트 구조에 맞춤 (`@/core/ui`, `@/core/hooks`, `@/core/utils/...`)
   - 더미 데이터·섹션 구조는 원본 유지
   - 색상이 `brand-*` 토큰 기반이므로 Indigo 톤 자동 반영

2. **index.ts 배럴 파일**:
   - `domains/design-system/pages/index.ts` → DesignSystemPage export
   - `domains/design-system/index.ts` → pages re-export

3. **App.tsx 라우트 등록**:
   ```tsx
   <Route path="/design-system" element={<DesignSystemPage />} />
   ```
   - LandingPage 네비게이션에 "디자인 시스템" 링크 추가 (선택)

**디자인 차별화 포인트**
- StatCard 섹션의 데이터를 이 프로젝트에 맞는 문맥으로 약간 변경 (예: "전체 임직원" → "전체 사용자" 등)
- 컬러 팔레트 섹션의 "Brand (Indigo)" 라벨 표기
- 페이지 설명 문구를 프로젝트 맥락에 맞게 조정

**주의사항**
- Task 1~7이 모두 완료된 후 실행해야 함 (모든 컴포넌트·훅·유틸 의존)
- DesignSystemPage에서 `ConfirmDialog` 컴포넌트를 직접 마운트하는 부분 → App.tsx에서 전역 마운트 하므로 페이지 내 `<ConfirmDialog />` 제거

**완료 기준**
- [ ] `/design-system` 경로에서 쇼케이스 페이지 렌더링
- [ ] 모든 UI 섹션(StatCard, Badge, Button, Avatar, ProgressBar, Input, Select, Card, DataTable, Modal, Toast, Formatters, Pagination, Skeleton, ConfirmDialog, EmptyState, Breadcrumb, Excel, useTableFilter, Tabs) 정상 표시
- [ ] Toast 버튼 클릭 시 우상단 알림 표시
- [ ] ConfirmDialog 버튼 클릭 시 확인 다이얼로그 동작
- [ ] Excel 다운로드 버튼 클릭 시 .xlsx 파일 다운로드
- [ ] 기존 라우트(/, /sample) 동작 유지

**검수 체크리스트**
- [ ] 레이어드 아키텍처 준수 (도메인 폴더 구조)
- [ ] 타입 힌트 / TypeScript 타입 누락 없음
- [ ] `apiClient` 사용 확인 (이 페이지는 API 미사용이므로 해당없음)
- [ ] `App.tsx`에 라우트 등록 확인
- [ ] 기존 파일의 의도치 않은 변경 없음

### 완료 기록 (태스크 완료 후 작성)

- **완료일**: -
- **변경 파일**: -
- **커밋**: -
- **다음 태스크 참고사항**: -
- **미해결 이슈**: -
