import { useState, useMemo, useCallback } from 'react';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';
import { Pagination, type PaginationProps } from './Pagination';
import { exportToExcel, type ExportConfig } from '../utils/exportExcel';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: React.ReactNode;
  headerText?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  emptyText?: string;
  className?: string;
  pagination?: PaginationProps;
  exportConfig?: ExportConfig;
  rowClassName?: (row: T, index: number) => string;
  sort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
}

function SortIcon({ direction }: { direction: SortDirection | null }) {
  return (
    <span className="inline-flex flex-col ml-1 -space-y-1">
      <ChevronUp
        size={12}
        className={direction === 'asc' ? 'text-slate-900' : 'text-slate-300'}
      />
      <ChevronDown
        size={12}
        className={direction === 'desc' ? 'text-slate-900' : 'text-slate-300'}
      />
    </span>
  );
}

export function DataTable<T>({
  columns,
  data,
  emptyText = '데이터가 없습니다.',
  className = '',
  pagination,
  exportConfig,
  rowClassName,
  sort: externalSort,
  onSortChange,
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<SortState | null>(null);

  const isControlled = externalSort !== undefined;
  const currentSort = isControlled ? externalSort : internalSort;

  const handleSortClick = useCallback(
    (key: string) => {
      const next: SortState | null = (() => {
        if (currentSort?.key !== key) return { key, direction: 'asc' as const };
        if (currentSort.direction === 'asc') return { key, direction: 'desc' as const };
        return null;
      })();

      if (isControlled) {
        onSortChange?.(next);
      } else {
        setInternalSort(next);
      }
    },
    [currentSort, isControlled, onSortChange],
  );

  const sortedData = useMemo(() => {
    if (isControlled || !currentSort) return data;
    const { key, direction } = currentSort;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[key];
      const bVal = (b as Record<string, unknown>)[key];
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      const cmp = aStr.localeCompare(bStr, 'ko');
      return direction === 'asc' ? cmp : -cmp;
    });
  }, [data, currentSort, isControlled]);

  function handleExport() {
    if (!exportConfig) return;
    exportToExcel({
      filename: exportConfig.filename,
      sheetName: exportConfig.sheetName,
      columns: columns.map((col) => ({
        key: col.key,
        header: col.headerText ?? (typeof col.header === 'string' ? col.header : col.key),
      })),
      data: data as Record<string, unknown>[],
    });
  }

  return (
    <div className={className}>
      {exportConfig && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Download size={15} />
            Excel 다운로드
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'px-6 py-3.5 text-left text-sm font-semibold text-slate-600',
                    col.sortable ? 'cursor-pointer select-none hover:text-slate-900 transition-colors' : '',
                  ].join(' ')}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSortClick(col.key) : undefined}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {col.sortable && (
                      <SortIcon
                        direction={currentSort?.key === col.key ? currentSort.direction : null}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-slate-400 text-sm"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={[
                    'border-b border-slate-100 hover:bg-slate-50/50 transition-colors',
                    rowIdx === sortedData.length - 1 && !pagination ? 'border-none' : '',
                    rowClassName ? rowClassName(row, rowIdx) : '',
                  ].join(' ')}
                >
                  {columns.map((col) => {
                    const cellValue = (row as Record<string, unknown>)[col.key];
                    return (
                      <td key={col.key} className="px-6 py-4 text-slate-700">
                        {col.render
                          ? col.render(cellValue, row)
                          : String(cellValue ?? '-')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {pagination && <Pagination {...pagination} />}
      </div>
    </div>
  );
}
