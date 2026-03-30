import { useState, useEffect, useCallback, useMemo } from 'react';
import { orgaosService } from '@/services/orgaos';
import type { Orgao, PaginatedResponse, OrgaoListItem } from '@/types/orgao.types'
import { OrgaoCard } from '@/components/Modals/OrgaoCard';
import { OrgaoFormModal } from '@/components/Modals/OrgaoFormModal';
import { ConfirmDeleteModal } from '@/components/Modals/ConfirmDeleteModal';
import { Loader2, Plus, AlertCircle, Building2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import { PaginationBar } from '@/components/ui/PaginationBar'
import { SortSelector } from '@/components/ui/SortSelector'

const PER_PAGE = 15;

const ORGAO_SORT_OPTIONS = [
  { label: 'Nome A-Z', value: 'name_asc' },
  { label: 'Nome Z-A', value: 'name_desc' },
  { label: 'Mais recentes', value: 'date_desc' },
  { label: 'Mais antigos', value: 'date_asc' },
]

function EmptyState({ term }: { term?: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-10 sm:p-16 text-center">
      <div className="bg-gray-50 dark:bg-gray-800 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Nenhum órgão encontrado</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto text-sm">
        {term
          ? `Nenhum resultado para "${term}". Tente outro nome ou ID.`
          : 'Cadastre uma nova unidade institucional para começar.'}
      </p>
    </div>
  )
}

export function Orgaos() {
  const [data, setData] = useState<PaginatedResponse<Orgao> | null>(null)
  const [allOrgaos, setAllOrgaos] = useState<OrgaoListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(searchQuery, 400)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [orgaoToEdit, setOrgaoToEdit] = useState<Orgao | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [orgaoToDelete, setOrgaoToDelete] = useState<Orgao | null>(null)
  const [sortBy, setSortBy] = useState('name_asc')

  // Carrega lista paginada — usada quando não há busca ativa
  const fetchPaginated = useCallback(async (currentPage: number) => {
    try {
      setLoading(true)
      setError(null)
      const res = await orgaosService.getAllPaginated({ page: currentPage, per_page: PER_PAGE })
      setData(res)
    } catch (err: unknown) {
      console.error(err)
      setError('Falha ao carregar os órgãos.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await orgaosService.getAll()
      setAllOrgaos(res)
    } catch (err: unknown) {
      console.error(err)
      setError('Falha ao carregar os órgãos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debouncedSearch.trim() === '') {
      setAllOrgaos([])
      fetchPaginated(page)
    } else {
      setData(null)
      fetchAll()
    }
  }, [debouncedSearch, page, fetchPaginated, fetchAll])

  const filteredOrgaos = useMemo(() => {
    if (!debouncedSearch.trim()) return []
    const term = debouncedSearch.trim().toLowerCase()
    return allOrgaos.filter(o =>
      o.name.toLowerCase().includes(term) ||
      o.id.toString() === term
    )
  }, [allOrgaos, debouncedSearch])

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const reload = () => {
    if (debouncedSearch.trim() === '') {
      fetchPaginated(page)
    } else {
      fetchAll()
    }
  }

  const handleEdit = (orgao: Orgao) => {
    setOrgaoToEdit(orgao)
    setIsFormOpen(true)
  }

  const handleDeleteRequest = (orgao: Orgao) => {
    setOrgaoToDelete(orgao)
    setIsDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!orgaoToDelete) return
    try {
      await orgaosService.delete(orgaoToDelete.id)
      toast.success('Órgão excluído com sucesso!')
      reload()
    } catch {
      toast.error('Erro ao excluir o órgão. Verifique se existem despesas vinculadas.')
    } finally {
      setIsDeleteOpen(false)
      setOrgaoToDelete(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-24 sm:pb-8">
      <div className="px-3 py-4 sm:px-6 sm:py-6 md:px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto space-y-3">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Órgãos</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Gerenciamento de unidades institucionais</p>
            </div>
            <Button
              onClick={() => { setOrgaoToEdit(null); setIsFormOpen(true); }}
              className="hidden sm:flex h-11 rounded-xl px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Cadastrar Órgão
            </Button>
          </div>

          <form onSubmit={handleSearch} className="relative group w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Input
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Buscar por nome ou ID..."
              className="pl-10 h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus-visible:ring-blue-500 w-full"
            />
          </form>

          <Button
            onClick={() => { setOrgaoToEdit(null); setIsFormOpen(true); }}
            className="sm:hidden w-full h-11 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Cadastrar Órgão
          </Button>

        </div>
      </div>

      <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-end mb-4">
          <SortSelector options={ORGAO_SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
        </div>
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">Carregando unidades...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {debouncedSearch.trim() !== '' ? (
              <>
                {filteredOrgaos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {applySorting(filteredOrgaos).map(orgao => (
                      <OrgaoCard
                        key={orgao.id}
                        orgao={orgao as Orgao}
                        onEdit={() => handleEdit(orgao as Orgao)}
                        onDelete={() => handleDeleteRequest(orgao as Orgao)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState term={debouncedSearch} />
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  {filteredOrgaos.length} resultado{filteredOrgaos.length !== 1 ? 's' : ''} para "{debouncedSearch}"
                </p>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {applySorting(data?.data ?? []).map(orgao => (
                    <OrgaoCard
                      key={orgao.id}
                      orgao={orgao}
                      onEdit={() => handleEdit(orgao)}
                      onDelete={() => handleDeleteRequest(orgao)}
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
      </div>

      <OrgaoFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={orgaoToEdit}
        onSuccess={reload}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Órgão"
        description={`Tem certeza que deseja excluir o órgão "${orgaoToDelete?.name}"?\n\nEssa ação é irreversível e só poderá ser realizada se não houverem despesas vinculadas a este órgão.`}
      />
    </div>
  )
}