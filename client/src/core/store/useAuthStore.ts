/**
 * Auth Store
 *
 * 인증 상태 관리 (로그인/로그아웃/회원가입)
 * localStorage에 토큰을 영속화합니다.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '@/domains/auth/api';
import type { User } from '@/domains/auth/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const result = await authApi.login({ email, password });
        set({ token: result.access_token, isAuthenticated: true });

        // 토큰 발급 후 사용자 정보 조회
        const user = await authApi.getMe(result.access_token);
        set({ user });
      },

      register: async (email: string, password: string) => {
        await authApi.register({ email, password });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      loadUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const user = await authApi.getMe(token);
          set({ user, isAuthenticated: true });
        } catch {
          // 토큰 만료/무효 → 로그아웃
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
