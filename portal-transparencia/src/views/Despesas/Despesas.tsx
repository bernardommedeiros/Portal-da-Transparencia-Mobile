import { useState, useEffect, useCallback, useMemo } from 'react';
import { despesasService } from '@/services/despesas';
import type { Despesa, DespesaFilters } from '@/types/despesa.types';
import { DespesasFilter } from '@/components/Modals/DespesasFilter';
import { DespesaCard } from '@/components/Modals/DespesaCard';
import { DespesaFormModal } from '@/components/Modals/DespesaFormModal';
import { DespesaDetailModal } from '@/components/Modals/DespesaDetailModal';
import { ConfirmDeleteModal } from '@/components/Modals/ConfirmDeleteModal';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { SortSelector } from '@/components/ui/SortSelector';

const DESPESA_SORT_OPTIONS = [
  { label: 'Maior valor', value: 'valor_desc' },
  { label: 'Menor valor', value: 'valor_asc' },
  { label: 'Mais recentes', value: 'date_desc' },
  { label: 'Mais antigos', value: 'date_asc' },
  { label: 'Descrição A-Z', value: 'desc_asc' },
  { label: 'Descrição Z-A', value: 'desc_desc' }
]

export function Despesas() {
  const [allDespesas, setAllDespesas] = useState<Despesa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<Omit<DespesaFilters, 'page' | 'per_page'>>({})
  

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [despesaToEdit, setDespesaToEdit] = useState<Despesa | null>(null)
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [despesaToDelete, setDespesaToDelete] = useState<Despesa | null>(null)

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [despesaSelected, setDespesaSelected] = useState<Despesa | null>(null)
  const [sortBy, setSortBy] = useState('date_desc')
  const [localPage, setLocalPage] = useState(1)

  const loadAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await despesasService.getAll()
      setAllDespesas(res)
    } catch (err: unknown) {
      console.error(err)
      setError('Falha ao carregar as despesas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const reload = () => loadAll()

  const PER_PAGE = 15

  const sortedDespesas = useMemo(() => {
    let items = [...allDespesas]

    if (activeFilters.orgao_id) {
      items = items.filter(d => d.orgao_id.toString() === activeFilters.orgao_id?.toString())
    }
    if (activeFilters.fornecedor_id) {
      items = items.filter(d => d.fornecedor_id.toString() === activeFilters.fornecedor_id?.toString())
    }
    if (activeFilters.valor_min) {
      items = items.filter(d => parseFloat(d.valor) >= parseFloat(activeFilters.valor_min!))
    }
    if (activeFilters.valor_max) {
      items = items.filter(d => parseFloat(d.valor) <= parseFloat(activeFilters.valor_max!))
    }

    switch (sortBy) {
      case 'valor_desc': return items.sort((a, b) => parseFloat(b.valor) - parseFloat(a.valor))
      case 'valor_asc': return items.sort((a, b) => parseFloat(a.valor) - parseFloat(b.valor))
      case 'date_desc': return items.sort((a, b) => b.created_at.localeCompare(a.created_at))
      case 'date_asc': return items.sort((a, b) => a.created_at.localeCompare(b.created_at))
      case 'desc_asc': return items.sort((a, b) => a.descricao.trim().toLowerCase().localeCompare(b.descricao.trim().toLowerCase(), 'pt-BR', { numeric: true }))
      case 'desc_desc': return items.sort((a, b) => b.descricao.trim().toLowerCase().localeCompare(a.descricao.trim().toLowerCase(), 'pt-BR', { numeric: true }))
      default: return items
    }
  }, [allDespesas, sortBy, activeFilters])

  const totalPages = Math.ceil(sortedDespesas.length / PER_PAGE)
  const from = (localPage - 1) * PER_PAGE
  const to = Math.min(from + PER_PAGE, sortedDespesas.length)
  const paginatedDespesas = sortedDespesas.slice(from, to)

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setLocalPage(1)
  }

  const handleApplyFilter = (newFilters: Omit<DespesaFilters, 'page' | 'per_page'>) => {
    setActiveFilters(newFilters)
    setLocalPage(1)
  }

  const handleEdit = (despesa: Despesa) => {
    setDespesaToEdit(despesa)
    setIsFormOpen(true)
  }

  const handleDeleteRequest = (despesa: Despesa) => {
    setDespesaToDelete(despesa)
    setIsDeleteOpen(true)
  }

  const handleViewDetail = (despesa: Despesa) => {
    setDespesaSelected(despesa)
    setIsDetailOpen(true)
  }

  const confirmDelete = async () => {
    if (!despesaToDelete) return
    try {
      await despesasService.delete(despesaToDelete.id)
      toast.success('Despesa excluída com sucesso!')
      reload()
    } catch {
      toast.error('Erro ao excluir a despesa.')
    } finally {
      setIsDeleteOpen(false)
      setDespesaToDelete(null)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Despesas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Listagem de gastos e registros</p>
        </div>
        
        <Button onClick={() => { setDespesaToEdit(null); setIsFormOpen(true) }} className="h-10 sm:h-11 rounded-xl px-4 sm:px-6 w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Nova Despesa
        </Button>
      </div>

      <DespesasFilter onFilter={handleApplyFilter} />

      <div className="flex items-center justify-end">
        <SortSelector options={DESPESA_SORT_OPTIONS} value={sortBy} onChange={handleSortChange} />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedDespesas.map(desp => (
              <DespesaCard 
                key={desp.id} 
                despesa={desp} 
                onEdit={() => handleEdit(desp)} 
                onDelete={() => handleDeleteRequest(desp)}
                onViewDetail={handleViewDetail}
              />
            ))}
            {paginatedDespesas.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                Nenhuma despesa encontrada para os parâmetros atuais.
              </div>
            )}
          </div>

          {sortedDespesas.length > 0 && (
            <PaginationBar
              currentPage={localPage}
              lastPage={totalPages}
              total={sortedDespesas.length}
              from={from + 1}
              to={to}
              onPrev={() => setLocalPage(p => Math.max(1, p - 1))}
              onNext={() => setLocalPage(p => Math.min(totalPages, p + 1))}
            />
          )}
        </>
      )}

      {isFormOpen && (
        <DespesaFormModal 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          initialData={despesaToEdit} 
          onSuccess={reload} 
        />
      )}

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Despesa"
        description={`Tem certeza que deseja excluir a despesa "${despesaToDelete?.descricao}"?\nEsta ação não poderá ser desfeita.`}
      />

      {isDetailOpen && despesaSelected && (
        <DespesaDetailModal 
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false)
            setDespesaSelected(null)
          }}
          despesa={despesaSelected}
          onDeleteSuccess={reload}
        />
      )}
    </div>
  )
}