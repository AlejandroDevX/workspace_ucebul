import type { ColumnDef } from '@tanstack/react-table'
import { DataTable as FoundationDataTable } from 'foundation-ui'
import { useMemo, type ReactNode } from 'react'

interface WorkspaceTableRow<TData> {
  __workspaceRowId: string | number
  __workspaceRow: TData
}

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
  const rows = useMemo<Array<WorkspaceTableRow<TData>>>(
    () =>
      data.map((row) => ({
        __workspaceRowId: getRowId(row),
        __workspaceRow: row,
      })),
    [data, getRowId],
  )

  const columnDefs = useMemo<Array<ColumnDef<WorkspaceTableRow<TData>>>>(
    () =>
      columns.map((column) => ({
        id: column.key,
        header: () => column.header,
        cell: ({ row }) => column.cell(row.original.__workspaceRow),
      })),
    [columns],
  )

  return (
    <div className="data-table">
      <FoundationDataTable
        columns={columnDefs}
        data={rows}
        emptyDescription={emptyDescription}
        emptyTitle={emptyTitle}
        searchable={false}
      />
      {caption ? <span className="sr-only">{caption}</span> : null}
    </div>
  )
}
