import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonBase =
    'inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const navButton = `${buttonBase} text-slate-500 hover:bg-slate-100 hover:text-slate-700`;
  const pageButton = `${buttonBase} text-slate-600 hover:bg-slate-100`;
  const activePageButton = `${buttonBase} bg-slate-900 text-white`;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>총 {total.toLocaleString()}건</span>
        {onPageSizeChange && (
          <>
            <span className="text-slate-300">|</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}건
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          className={navButton}
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="첫 페이지"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          className={navButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="이전 페이지"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            className={num === currentPage ? activePageButton : pageButton}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}

        <button
          className={navButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="다음 페이지"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          className={navButton}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="마지막 페이지"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
