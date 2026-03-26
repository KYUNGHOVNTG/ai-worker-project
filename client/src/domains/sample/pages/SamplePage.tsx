import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Plus, BarChart2, Hash, TrendingUp, Package } from 'lucide-react';
import { MainLayout } from '@/core/layout';
import { Button, Modal, StatCard } from '@/core/ui';
import { SampleList } from '../components/SampleList';
import { SampleForm } from '../components/SampleForm';
import { useSampleStore } from '../store';
import { toast } from '@/core/utils/toast';
import type { SampleCreateData, SampleUpdateData, SampleItem } from '../types';

export const SamplePage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<SampleItem | null>(null);
  const { items, fetchItems, createItem, updateItem, loading } = useSampleStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const stats = useMemo(() => {
    const total = items.length;
    const avgValue = total > 0 ? items.reduce((sum, i) => sum + i.value, 0) / total : 0;
    const scored = items.filter((i) => i.score != null);
    const avgScore = scored.length > 0 ? scored.reduce((sum, i) => sum + (i.score ?? 0), 0) / scored.length : 0;
    const maxValue = total > 0 ? Math.max(...items.map((i) => i.value)) : 0;
    return { total, avgValue, avgScore, maxValue };
  }, [items]);

  const handleCreate = async (data: SampleCreateData) => {
    await createItem(data);
    setCreateModalOpen(false);
    toast.success('항목이 생성되었습니다.');
  };

  const handleUpdate = async (data: SampleUpdateData) => {
    if (!editItem) return;
    await updateItem(editItem.id, data);
    setEditItem(null);
    toast.success('항목이 수정되었습니다.');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto p-8 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={16} />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Sample Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">CRUD 데모 — 백엔드 API 연동 확인용</p>
              </div>
            </div>
            <Button onClick={() => setCreateModalOpen(true)} isLoading={loading}>
              <Plus className="w-4 h-4" /> 새 항목 추가
            </Button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatCard
              title="전체 항목"
              value={stats.total}
              unit="개"
              icon={<Package className="w-5 h-5" />}
              color="brand"
            />
            <StatCard
              title="평균 값"
              value={stats.avgValue.toFixed(1)}
              icon={<BarChart2 className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              title="평균 점수"
              value={stats.avgScore > 0 ? (stats.avgScore * 100).toFixed(1) : '-'}
              unit={stats.avgScore > 0 ? '%' : ''}
              icon={<TrendingUp className="w-5 h-5" />}
              color="emerald"
            />
            <StatCard
              title="최고 값"
              value={stats.total > 0 ? stats.maxValue.toFixed(1) : '-'}
              icon={<Hash className="w-5 h-5" />}
              color="violet"
            />
          </div>

          {/* Data Table */}
          <SampleList onEdit={setEditItem} />

          {/* Create Modal */}
          <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="새 항목 추가">
            <SampleForm
              onSubmit={handleCreate}
              onCancel={() => setCreateModalOpen(false)}
            />
          </Modal>

          {/* Edit Modal */}
          <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="항목 수정">
            {editItem && (
              <SampleForm
                initialData={{
                  name: editItem.name,
                  value: editItem.value,
                  description: editItem.description ?? '',
                  score: editItem.score ?? undefined,
                }}
                onSubmit={handleUpdate}
                onCancel={() => setEditItem(null)}
                submitLabel="수정"
              />
            )}
          </Modal>
        </div>
      </div>
    </MainLayout>
  );
};
