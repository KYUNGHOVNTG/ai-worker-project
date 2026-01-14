/**
 * API Client Singleton
 *
 * 모든 HTTP 요청은 이 클라이언트를 통해 처리됩니다.
 * 컴포넌트에서 axios를 직접 사용하지 마세요.
 *
 * @example
 * import { apiClient } from '@/core/api/client';
 * const response = await apiClient.get('/users');
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { LoadingManager } from '../loading/LoadingManager';
import { ApiErrorHandler } from '../errors/ApiErrorHandler';

class ApiClient {
  private instance: AxiosInstance;
  private static _instance: ApiClient;

  private constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Singleton 인스턴스 반환
   */
  public static getInstance(): ApiClient {
    if (!ApiClient._instance) {
      ApiClient._instance = new ApiClient();
    }
    return ApiClient._instance;
  }

  /**
   * Request/Response Interceptors 설정
   *
   * 전역 Loading 및 Error 처리를 자동화합니다.
   */
  private setupInterceptors(): void {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // 전역 로딩 시작
        // config.skipLoading이 true이면 로딩 표시 안 함
        if (!(config as any).skipLoading) {
          LoadingManager.show();
        }

        // TODO: 인증 토큰 추가
        // const token = localStorage.getItem('auth_token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
      },
      (error) => {
        // 요청 실패 시 로딩 숨김
        LoadingManager.hide();
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // 응답 성공 시 로딩 숨김
        LoadingManager.hide();
        return response;
      },
      (error: AxiosError) => {
        // 응답 실패 시 로딩 숨김
        LoadingManager.hide();

        // 에러 처리
        const errorData = ApiErrorHandler.handle(error);

        // 특정 상태 코드별 추가 처리
        if (ApiErrorHandler.isAuthError(error)) {
          // TODO: 인증 에러 처리
          // - 로그인 페이지로 리다이렉트
          // - 또는 토큰 갱신 시도
          console.warn('🔐 인증 에러:', errorData.message);
        }

        // 변환된 에러 데이터 반환
        return Promise.reject(errorData);
      }
    );
  }

  /**
   * GET 요청
   */
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  /**
   * POST 요청
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  /**
   * PUT 요청
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  /**
   * PATCH 요청
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  /**
   * DELETE 요청
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}

// Singleton 인스턴스 export
export const apiClient = ApiClient.getInstance();
