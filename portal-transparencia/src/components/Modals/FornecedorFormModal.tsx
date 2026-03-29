import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Pencil, PlusCircle, User, FileText } from 'lucide-react'
import { fornecedoresService } from '@/services/fornecedores'
import type { FornecedorPayload, FornecedorFormModalProps } from '@/types/fornecedor.types'
import { toast } from 'sonner'

export function FornecedorFormModal({ isOpen, onClose, onSuccess, initialData }: FornecedorFormModalProps) {
  const isEditing = !!initialData
  const [name, setName] = useState('')
  const [document, setDocument] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '')
      setDocument(initialData?.document ?? '')
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('O nome do fornecedor é obrigatório.')
      return
    }
    if (!document.trim()) {
      toast.error('O documento (CNPJ/CPF) é obrigatório.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload: FornecedorPayload = {
        name: name.trim(),
        document: document.trim(),
      }

      if (isEditing && initialData) {
        await fornecedoresService.update(initialData.id, payload)
        toast.success('Fornecedor atualizado com sucesso!')
      } else {
        await fornecedoresService.create(payload)
        toast.success('Fornecedor cadastrado com sucesso!')
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      console.error(err)
      toast.error(isEditing ? 'Erro ao atualizar o fornecedor.' : 'Erro ao cadastrar o fornecedor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl overflow-hidden p-0 gap-0 border-x-0 border-b-0 sm:border-x sm:border-b sm:rounded-xl">
        <DialogHeader className="px-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg">
              {isEditing
                ? <Pencil className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                : <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            </div>
            {isEditing ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4 bg-white dark:bg-gray-900">
          {/* Nome */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nome <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Limpa Natal Ltda"
                className="pl-9 h-11 rounded-xl focus-visible:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Documento */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              CNPJ / CPF <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                value={document}
                onChange={e => setDocument(e.target.value)}
                placeholder="Ex: 12.345.678/0001-90"
                className="pl-9 h-11 rounded-xl focus-visible:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl h-11 px-6 border-gray-200 dark:border-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !document.trim()}
              className="rounded-xl h-11 px-6 shadow-md shadow-indigo-500/20"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
