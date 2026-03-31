import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  FileText,
  Users,
  Loader2,
  AlertCircle
} from 'lucide-react'
import type { Fornecedor } from '@/types/fornecedor.types'
import { despesasService } from '@/services/despesas'
import type { Despesa, PaginatedResponse } from '@/types/despesa.types'
import { PaginationBar } from '@/components/ui/PaginationBar'

interface FornecedorDetailModalProps {
  isOpen: boolean
  onClose: () => void
  fornecedor: Fornecedor
}

export function FornecedorDetailModal({ isOpen, onClose, fornecedor }: FornecedorDetailModalProps) {
  const [despesasData, setDespesasData] = useState<PaginatedResponse<Despesa> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDespesas = useCallback(async (currentPage: number) => {
    try {
      setLoading(true)
      setError(null)
      const res = await despesasService.getAllPaginated({ 
        fornecedor_id: fornecedor.id,
        page: currentPage, 
        per_page: 5
      })
      setDespesasData(res)
    } catch {
      setError('Falha ao carregar as despesas vinculadas.')
    } finally {
      setLoading(false)
    }
  }, [fornecedor.id])

  useEffect(() => {
    if (isOpen) {
      fetchDespesas(1)
    }
  }, [isOpen, fetchDespesas])

  const dateStr = fornecedor.created_at ? new Date(fornecedor.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) : 'Data não disponível'

  const handlePageChange = (newPage: number) => {
    fetchDespesas(newPage)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-auto max-h-[90vh] flex flex-col rounded-2xl p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-900">
        <div className="p-6 md:p-8 space-y-7 flex-shrink-0">
          <div className="space-y-3 pt-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight break-words">
              {fornecedor.name}
            </h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                  REGISTRO #{(fornecedor.id?.toString() || '0').padStart(4, '0')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <InfoItem 
              icon={<FileText className="w-4 h-4 text-blue-500" />} 
              label="Documento" 
              value={fornecedor.document} 
            />
            <InfoItem 
              icon={<Calendar className="w-4 h-4 text-orange-500" />} 
              label="Data de Cadastro" 
              value={dateStr} 
            />
          </div>
          
          <div className="pt-2 border-b dark:border-gray-800 pb-2">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Users className="w-4 h-4" /> Despesas Vinculadas
            </h4>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-4">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center p-10 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">Carregando despesas...</p>
            </div>
          ) : !despesasData || despesasData.data.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 flex flex-col items-center gap-4 border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-center">
              <AlertCircle className="w-6 h-6 opacity-40" />
              <p className="text-sm font-medium">Nenhuma despesa vinculada a este fornecedor.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {despesasData.data.map(d => (
                  <div key={d.id} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                    <h5 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2" title={d.descricao}>
                      {d.descricao}
                    </h5>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 px-2 py-1 rounded-md text-xs border border-gray-100 dark:border-gray-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(d.valor))}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {d.created_at ? new Date(d.created_at).toLocaleDateString('pt-BR') : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <PaginationBar
                currentPage={despesasData.current_page}
                lastPage={despesasData.last_page}
                total={despesasData.total}
                from={despesasData.from}
                to={despesasData.to}
                onPrev={() => handlePageChange(despesasData.current_page - 1)}
                onNext={() => handlePageChange(despesasData.current_page + 1)}
                hideDetails
              />
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-6 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
          <Button onClick={onClose} variant="outline" className="w-full h-11 rounded-xl">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-1 rounded-md">
          {icon}
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-snug break-words">
        {value}
      </p>
    </div>
  )
}
