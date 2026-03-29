import { useState, useEffect, useCallback } from 'react';
import { despesasService } from '@/services/despesas';
import type { Despesa, PaginatedResponse, DespesaFilters } from '@/types/despesa.types';
import { DespesasFilter } from '../../components/Modals/DespesasFilter';
import { DespesaCard } from '../../components/Modals/DespesaCard';
import { DespesaFormModal } from '../../components/Modals/DespesaFormModal';
import { ConfirmDeleteModal } from '../../components/Modals/ConfirmDeleteModal';
import { Loader2, Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Despesas() {
  const [data, setData] = useState<PaginatedResponse<Despesa> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<DespesaFilters>({ page: 1, per_page: 15 })
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [despesaToEdit, setDespesaToEdit] = useState<Despesa | null>(null)
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [despesaToDelete, setDespesaToDelete] = useState<Despesa | null>(null)

  const loadDespesas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await despesasService.getAllPaginated(filters)
      setData(res)
    } catch (err: unknown) {
      console.error(err)
      setError('Falha ao carregar as despesas.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadDespesas()
  }, [loadDespesas])

  const handleApplyFilter = (newFilters: Omit<DespesaFilters, 'page' | 'per_page'>) => {
    setFilters({ ...newFilters, page: 1, per_page: 15 })
  }

  const handleEdit = (despesa: Despesa) => {
    setDespesaToEdit(despesa)
    setIsFormOpen(true)
  }

  const handleDeleteRequest = (despesa: Despesa) => {
    setDespesaToDelete(despesa)
    setIsDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!despesaToDelete) return
    try {
      await despesasService.delete(despesaToDelete.id)
      toast.success('Despesa excluída com sucesso!')
      loadDespesas()
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
        
        <Button onClick={() => { setDespesaToEdit(null)
          setIsFormOpen(true) }}>
          <Plus className="w-5 h-5 mr-2" />
          Nova Despesa
        </Button>
      </div>

      <DespesasFilter onFilter={handleApplyFilter} />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && !data ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data.map(desp => (
              <DespesaCard 
                key={desp.id} 
                despesa={desp} 
                onEdit={() => handleEdit(desp)} 
                onDelete={() => handleDeleteRequest(desp)} 
              />
            ))}
            {data?.data.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                Nenhuma despesa encontrada para os parâmetros atuais.
              </div>
            )}
          </div>

          {data && data.last_page > 1 && (
            <div className="flex items-center justify-between pt-4 pb-4">
              <span className="text-sm text-gray-500">
                Página {data.current_page} de {data.last_page} ({data.total} itens)
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" size="sm" 
                  disabled={data.current_page === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: data.current_page - 1 }))}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                </Button>
                <Button 
                  variant="outline" size="sm"
                  disabled={data.current_page === data.last_page}
                  onClick={() => setFilters(prev => ({ ...prev, page: data.current_page + 1 }))}
                >
                  Próxima <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {isFormOpen && (
        <DespesaFormModal 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          initialData={despesaToEdit} 
          onSuccess={loadDespesas} 
        />
      )}

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Despesa"
        description={`Tem certeza que deseja excluir a despesa "${despesaToDelete?.descricao}"?\nEsta ação não poderá ser desfeita.`}
      />
    </div>
  )
}
