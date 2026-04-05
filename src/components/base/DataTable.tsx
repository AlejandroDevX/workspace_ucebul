import type { ReactNode } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { cn } from '@/utils/classnames'

export interface DataTableColumn<TData> {
  key: string
  header: ReactNode
  cell: (row: TData) => ReactNode
  className?: string
}

interface DataTableProps<TData> {
  columns: ReadonlyArray<DataTableColumn<TData>>
  data: ReadonlyArray<TData>
  getRowId: (row: TData) => string | number
  caption?: string
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  caption,
  emptyTitle = 'Sin registros',
  emptyDescription = 'No hay información disponible para mostrar todavía.',
}: DataTableProps<TData>) {
  if (data.length === 0) {
    return (
      <div className="data-table data-table--empty">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    )
  }

  return (
    <div className="data-table">
      <table>
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={getRowId(row)}>
              {columns.map((column) => (
                <td key={column.key} className={cn(column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
