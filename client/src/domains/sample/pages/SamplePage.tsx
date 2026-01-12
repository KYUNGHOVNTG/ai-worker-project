/**
 * SamplePage (Skeleton)
 *
 * Sample 도메인의 메인 페이지
 *
 * @example
 * <Route path="/sample" element={<SamplePage />} />
 */

import React, { useState } from 'react';
import { MainLayout } from '@/core/layout';
import { Button, Modal } from '@/core/ui';
import { SampleList, SampleForm } from '../components';
import { useSampleStore } from '../store';

export const SamplePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createItem } = useSampleStore();

  const handleCreateItem = async (data: any) => {
    await createItem(data);
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="sample-page">
        <div className="page-header">
          <h1>Sample Dashboard</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            Create New Item
          </Button>
        </div>

        <SampleList />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Create Sample Item</h2>
          <SampleForm
            onSubmit={handleCreateItem}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};
