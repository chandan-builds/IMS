import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  id?: string;
  sortable?: boolean;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortable?: boolean;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  columns,
  data,
  sortable,
  onSort,
  sortColumn,
  sortDirection,
  className,
  onRowClick,
}: TableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!sortable || !column.sortable || !onSort) return;
    const colId = column.id || (column.accessor as string);
    const newDirection =
      sortColumn === colId && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(colId, newDirection);
  };

  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-sm', className)}>
      <table className="w-full text-left text-sm text-[var(--color-text-primary)] whitespace-nowrap">
        <thead className="bg-[var(--color-bg-hover)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
          <tr>
            {columns.map((col, idx) => {
              const colId = col.id || (col.accessor as string);
              const isSortable = sortable && col.sortable;
              return (
                <th
                  key={colId || idx}
                  className={cn(
                    'px-4 py-3',
                    isSortable && 'cursor-pointer select-none hover:bg-[var(--color-border)]/30 transition-colors',
                    col.className
                  )}
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {isSortable && sortColumn === colId && (
                      <span className="text-[var(--color-primary)]">
                        {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'transition-colors hover:bg-[var(--color-bg-hover)]/60',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, colIndex) => (
                  <td key={col.id || colIndex} className={cn('px-4 py-3', col.className)}>
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}