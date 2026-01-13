/**
 * Loading Manager (Class-based Singleton)
 *
 * 전역 로딩 상태를 관리하는 싱글톤 클래스입니다.
 * - 로딩 상태 표시/숨김
 * - 로딩 메시지 설정
 * - 중첩 로딩 처리 (카운터 방식)
 *
 * 사용 가이드:
 *    LoadingOverlay 컴포넌트와 함께 사용됩니다.
 *    ApiClient의 interceptor에서 자동으로 호출되거나,
 *    수동으로 특정 작업 전후에 호출할 수 있습니다.
 *
 * 확장 가이드:
 *    - 로딩 프로그레스 추가
 *    - 타임아웃 설정 (일정 시간 후 자동 숨김)
 *    - 로딩 큐 관리 (여러 작업의 우선순위)
 */

interface LoadingState {
  isVisible: boolean;
  message?: string;
}

type Subscriber = (state: LoadingState) => void;

/**
 * LoadingManager 클래스
 *
 * 전역 로딩 상태를 관리하는 싱글톤입니다.
 */
export class LoadingManager {
  private static instance: LoadingManager;
  private state: LoadingState = { isVisible: false };
  private subscribers: Set<Subscriber> = new Set();
  private loadingCounter: number = 0;

  /**
   * Private constructor (Singleton)
   */
  private constructor() {}

  /**
   * Singleton 인스턴스 반환
   */
  private static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }
    return LoadingManager.instance;
  }

  /**
   * 로딩 표시
   *
   * 중첩 호출을 지원합니다 (카운터 방식).
   * show()가 3번 호출되면 hide()도 3번 호출되어야 실제로 숨겨집니다.
   *
   * @param message - 로딩 메시지 (선택적)
   */
  static show(message?: string): void {
    const instance = this.getInstance();
    instance.loadingCounter++;

    instance.state = {
      isVisible: true,
      message: message || '처리 중입니다...',
    };

    instance.notifySubscribers();
  }

  /**
   * 로딩 숨김
   *
   * 카운터가 0이 되어야 실제로 숨겨집니다.
   */
  static hide(): void {
    const instance = this.getInstance();
    instance.loadingCounter = Math.max(0, instance.loadingCounter - 1);

    if (instance.loadingCounter === 0) {
      instance.state = {
        isVisible: false,
        message: undefined,
      };
      instance.notifySubscribers();
    }
  }

  /**
   * 강제로 로딩 숨김 (카운터 무시)
   *
   * 에러 발생 시 등 즉시 로딩을 숨겨야 할 때 사용합니다.
   */
  static forceHide(): void {
    const instance = this.getInstance();
    instance.loadingCounter = 0;
    instance.state = {
      isVisible: false,
      message: undefined,
    };
    instance.notifySubscribers();
  }

  /**
   * 현재 로딩 상태 확인
   *
   * @returns 로딩 중 여부
   */
  static isLoading(): boolean {
    const instance = this.getInstance();
    return instance.state.isVisible;
  }

  /**
   * 상태 변경 구독
   *
   * LoadingOverlay 컴포넌트가 상태 변경을 감지하기 위해 사용합니다.
   *
   * @param subscriber - 상태 변경 시 호출될 콜백
   * @returns 구독 해제 함수
   */
  static subscribe(subscriber: Subscriber): () => void {
    const instance = this.getInstance();
    instance.subscribers.add(subscriber);

    // 즉시 현재 상태를 전달
    subscriber(instance.state);

    // 구독 해제 함수 반환
    return () => {
      instance.subscribers.delete(subscriber);
    };
  }

  /**
   * 모든 구독자에게 상태 변경 알림
   */
  private notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => {
      subscriber(this.state);
    });
  }

  /**
   * 로딩 카운터 리셋 (주로 테스트용)
   */
  static reset(): void {
    const instance = this.getInstance();
    instance.loadingCounter = 0;
    instance.state = { isVisible: false };
    instance.notifySubscribers();
  }
}

/**
 * 사용 예시:
 *
 * 1. 기본 사용
 * ```ts
 * LoadingManager.show('데이터를 불러오는 중...');
 * await fetchData();
 * LoadingManager.hide();
 * ```
 *
 * 2. try-finally로 안전하게 사용
 * ```ts
 * try {
 *   LoadingManager.show();
 *   await apiCall();
 * } finally {
 *   LoadingManager.hide();
 * }
 * ```
 *
 * 3. 중첩 호출
 * ```ts
 * LoadingManager.show('작업 1');
 * LoadingManager.show('작업 2'); // 여전히 표시됨
 * LoadingManager.hide();          // 여전히 표시됨
 * LoadingManager.hide();          // 이제 숨겨짐
 * ```
 *
 * 4. 에러 발생 시 강제 숨김
 * ```ts
 * try {
 *   LoadingManager.show();
 *   await riskyOperation();
 * } catch (error) {
 *   LoadingManager.forceHide(); // 카운터 무시하고 즉시 숨김
 * }
 * ```
 *
 * 5. ApiClient Interceptor에서 자동 사용
 * ```ts
 * axios.interceptors.request.use((config) => {
 *   LoadingManager.show();
 *   return config;
 * });
 *
 * axios.interceptors.response.use(
 *   (response) => {
 *     LoadingManager.hide();
 *     return response;
 *   },
 *   (error) => {
 *     LoadingManager.hide();
 *     return Promise.reject(error);
 *   }
 * );
 * ```
 */
