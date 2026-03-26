function toDate(date: string | Date | null | undefined): Date | null {
  if (date == null || date === '') return null;
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

/** "2026-03-06" -> "2026년 3월 6일" */
export function formatDate(date: string | Date | null | undefined): string {
  const d = toDate(date);
  if (!d) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(d);
}

/** "2026-03-06" -> "26.03.06" */
export function formatDateShort(date: string | Date | null | undefined): string {
  const d = toDate(date);
  if (!d) return '-';
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}.${mm}.${dd}`;
}

/** "2026-03-06T09:00:00" -> "2026.03.06 09:00" */
export function formatDateTime(date: string | Date | null | undefined): string {
  const d = toDate(date);
  if (!d) return '-';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

/** (from, to) -> "2026.03.01 ~ 2026.03.31" */
export function formatDateRange(
  from: string | Date | null | undefined,
  to: string | Date | null | undefined,
): string {
  const f = toDate(from);
  const t = toDate(to);
  if (!f && !t) return '-';
  const fmt = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };
  if (!f) return `~ ${fmt(t!)}`;
  if (!t) return `${fmt(f)} ~`;
  return `${fmt(f)} ~ ${fmt(t)}`;
}

/** 1234567 -> "1,234,567원" */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return '-';
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

/** 1234567 -> "1,234,567" */
export function formatNumber(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '-';
  return new Intl.NumberFormat('ko-KR').format(value);
}

/** 0.856 -> "85.6%" */
export function formatPercent(value: number | null | undefined, digits = 1): string {
  if (value == null || isNaN(value)) return '-';
  return (value * 100).toFixed(digits) + '%';
}

/** 사번 표시 형식 통일 */
export function formatEmpNo(empNo: string | null | undefined): string {
  if (!empNo || empNo.trim() === '') return '-';
  return empNo.trim();
}
