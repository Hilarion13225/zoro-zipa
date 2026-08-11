import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => number | string
  emptyLabel?: string
}

/**
 * Minimal, elegant admin table.
 * Desktop/tablet: classic table (horizontal scroll if columns overflow).
 * Mobile: each row becomes a stacked card — the first column acts as the
 * card's title, the rest are shown as label/value pairs. Far more usable
 * on a phone than a cramped multi-column table.
 */
export function DataTable<T>({ columns, rows, rowKey, emptyLabel = 'Aucune donnée.' }: DataTableProps<T>) {
  const [titleColumn, ...restColumns] = columns

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto border border-ink/10 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-[11px] uppercase tracking-widest text-ink/40">
              {columns.map((c) => (
                <th key={c.header} className={`px-5 py-4 font-medium ${c.className ?? ''}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-ink/5 transition-colors last:border-0 hover:bg-ivory">
                {columns.map((c) => (
                  <td key={c.header} className={`px-5 py-3.5 ${c.className ?? ''}`}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-ink/40">
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="rounded-lg border border-ink/10 bg-white p-4">
            <div className="mb-2 text-sm font-medium text-ink">{titleColumn.render(row)}</div>
            <div className="space-y-1.5 border-t border-ink/5 pt-2">
              {restColumns.map((c) => (
                <div key={c.header} className="flex items-center justify-between gap-3 text-sm">
                  <span className="shrink-0 text-xs uppercase tracking-wide text-ink/40">{c.header}</span>
                  <span className="text-right text-ink/80">{c.render(row)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="py-10 text-center text-ink/40">{emptyLabel}</p>
        )}
      </div>
    </>
  )
}