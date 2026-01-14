/**
 * Toast 알림 유틸리티
 * 간단한 브라우저 알림 (추후 react-toastify 등으로 대체 가능)
 */

export const toast = {
  /**
   * 성공 알림
   */
  success: (message: string) => {
    alert(`✅ ${message}`);
  },

  /**
   * 에러 알림
   */
  error: (message: string) => {
    alert(`❌ ${message}`);
  },

  /**
   * 정보 알림
   */
  info: (message: string) => {
    alert(`ℹ️ ${message}`);
  },
};
