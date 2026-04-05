import type { ReactNode } from 'react'
import { DataTable, type DataTableColumn } from '@/components/base/DataTable'

interface ResourceTableProps<TData> {
  columns: ReadonlyArray<DataTableColumn<TData>>
  data: ReadonlyArray<TData>
  getRowId: (row: TData) => string | number
  caption?: string
  emptyTitle?: string
  emptyDescription?: string
}

export function ResourceTable<TData>(props: ResourceTableProps<TData>) {
  return <DataTable {...props} />
}

export type ResourceTableColumn<TData> = DataTableColumn<TData>
export type ResourceTableAction = ReactNode
