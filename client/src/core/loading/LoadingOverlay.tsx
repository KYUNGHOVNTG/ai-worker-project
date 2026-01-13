/**
 * Global Loading Overlay
 *
 * 전역 로딩 상태를 표시하는 오버레이입니다.
 * API 요청 중이거나 긴 작업이 진행 중일 때 사용자에게 피드백을 제공합니다.
 *
 * 사용 가이드:
 *    App.tsx에서 최상단에 배치하세요.
 *    LoadingManager를 통해 show/hide를 제어합니다.
 *
 *    // App.tsx
 *    <LoadingOverlay />
 *    <YourContent />
 *
 *    // 사용 예시
 *    LoadingManager.show('데이터를 불러오는 중...');
 *    await fetchData();
 *    LoadingManager.hide();
 *
 * 커스터마이징 가이드:
 *    - 스피너 디자인 변경
 *    - 애니메이션 효과 추가
 *    - 로딩 프로그레스 바 추가
 */

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { LoadingManager } from './LoadingManager';

interface LoadingState {
  isVisible: boolean;
  message?: string;
}

/**
 * LoadingOverlay 컴포넌트
 *
 * 전체 화면을 덮는 반투명 오버레이와 스피너를 표시합니다.
 */
export function LoadingOverlay() {
  const [state, setState] = useState<LoadingState>({
    isVisible: false,
    message: undefined,
  });

  useEffect(() => {
    // LoadingManager의 상태 변경을 구독
    const unsubscribe = LoadingManager.subscribe((newState) => {
      setState(newState);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe();
    };
  }, []);

  // 로딩 중이 아니면 아무것도 렌더링하지 않음
  if (!state.isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="alert"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm mx-4">
        {/* 스피너 */}
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />

        {/* 로딩 메시지 */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {state.message || '처리 중입니다...'}
          </h3>
          <p className="text-sm text-slate-500">잠시만 기다려주세요</p>
        </div>
      </div>
    </div>
  );
}

/**
 * 사용 예시:
 *
 * 1. App.tsx에 배치
 * ```tsx
 * function App() {
 *   return (
 *     <>
 *       <LoadingOverlay />
 *       <YourContent />
 *     </>
 *   );
 * }
 * ```
 *
 * 2. API 호출 시
 * ```tsx
 * const fetchData = async () => {
 *   LoadingManager.show('데이터를 불러오는 중...');
 *   try {
 *     await apiClient.get('/data');
 *   } finally {
 *     LoadingManager.hide();
 *   }
 * };
 * ```
 *
 * 3. 여러 작업 시
 * ```tsx
 * LoadingManager.show('파일을 업로드하는 중...');
 * await uploadFile();
 *
 * LoadingManager.show('데이터를 처리하는 중...');
 * await processData();
 *
 * LoadingManager.hide();
 * ```
 */
