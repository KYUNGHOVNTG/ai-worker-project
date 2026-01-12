# AI Dashboard Frontend

React + Vite + TypeScript 기반 AI 대시보드 프론트엔드 템플릿

## 기술 스택

- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **TypeScript** - 타입 안정성
- **TailwindCSS** - 스타일링
- **Zustand** - 상태 관리
- **Axios** - HTTP 클라이언트
- **Framer Motion** - 애니메이션
- **React Router** - 라우팅

## 아키텍처

### 폴더 구조

```
client/src/
├── core/                    # 핵심 공통 모듈
│   ├── api/                # API Client (Singleton)
│   │   ├── client.ts       # Axios 기반 API Client
│   │   ├── types.ts        # API 공통 타입
│   │   └── index.ts
│   ├── store/              # 전역 상태 관리
│   │   ├── useAuthStore.ts # 인증 상태
│   │   └── index.ts
│   ├── hooks/              # 커스텀 훅
│   │   ├── useApi.ts       # API 호출 훅
│   │   ├── useDebounce.ts  # Debounce 훅
│   │   └── index.ts
│   ├── ui/                 # 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MainLayout.tsx
│   │   └── index.ts
│   └── index.ts
│
└── domains/                 # 도메인별 기능
    └── sample/             # 샘플 도메인 (템플릿)
        ├── types.ts        # 도메인 타입
        ├── api.ts          # 도메인 API
        ├── store.ts        # 도메인 상태
        ├── components/     # 도메인 컴포넌트
        ├── pages/          # 도메인 페이지
        ├── index.ts
        └── README.md
```

### 핵심 원칙

#### 1. Core / Domains 분리

- **core**: 프로젝트 전체에서 사용되는 공통 기능
- **domains**: 비즈니스 로직별로 독립적인 모듈

#### 2. API 통신 규칙

- **반드시 API Client Singleton 사용**
- 컴포넌트에서 axios 직접 사용 금지

```typescript
// ✅ 올바른 방법
import { apiClient } from '@/core/api';

export async function fetchUsers() {
  const response = await apiClient.get('/users');
  return response.data;
}

// ❌ 잘못된 방법
import axios from 'axios';

export async function fetchUsers() {
  const response = await axios.get('http://localhost:8000/users');
  return response.data;
}
```

#### 3. 상태 관리

- **Zustand**를 사용하여 도메인별 상태 관리
- 전역 상태는 `core/store`에, 도메인 상태는 각 `domains/*/store.ts`에

#### 4. Path Alias

```typescript
import { Button } from '@/core/ui';
import { SamplePage } from '@/domains/sample';
```

## 시작하기

### 1. 설치

```bash
cd client
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일에서 API URL 설정:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 4. 빌드

```bash
npm run build
```

## 새 도메인 추가하기

### 1. 도메인 폴더 복사

```bash
cp -r src/domains/sample src/domains/your-domain
```

### 2. 파일 내용 수정

모든 파일에서 `Sample`, `sample`을 새 도메인명으로 변경

### 3. 라우트 추가

`src/App.tsx`에 라우트 추가:

```typescript
import { YourDomainPage } from '@/domains/your-domain';

<Route path="/your-domain" element={<YourDomainPage />} />
```

### 4. API 구현

`src/domains/your-domain/api.ts`:

```typescript
import { apiClient } from '@/core/api';

export async function fetchYourData() {
  const response = await apiClient.get('/your-endpoint');
  return response.data;
}
```

### 5. Store 구현

`src/domains/your-domain/store.ts`:

```typescript
import { create } from 'zustand';

export const useYourStore = create((set) => ({
  data: [],
  fetchData: async () => {
    // API 호출 및 상태 업데이트
  },
}));
```

## 스크립트

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 실행
```

## 프로젝트 특징

### Skeleton Components

- 모든 UI 컴포넌트는 Skeleton 버전으로 제공
- TODO 주석으로 구현 가이드 포함
- 실제 프로젝트에 맞게 커스터마이징 필요

### Domain Template

- `domains/sample`을 복사하여 새 도메인 생성
- 독립적인 모듈 구조로 다른 프로젝트에 재사용 가능

### Type Safety

- 엄격한 TypeScript 설정
- API 응답 타입 정의
- Props 타입 명시

## 개발 가이드

### API 호출 패턴

```typescript
// 1. API 함수 정의 (domains/*/api.ts)
export async function fetchItems() {
  const response = await apiClient.get<ApiResponse<Item[]>>('/items');
  return response.data;
}

// 2. Store에서 사용 (domains/*/store.ts)
fetchItems: async () => {
  set({ loading: true });
  try {
    const data = await api.fetchItems();
    set({ items: data, loading: false });
  } catch (error) {
    set({ error: error.message, loading: false });
  }
}

// 3. 컴포넌트에서 사용
const { items, loading, fetchItems } = useYourStore();

useEffect(() => {
  fetchItems();
}, []);
```

### 컴포넌트 작성

```typescript
import React from 'react';
import { Button, Card } from '@/core/ui';
import { useYourStore } from '../store';

export const YourComponent: React.FC = () => {
  const { data, loading } = useYourStore();

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <h2>Your Component</h2>
      {/* 컴포넌트 내용 */}
    </Card>
  );
};
```

## 라이센스

MIT
