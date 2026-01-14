/**
 * System 도메인 타입 정의
 */

/**
 * DB 연결 테스트 응답
 */
export interface DBCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
}
