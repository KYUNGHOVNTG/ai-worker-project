/**
 * Auth Domain API
 *
 * 인증 관련 API 통신 로직
 * apiClient를 사용하여 백엔드와 통신합니다.
 */

import { apiClient } from '@/core/api';
import type { ApiResponse } from '@/core/api/types';
import type { LoginRequest, RegisterRequest, TokenResponse, User } from './types';

const BASE = '/v1/auth';

/** 회원가입 — POST /api/v1/auth/register */
export async function register(data: RegisterRequest): Promise<User> {
  const response = await apiClient.post<ApiResponse<User>>(`${BASE}/register`, data);
  if (!response.data.data) {
    throw new Error(response.data.error ?? '회원가입에 실패했습니다');
  }
  return response.data.data;
}

/** 로그인 — POST /api/v1/auth/login */
export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<ApiResponse<TokenResponse>>(`${BASE}/login`, data);
  if (!response.data.data) {
    throw new Error(response.data.error ?? '로그인에 실패했습니다');
  }
  return response.data.data;
}

/** 현재 사용자 정보 — GET /api/v1/auth/me */
export async function getMe(token: string): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.data.data) {
    throw new Error(response.data.error ?? '사용자 정보를 가져올 수 없습니다');
  }
  return response.data.data;
}
