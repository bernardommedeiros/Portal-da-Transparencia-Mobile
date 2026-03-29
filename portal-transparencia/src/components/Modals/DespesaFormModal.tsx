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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Pencil, PlusCircle } from 'lucide-react';
import { orgaosService } from '@/services/orgaos';
import type { OrgaoListItem } from '@/types/orgaos.types';
import { fornecedoresService } from '@/services/fornecedores';
import type { FornecedorListItem } from '@/types/fornecedores.types';
import { despesasService } from '@/services/despesas';
import type { Despesa, DespesaPayload } from '@/types/despesa.types';
import { toast } from 'sonner';

interface DespesaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Despesa | null;
}

export function DespesaFormModal({ isOpen, onClose, onSuccess, initialData }: DespesaFormModalProps) {
  const isEditing = !!initialData
  
  const [orgaos, setOrgaos] = useState<OrgaoListItem[]>([])
  const [fornecedores, setFornecedores] = useState<FornecedorListItem[]>([])
  
  const [orgaoId, setOrgaoId] = useState<string>('')
  const [fornecedorId, setFornecedorId] = useState<string>('')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      orgaosService.getAll().then(setOrgaos).catch(console.error)
      fornecedoresService.getAll().then(setFornecedores).catch(console.error)

      if (initialData) {
        setOrgaoId(initialData.orgao_id.toString())
        setFornecedorId(initialData.fornecedor_id.toString())
        setDescricao(initialData.descricao)
        setValor(initialData.valor)
      } else {
        setOrgaoId('')
        setFornecedorId('')
        setDescricao('')
        setValor('')
      }
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgaoId || !fornecedorId || !descricao || !valor) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }

    setIsSubmitting(true)
    
    try {
      const payload: DespesaPayload = {
        orgao_id: orgaoId,
        fornecedor_id: fornecedorId,
        descricao,
        valor
      }

      if (isEditing && initialData) {
        await despesasService.update(initialData.id, payload)
        toast.success('Despesa atualizada com sucesso!')
      } else {
        await despesasService.create(payload)
        toast.success('Despesa criada com sucesso!')
      }
      
      onSuccess()
      onClose()
    } catch (err: unknown) {
      console.error(err)
      toast.error(isEditing ? 'Erro ao atualizar despesa' : 'Erro ao criar despesa')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? <Pencil className="w-4 h-4 text-blue-500" /> : <PlusCircle className="w-4 h-4 text-blue-500" />}
            {isEditing ? 'Editar Despesa' : 'Nova Despesa'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          <div className="space-y-2">
            <Label>Órgão <span className="text-red-500">*</span></Label>
            <Select value={orgaoId} onValueChange={(v) => setOrgaoId(v || '')} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um órgão">
                  {orgaoId ? orgaos.find(o => o.id.toString() === orgaoId)?.name || 'Selecione um órgão' : 'Selecione um órgão'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {orgaos.map(o => (
                  <SelectItem key={o.id} value={o.id.toString()}>{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fornecedor <span className="text-red-500">*</span></Label>
            <Select value={fornecedorId} onValueChange={(v) => setFornecedorId(v || '')} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor">
                  {fornecedorId ? fornecedores.find(f => f.id.toString() === fornecedorId)?.name || 'Selecione um fornecedor' : 'Selecione um fornecedor'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {fornecedores.map(f => (
                  <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Descrição <span className="text-red-500">*</span></Label>
            <Input 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)} 
              placeholder="Ex: Aquisição de material X" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Valor (R$) <span className="text-red-500">*</span></Label>
            <Input 
              type="number" 
              step="0.01" 
              value={valor} 
              onChange={e => setValor(e.target.value)} 
              placeholder="1000.50" 
              required 
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !orgaoId || !fornecedorId || !descricao.trim() || !valor}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </div>
          
        </form>
      </DialogContent>
    </Dialog>
  )
}
