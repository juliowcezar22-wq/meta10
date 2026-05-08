'use client'

import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface Column<T> {
  header: string
  accessor: keyof T
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchKey?: keyof T
  emptyMessage?: string
}

export function DataTable<T extends { id: string }>({ 
  data, 
  columns, 
  searchPlaceholder = 'Buscar...', 
  searchKey,
  emptyMessage = 'Nenhum registro encontrado.'
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredData = searchKey && search 
    ? data.filter(item => {
        const val = item[searchKey]
        return String(val).toLowerCase().includes(search.toLowerCase())
      })
    : data

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      {searchKey && (
        <div className="p-4 border-b border-surface-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-9 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-surface-600">
          <thead className="bg-surface-50 border-b border-surface-200 text-surface-500 font-medium">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-surface-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              currentData.map((row) => (
                <tr key={row.id} className="hover:bg-surface-50/50 transition-colors">
                  {columns.map((col, i) => (
                    <td key={i} className="px-6 py-4">
                      {row[col.accessor] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-surface-200 flex items-center justify-between">
          <p className="text-sm text-surface-500">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} até {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} resultados
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded text-surface-500 hover:bg-surface-100 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-surface-700">
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded text-surface-500 hover:bg-surface-100 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
