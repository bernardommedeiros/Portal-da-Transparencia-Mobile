import { useState } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  MoreVertical,
  Trash2,
  Calendar,
  Building2,
  User,
  Eye,
  Loader2,
  AlertCircle,
  Camera,
  FileUp,
  Image as ImageIcon,
  Download
} from 'lucide-react'
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera'
import { FilePicker } from '@capawesome/capacitor-file-picker'
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
  const [previewType, setPreviewType] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = (file: File | Blob) => {
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      toast.error(`O arquivo é muito grande (${sizeMB}MB). O limite permitido é 5MB.`)
      return false
    }
    return true
  }

  const handleUploadCamera = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 60,
        width: 1600,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      })

      if (image.webPath) {
        setIsUploading(true)
        const response = await fetch(image.webPath)
        const blob = await response.blob()
        
        if (validateFile(blob)) {
          const file = new File([blob], `comprovante_${Date.now()}.jpg`, { type: 'image/jpeg' })
          await despesasService.uploadComprovante(despesa.id, file)
          toast.success('Comprovante enviado com sucesso!')
          onDeleteSuccess()
          onClose()
        }
      }
    } catch (err: any) {
      if (!err.message?.includes('User cancelled')) {
        console.error('Camera Error:', err)
        toast.error(`Erro ao capturar foto: ${err.message || 'Falha no acesso à câmera'}`)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadFile = async () => {
    try {
      const result = await FilePicker.pickFiles({
        types: ['application/pdf', 'image/png', 'image/jpeg'],
        limit: 1,
        readData: true
      })

      if (result.files.length > 0) {
        const fileData = result.files[0]
        setIsUploading(true)
        
        let blob: Blob
        if (fileData.blob) {
          blob = fileData.blob
        } else if (fileData.data) {
          const byteCharacters = atob(fileData.data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          blob = new Blob([byteArray], { type: fileData.mimeType })
        } else {
          throw new Error('Não foi possível ler os dados do arquivo.')
        }

        if (validateFile(blob)) {
          const file = new File([blob], fileData.name, { type: fileData.mimeType })
          await despesasService.uploadComprovante(despesa.id, file)
          toast.success('Comprovante enviado com sucesso!')
          onDeleteSuccess()
          onClose()
        }
      }
    } catch (err: any) {
      if (!err.message?.includes('User cancelled')) {
        console.error(err)
        toast.error('Erro ao selecionar arquivo.')
      }
    } finally {
      setIsUploading(false)
    }
  }

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
      
      setPreviewUrl(url)
      setPreviewType(blob.type)
      setIsPreviewOpen(true)
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
    setPreviewType('')
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
                    <DropdownMenuContent align="end" className="rounded-xl min-w-[180px] p-2">
                    <DropdownMenuLabel>Alterar comprovante</DropdownMenuLabel>
                      <DropdownMenuItem className="flex lg:hidden items-center gap-2 py-2.5 cursor-pointer rounded-lg" onClick={handleUploadCamera}>
                        <Camera className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Tirar Foto</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="lg:flex items-center gap-2 py-2.5 cursor-pointer rounded-lg" onClick={handleUploadFile}>
                        <FileUp className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">Escolher Arquivo</span>
                      </DropdownMenuItem>

                      <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
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
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex flex-col items-center gap-4 border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-3 w-full">
                    <AlertCircle className="w-5 h-5 opacity-40" />
                    <p className="text-sm font-medium">Nenhum comprovante anexado.</p>
                  </div>
                  
                  <div className="lg:hidden w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full h-11 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors shadow-sm"
                          disabled={isUploading}
                        >
                          {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileUp className="w-4 h-4 mr-2" />}
                          Anexar Comprovante
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="rounded-xl min-w-[200px] p-2">
                        <DropdownMenuItem className="flex items-center gap-2 py-3 cursor-pointer rounded-lg px-3" onClick={handleUploadCamera}>
                          <Camera className="w-4 h-4 text-blue-500" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">Tirar Foto</span>
                            <span className="text-[10px] text-gray-400">Usar a câmera do celular</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 py-3 cursor-pointer rounded-lg px-3" onClick={handleUploadFile}>
                          <ImageIcon className="w-4 h-4 text-purple-500" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">Escolher Arquivo</span>
                            <span className="text-[10px] text-gray-400">Imagens ou PDFs (máx 5MB)</span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Button 
                    variant="outline" 
                    className="hidden lg:flex w-full h-11 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-colors shadow-sm"
                    disabled={isUploading}
                    onClick={handleUploadFile}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileUp className="w-4 h-4 mr-2" />}
                    Anexar Comprovante
                  </Button>
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
        <DialogContent className="max-w-[95vw] md:max-w-4xl h-[90vh] p-0 border-none bg-black/95 shadow-2xl overflow-hidden sm:rounded-3xl flex flex-col">
          <div className="relative flex-1 flex items-center justify-center min-h-[40vh] overflow-hidden bg-black/40">
            {previewType === 'application/pdf' ? (
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-none bg-white"
                title="Visualização do Comprovante"
              />
            ) : (
              <img 
                src={previewUrl} 
                alt="Comprovante" 
                className="max-h-full w-auto h-auto object-contain select-none shadow-2xl"
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          </div>
          <div className="bg-white dark:bg-gray-950 border-t dark:border-gray-800 p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleClosePreview} 
              className="w-full sm:w-auto rounded-xl h-12 px-8 font-bold border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Fechar
            </Button>
            
            <a 
              href={previewUrl} 
              download={`comprovante_${despesa.id}.${previewType === 'application/pdf' ? 'pdf' : 'jpg'}`}
              className="w-full sm:w-auto"
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-8 font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                <Download className="w-4 h-4" />
                Baixar Arquivo
              </Button>
            </a>
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
