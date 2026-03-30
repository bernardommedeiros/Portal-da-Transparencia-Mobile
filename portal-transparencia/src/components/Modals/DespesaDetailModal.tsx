import { useState } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  Building2,
  User,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { despesasService } from '@/services/despesas'
import { formatCurrency } from '@/utils/formatters'
import type { DespesaDetailModalProps } from '@/types/despesa.types'
import { toast } from 'sonner'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'

export function DespesaDetailModal({ isOpen, onClose, despesa, onDeleteSuccess }: DespesaDetailModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeletingComprovante, setIsDeletingComprovante] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const dateStr = new Date(despesa.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  const handleViewComprovante = async () => {
    try {
      setIsDownloading(true)
      const blob = await despesasService.getComprovante(despesa.id)
      const url = window.URL.createObjectURL(blob)
      
      if (blob.type.startsWith('image/')) {
        setPreviewUrl(url)
        setIsPreviewOpen(true)
      } else {
        window.open(url, '_blank')
        setTimeout(() => window.URL.revokeObjectURL(url), 60000)
      }
    } catch (err) {
      console.error(err)
      toast.error('Erro ao abrir o comprovante. Verifique se o arquivo existe.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClosePreview = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl('')
    setIsPreviewOpen(false)
  }

  const handleDeleteComprovante = async () => {
    try {
      setIsDeletingComprovante(true)
      await despesasService.deleteComprovante(despesa.id)
      toast.success('Comprovante removido com sucesso!')
      onDeleteSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao remover o comprovante.')
    } finally {
      setIsDeletingComprovante(false)
      setIsConfirmDeleteOpen(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-900">
 
          <div className="p-6 md:p-8 space-y-7">
            <div className="space-y-3 pt-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                {despesa.descricao}
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                    REGISTRO #{despesa.id.toString().padStart(4, '0')}
                  </span>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight">
                    {formatCurrency(despesa.valor)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
              <InfoItem 
                icon={<Building2 className="w-4 h-4 text-blue-500" />} 
                label="Órgão" 
                value={despesa.orgao.name} 
              />
              <InfoItem 
                icon={<User className="w-4 h-4 text-orange-500" />} 
                label="Fornecedor" 
                value={despesa.fornecedor.name} 
              />
              <InfoItem 
                icon={<Calendar className="w-4 h-4" />} 
                label="Data de Cadastro" 
                value={dateStr} 
              />
            </div>

            <div className="pt-6 border-t dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Comprovante
              </p>
              
              {despesa.comprovante_path ? (
                <div className="flex flex-row items-center gap-2">
                  <Button variant="outline" className="flex-1 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-gray-200 dark:border-gray-700 transition-colors font-medium text-blue-600" onClick={handleViewComprovante} disabled={isDownloading}>
                    {isDownloading ? ( <Loader2 className="w-4 h-4 mr-2 animate-spin" />) : ( <Eye className="w-4 h-4 mr-2" />)}
                    Visualizar Arquivo
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-11 w-11 rounded-xl p-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800" disabled={isDeletingComprovante}>
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl min-w-[140px]">
                      <DropdownMenuItem className="flex items-center gap-2 py-2.5 cursor-pointer opacity-50">
                        <Pencil className="w-4 h-4" />
                        <span className="font-medium">Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2 py-2.5 cursor-pointer text-red-500 focus:text-red-500"
                        onClick={() => setIsConfirmDeleteOpen(true)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="font-medium">Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex items-center gap-3 border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-5 h-5 opacity-40" />
                  <p className="text-sm font-medium">Nenhum comprovante anexado.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal 
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteComprovante}
        title="Remover Comprovante"
        description="Tem certeza que deseja remover o comprovante desta despesa? Esta ação não poderá ser desfeita."
      />

      <Dialog open={isPreviewOpen} onOpenChange={(open) => !open && handleClosePreview()}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 border-none bg-black/95 shadow-2xl overflow-hidden sm:rounded-3xl">
          <div className="relative flex items-center justify-center min-h-[40vh]">
            <img 
              src={previewUrl} 
              alt="Comprovante" 
              className="max-h-[80vh] w-auto h-auto object-contain select-none shadow-2xl"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <div className="bg-white dark:bg-gray-950 border-t dark:border-gray-800 p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button variant="outline" onClick={handleClosePreview} className="rounded-xl h-11 px-8 font-bold border-gray-200 dark:border-gray-800">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
      <p className="text-sm font-bold text-gray-700 dark:text-gray-200 line-clamp-2 leading-snug">
        {value}
      </p>
    </div>
  )
}
