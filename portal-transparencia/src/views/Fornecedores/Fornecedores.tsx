import { useState, useEffect, useCallback, useMemo } from 'react'
import { fornecedoresService } from '@/services/fornecedores'
import type { Fornecedor, PaginatedResponse, FornecedorListItem } from '@/types/fornecedor.types'
import { FornecedorCard } from '@/components/Modals/FornecedorCard'
import { FornecedorFormModal } from '@/components/Modals/FornecedorFormModal'
import { ConfirmDeleteModal } from '@/components/Modals/ConfirmDeleteModal'
import { Loader2, Plus, AlertCircle, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import { PaginationBar } from '@/components/ui/PaginationBar'
import { SortSelector } from '@/components/ui/SortSelector'

const PER_PAGE = 15

const FORNECEDOR_SORT_OPTIONS = [
  { label: 'Nome A-Z', value: 'name_asc' },
  { label: 'Nome Z-A', value: 'name_desc' },
  { label: 'Mais recentes', value: 'date_desc' },
  { label: 'Mais antigos', value: 'date_asc' },
]

function EmptyState({ term }: { term?: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-10 sm:p-16 text-center">
      <div className="bg-gray-50 dark:bg-gray-800 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Nenhum fornecedor encontrado</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto text-sm">
        {term
          ? `Nenhum resultado para "${term}". Tente outro nome, documento ou ID.`
          : 'Cadastre um novo fornecedor para começar.'}
      </p>
    </div>
  )
}

export function Fornecedores() {
  const [data, setData] = useState<PaginatedResponse<Fornecedor> | null>(null)
  const [allFornecedores, setAllFornecedores] = useState<FornecedorListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(searchQuery, 400)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [fornecedorToEdit, setFornecedorToEdit] = useState<Fornecedor | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [fornecedorToDelete, setFornecedorToDelete] = useState<Fornecedor | null>(null)
  const [sortBy, setSortBy] = useState('name_asc')

  const fetchPaginated = useCallback(async (currentPage: number) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fornecedoresService.getAllPaginated({ page: currentPage, per_page: PER_PAGE })
      setData(res)
    } catch (err: unknown) {
      console.error(err)
      setError('Falha ao carregar os fornecedores.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fornecedoresService.getAll()
      setAllFornecedores(res)
    } catch (err: unknown) {
      console.error(err)
      setError('Falha ao carregar os fornecedores.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debouncedSearch.trim() === '') {
      setAllFornecedores([])
      fetchPaginated(page)
    } else {
      setData(null)
      fetchAll()
    }
  }, [debouncedSearch, page, fetchPaginated, fetchAll])

  const filteredFornecedores = useMemo(() => {
    if (!debouncedSearch.trim()) return []
    const term = debouncedSearch.trim().toLowerCase()
    return allFornecedores.filter(f =>
      f.name.toLowerCase().includes(term) ||
      f.document.toLowerCase().includes(term) ||
      f.id.toString() === term
    )
  }, [allFornecedores, debouncedSearch])

  function applySorting<T extends { name: string; created_at?: string; id: number }>(items: T[]): T[] {
    const sorted = [...items]
    switch (sortBy) {
      case 'name_asc': return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      case 'name_desc': return sorted.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'))
      case 'date_desc': return sorted.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
      case 'date_asc': return sorted.sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''))
      default: return sorted
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
  }

  const reload = () => {
    if (debouncedSearch.trim() === '') {
      fetchPaginated(page)
    } else {
      fetchAll()
    }
  }

  const handleEdit = (fornecedor: Fornecedor) => {
    setFornecedorToEdit(fornecedor)
    setIsFormOpen(true)
  }

  const handleDeleteRequest = (fornecedor: Fornecedor) => {
    setFornecedorToDelete(fornecedor)
    setIsDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!fornecedorToDelete) return
    try {
      await fornecedoresService.delete(fornecedorToDelete.id)
      toast.success('Fornecedor excluído com sucesso!')
      reload()
    } catch {
      toast.error('Erro ao excluir o fornecedor. Verifique se existem despesas vinculadas.')
    } finally {
      setIsDeleteOpen(false)
      setFornecedorToDelete(null)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Fornecedores</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gerenciamento de fornecedores cadastrados</p>
        </div>
        <Button
          onClick={() => { setFornecedorToEdit(null); setIsFormOpen(true) }}
          className="h-10 sm:h-11 rounded-xl px-4 sm:px-6 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Cadastrar Fornecedor
        </Button>
      </div>

      <form onSubmit={e => e.preventDefault()} className="relative group w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <Input
          value={searchQuery}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="Buscar por nome, documento ou ID..."
          className="pl-10 h-11 rounded-xl bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500 w-full shadow-sm"
        />
      </form>

      <div className="flex items-center justify-end">
        <SortSelector options={FORNECEDOR_SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
      </div>
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">Carregando fornecedores...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {debouncedSearch.trim() !== '' ? (
              <>
                {filteredFornecedores.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {applySorting(filteredFornecedores).map(f => (
                      <FornecedorCard
                        key={f.id}
                        fornecedor={f as Fornecedor}
                        onEdit={() => handleEdit(f as Fornecedor)}
                        onDelete={() => handleDeleteRequest(f as Fornecedor)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState term={debouncedSearch} />
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  {filteredFornecedores.length} resultado{filteredFornecedores.length !== 1 ? 's' : ''} para "{debouncedSearch}"
                </p>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {applySorting(data?.data ?? []).map(f => (
                    <FornecedorCard
                      key={f.id}
                      fornecedor={f}
                      onEdit={() => handleEdit(f)}
                      onDelete={() => handleDeleteRequest(f)}
                    />
                  ))}
                </div>

                {data?.data.length === 0 && <EmptyState />}

                {data && (
                  <PaginationBar
                    currentPage={data.current_page}
                    lastPage={data.last_page}
                    total={data.total}
                    from={data.from}
                    to={data.to}
                    onPrev={() => setPage(data.current_page - 1)}
                    onNext={() => setPage(data.current_page + 1)}
                  />
                )}
              </>
            )}
          </div>
        )}

      <FornecedorFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={fornecedorToEdit}
        onSuccess={reload}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Fornecedor"
        description={`Tem certeza que deseja excluir o fornecedor "${fornecedorToDelete?.name}"?\n\nEssa ação é irreversível e só poderá ser realizada se não houverem despesas vinculadas a este fornecedor.`}
      />
    </div>
  )
}
