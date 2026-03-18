/**
 * SampleList Component
 *
 * Sample 아이템 목록 컴포넌트
 */

import React, { useEffect } from 'react';
import { useSampleStore } from '../store';
import { Card, CardBody, Button } from '@/core/ui';

export const SampleList: React.FC = () => {
  const { items, loading, error, fetchItems, deleteItem } = useSampleStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-500 text-sm">
        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
        오류: {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <p className="text-sm">아직 데이터가 없습니다. 새 항목을 추가해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardBody>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                  <span>값: <span className="font-medium text-slate-600">{item.value}</span></span>
                  {item.score !== null && (
                    <span>점수: <span className="font-medium text-slate-600">{item.score}</span></span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteItem(item.id)}
                className="text-red-500 hover:bg-red-50 shrink-0"
              >
                삭제
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
