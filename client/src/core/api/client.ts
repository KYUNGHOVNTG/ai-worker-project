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

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
   */
  private setupInterceptors(): void {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // TODO: 인증 토큰 추가
        // const token = localStorage.getItem('auth_token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // TODO: 에러 처리 로직
        // - 401: 인증 만료 -> 로그인 페이지로 리다이렉트
        // - 403: 권한 없음
        // - 500: 서버 에러
        return Promise.reject(error);
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
