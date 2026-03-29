import type { Despesa } from '@/types/despesa.types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Building2, User } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface DespesaCardProps {
  despesa: Despesa;
  onEdit: () => void;
  onDelete: () => void;
}

export function DespesaCard({ despesa, onEdit, onDelete }: DespesaCardProps) {
  const dateStr = new Date(despesa.created_at).toLocaleDateString('pt-BR')

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow dark:hover:border-gray-600 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3 border-b dark:border-gray-700/50">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight line-clamp-2" title={despesa.descricao}>
            {despesa.descricao}
          </CardTitle>
          <span className="font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800/80 px-2 py-0.5 rounded-md text-sm shrink-0 whitespace-nowrap">
            {formatCurrency(despesa.valor)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 flex-1 space-y-3 pb-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-start gap-2">
          <Building2 className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
          <span className="line-clamp-1 flex-1">{despesa.orgao.name}</span>
        </div>
        
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 shrink-0 text-orange-500 mt-0.5" />
          <span className="line-clamp-1 flex-1 text-xs opacity-90">{despesa.fornecedor.name}</span>
        </div>
        
        <div className="text-[11px] text-gray-400 font-medium pt-2">
          Cadastrada em {dateStr}
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-3 border-t dark:border-gray-700/50 flex justify-end gap-2 bg-gray-50/50 dark:bg-gray-900/20">
        <Button variant="outline" size="sm" onClick={onEdit} className="h-8">
          <Pencil className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300 pointer-events-none" />
          <span className="sr-only">Editar</span>
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete} className="h-8 group">
          <Trash2 className="w-3.5 h-3.5 pointer-events-none group-hover:block" />
          <span className="sr-only">Excluir</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
