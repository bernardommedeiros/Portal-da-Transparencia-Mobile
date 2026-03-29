import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Search } from 'lucide-react';
import { orgaosService } from '@/services/orgaos';
import type { OrgaoListItem } from '@/types/orgaos.types';
import { fornecedoresService } from '@/services/fornecedores';
import type { FornecedorListItem } from '@/types/fornecedores.types';

interface DespesasFilterProps {
  onFilter: (filters: { orgao_id?: string; fornecedor_id?: string; valor_min?: string; valor_max?: string }) => void;
}

export function DespesasFilter({ onFilter }: DespesasFilterProps) {
  const [orgaos, setOrgaos] = useState<OrgaoListItem[]>([])
  const [fornecedores, setFornecedores] = useState<FornecedorListItem[]>([])
  
  const [orgaoId, setOrgaoId] = useState<string>('todos')
  const [fornecedorId, setFornecedorId] = useState<string>('todos')
  const [valorMin, setValorMin] = useState<string>('')
  const [valorMax, setValorMax] = useState<string>('')

  useEffect(() => {
    orgaosService.getAll().then(setOrgaos).catch(console.error)
    fornecedoresService.getAll().then(setFornecedores).catch(console.error)
  }, [])

  const handleApply = () => {
    onFilter({
      orgao_id: orgaoId === 'todos' ? undefined : orgaoId,
      fornecedor_id: fornecedorId === 'todos' ? undefined : fornecedorId,
      valor_min: valorMin || undefined,
      valor_max: valorMax || undefined,
    })
  }

  const clearFilters = () => {
    setOrgaoId('todos')
    setFornecedorId('todos')
    setValorMin('')
    setValorMax('')
    onFilter({})
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Órgão Relacionado</Label>
          <Select value={orgaoId} onValueChange={(v) => setOrgaoId(v || 'todos')}>
            <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Todos os Órgãos">
                {orgaoId === 'todos' ? 'Todos os Órgãos' : orgaos.find(o => o.id.toString() === orgaoId)?.name || 'Todos os Órgãos'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Órgãos</SelectItem>
              {orgaos.map(o => (
                <SelectItem key={o.id} value={o.id.toString()}>{o.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Fornecedor</Label>
          <Select value={fornecedorId} onValueChange={(v) => setFornecedorId(v || 'todos')}>
            <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Todos os Fornecedores">
                {fornecedorId === 'todos' ? 'Todos os Fornecedores' : fornecedores.find(f => f.id.toString() === fornecedorId)?.name || 'Todos os Fornecedores'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Fornecedores</SelectItem>
              {fornecedores.map(f => (
                <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Valor Mín. (R$)</Label>
          <Input 
            type="number" 
            placeholder="0.00" 
            value={valorMin} 
            onChange={e => setValorMin(e.target.value)}
            className="bg-gray-50 dark:bg-gray-900"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Valor Máx. (R$)</Label>
          <Input 
            type="number" 
            placeholder="10000.00" 
            value={valorMax} 
            onChange={e => setValorMax(e.target.value)}
            className="bg-gray-50 dark:bg-gray-900"
          />
        </div>

      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
          <X className="w-4 h-4 mr-2" />
          Limpar
        </Button>
        <Button size="sm" onClick={handleApply}>
          <Search className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
      </div>

    </div>
  )
}
