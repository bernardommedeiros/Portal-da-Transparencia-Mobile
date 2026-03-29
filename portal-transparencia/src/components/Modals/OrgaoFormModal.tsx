import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Pencil, PlusCircle, Building2 } from 'lucide-react';
import { orgaosService } from '@/services/orgaos';
import type { OrgaoPayload, OrgaoFormModalProps } from '@/types/orgao.types'
import { toast } from 'sonner'


export function OrgaoFormModal({ isOpen, onClose, onSuccess, initialData }: OrgaoFormModalProps) {
  const isEditing = !!initialData
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '')
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('O nome do órgão é obrigatório.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload: OrgaoPayload = { name: name.trim() }

      if (isEditing && initialData) {
        await orgaosService.update(initialData.id, payload)
        toast.success('Órgão atualizado com sucesso!')
      } else {
        await orgaosService.create(payload)
        toast.success('Órgão cadastrado com sucesso!')
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      console.error(err)
      toast.error(isEditing ? 'Erro ao atualizar o órgão.' : 'Erro ao cadastrar o órgão.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl overflow-hidden p-0 gap-0 border-x-0 border-b-0 sm:border-x sm:border-b sm:rounded-xl">
        <DialogHeader className="px-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg">
              {isEditing ? <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            </div>
            {isEditing ? 'Editar Órgão' : 'Cadastrar Órgão'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 bg-white dark:bg-gray-900">
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nome do Órgão <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Secretaria de Saúde" 
              className="pl-10 h-12 rounded-xl focus-visible:ring-blue-500" required />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-xl h-11 px-6 border-gray-200 dark:border-gray-700">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()} className="rounded-xl h-11 px-6 shadow-md shadow-blue-500/20">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
