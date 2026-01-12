/**
 * Modal Component (Skeleton)
 *
 * 모달 다이얼로그 컴포넌트
 *
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose}>
 *   <h2>Modal Title</h2>
 *   <p>Modal content</p>
 * </Modal>
 */

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
}) => {
  // TODO: Framer Motion 애니메이션 추가
  // TODO: 백드롭 클릭 시 닫기
  // TODO: ESC 키로 닫기
  // TODO: body 스크롤 방지

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
