import React from 'react';
import { Pencil, Trash2, Search, RefreshCw } from 'lucide-react';
import { useSampleStore } from '../store';
import {
  Card, CardHeader, Button, Input, Badge, Avatar, ProgressBar,
  DataTable, EmptyState,
} from '@/core/ui';
import type { TableColumn } from '@/core/ui';
import { useConfirm, usePagination, useTableFilter } from '@/core/hooks';
import { toast } from '@/core/utils/toast';
import type { SampleItem } from '../types';

interface SampleListProps {
  onEdit: (item: SampleItem) => void;
}

export const SampleList: React.FC<SampleListProps> = ({ onEdit }) => {
  const { items, loading, error, fetchItems, deleteItem } = useSampleStore();
  const confirm = useConfirm();
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const { filters, setFilter, debouncedFilters } = useTableFilter({
    initialFilters: { keyword: '' },
  });

  const filteredItems = React.useMemo(() => {
    const kw = String(debouncedFilters.keyword).toLowerCase();
    if (!kw) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(kw) ||
        (item.description ?? '').toLowerCase().includes(kw)
    );
  }, [items, debouncedFilters]);

  const handleDelete = async (item: SampleItem) => {
    const ok = await confirm({
      title: '항목 삭제',
      message: `"${item.name}" 항목을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      confirmText: '삭제',
      variant: 'danger',
    });
    if (!ok) return;
    await deleteItem(item.id);
    toast.success(`"${item.name}" 항목이 삭제되었습니다.`);
  };

  const getScoreBadge = (score: number | null | undefined) => {
    if (score == null) return <Badge variant="default">-</Badge>;
    const pct = score * 100;
    if (pct >= 80) return <Badge variant="success">{pct.toFixed(0)}%</Badge>;
    if (pct >= 50) return <Badge variant="warning">{pct.toFixed(0)}%</Badge>;
    return <Badge variant="danger">{pct.toFixed(0)}%</Badge>;
  };

  const columns: TableColumn<SampleItem>[] = [
    {
      key: 'name',
      header: '이름',
      sortable: true,
      render: (_val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-slate-800 truncate">{row.name}</p>
            {row.description && (
              <p className="text-xs text-slate-400 truncate max-w-[200px]">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'value',
      header: '값',
      sortable: true,
      width: '140px',
      render: (val) => (
        <span className="font-semibold text-slate-700">{Number(val).toLocaleString()}</span>
      ),
    },
    {
      key: 'score',
      header: '점수',
      sortable: true,
      width: '160px',
      render: (_val, row) => (
        <div className="flex items-center gap-3">
          <ProgressBar value={(row.score ?? 0) * 100} className="flex-1 w-16" />
          {getScoreBadge(row.score)}
        </div>
      ),
    },
    {
      key: 'id',
      header: '',
      width: '100px',
      render: (_val, row) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            title="수정"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="삭제"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <Card>
        <div className="p-6">
          <EmptyState
            variant="error"
            title="데이터를 불러오지 못했습니다"
            description={error}
            action={
              <Button variant="outline" size="sm" onClick={fetchItems}>
                <RefreshCw className="w-4 h-4" /> 다시 시도
              </Button>
            }
          />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-slate-800">항목 목록</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="이름, 설명으로 검색..."
            className="w-56"
            value={String(filters.keyword)}
            onChange={(e) => setFilter('keyword', e.target.value)}
          />
          <Button variant="secondary" size="sm" onClick={fetchItems} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-slate-500 text-sm gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          로딩 중...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="border-t border-slate-100">
          <EmptyState
            variant={String(filters.keyword) ? 'search' : 'default'}
            title={String(filters.keyword) ? '검색 결과가 없습니다' : '등록된 항목이 없습니다'}
            description={String(filters.keyword) ? '검색어를 확인해주세요.' : '새 항목을 추가해 보세요.'}
          />
        </div>
      ) : (
        <div className="border-t border-slate-100">
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination={pagination.paginationProps(filteredItems.length)}
            exportConfig={{ filename: '샘플데이터', sheetName: '항목목록' }}
          />
        </div>
      )}
    </Card>
  );
};
