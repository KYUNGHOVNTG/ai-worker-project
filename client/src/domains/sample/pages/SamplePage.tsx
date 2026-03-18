/**
 * SamplePage
 *
 * Sample 도메인의 메인 페이지 — CRUD 데모
 */

import React, { useState } from 'react';
import { MainLayout } from '@/core/layout';
import { Button, Modal } from '@/core/ui';
import { SampleList, SampleForm } from '../components';
import { useSampleStore } from '../store';
import type { SampleCreateData } from '../types';

export const SamplePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createItem, loading } = useSampleStore();

  const handleCreateItem = async (data: SampleCreateData) => {
    await createItem(data);
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sample Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">CRUD 데모 — 백엔드 API 연동 확인용</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} isLoading={loading}>
            + 새 항목 추가
          </Button>
        </div>

        <SampleList />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
          <div className="px-6 pt-6 pb-2 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">새 항목 추가</h2>
          </div>
          <SampleForm
            onSubmit={handleCreateItem}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};
