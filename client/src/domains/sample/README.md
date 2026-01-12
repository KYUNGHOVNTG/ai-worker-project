# Sample Domain

이 도메인은 새로운 기능을 추가할 때 사용할 수 있는 템플릿입니다.

## 구조

```
sample/
├── types.ts           # 타입 정의
├── api.ts            # API 통신 로직 (apiClient 사용)
├── store.ts          # 상태 관리 (Zustand)
├── components/       # 도메인 전용 컴포넌트
│   ├── SampleList.tsx
│   ├── SampleForm.tsx
│   └── index.ts
├── pages/            # 페이지 컴포넌트
│   ├── SamplePage.tsx
│   └── index.ts
├── index.ts          # 도메인 엔트리포인트
└── README.md         # 도메인 문서
```

## 사용 방법

### 1. 새 도메인 생성

```bash
# domains/sample을 복사하여 새 도메인 생성
cp -r domains/sample domains/your-domain

# 모든 파일에서 'Sample', 'sample'을 새 이름으로 변경
```

### 2. API 구현

```typescript
// api.ts
import { apiClient } from '@/core/api';

export async function fetchYourData() {
  const response = await apiClient.get('/your-endpoint');
  return response.data;
}
```

### 3. Store 구현

```typescript
// store.ts
import { create } from 'zustand';

export const useYourStore = create((set) => ({
  data: [],
  fetchData: async () => {
    // API 호출 및 상태 업데이트
  },
}));
```

### 4. 컴포넌트 구현

```typescript
// components/YourComponent.tsx
import { useYourStore } from '../store';

export const YourComponent = () => {
  const { data } = useYourStore();
  // 컴포넌트 로직
};
```

### 5. 라우팅 추가

```typescript
// App.tsx
import { YourPage } from '@/domains/your-domain';

<Route path="/your-path" element={<YourPage />} />
```

## 규칙

1. **API 통신**: 반드시 `apiClient`를 사용하세요. 컴포넌트에서 axios 직접 사용 금지
2. **상태 관리**: Zustand를 사용하여 도메인 상태를 관리하세요
3. **타입 안정성**: TypeScript를 활용하여 타입을 명확히 정의하세요
4. **컴포넌트 재사용**: core/ui의 공통 컴포넌트를 최대한 활용하세요
5. **독립성**: 다른 도메인에 의존하지 않도록 구현하세요
