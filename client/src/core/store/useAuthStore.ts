/**
 * Auth Store (Skeleton)
 *
 * 인증 상태 관리
 *
 * @example
 * const { user, login, logout } = useAuthStore();
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  // TODO: 추가 사용자 정보
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // TODO: API 호출로 로그인 처리
        // const response = await apiClient.post('/auth/login', { email, password });
        // set({ user: response.data.user, token: response.data.token, isAuthenticated: true });

        console.log('Login called with:', email, password);
      },

      logout: () => {
        // TODO: 토큰 삭제, 상태 초기화
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
