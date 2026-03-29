import type { OrgaoCardProps } from '@/types/orgao.types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Building2, Calendar } from 'lucide-react';


export function OrgaoCard({ orgao, onEdit, onDelete }: OrgaoCardProps) {
  const dateStr = new Date(orgao.created_at).toLocaleDateString('pt-BR');

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all dark:hover:border-gray-500 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-700 relative">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 pt-4 pb-3 px-3 sm:pt-6 sm:pb-4 sm:px-4 flex flex-col items-center justify-center relative">
        <div className="bg-white dark:bg-gray-800 p-2.5 sm:p-3.5 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 relative">
          <Building2 className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 relative z-10" />
        </div>
      </div>

      <CardHeader className="pb-2 pt-3 sm:pt-5 flex items-center border-b border-gray-50 dark:border-gray-700/30 mx-3 sm:mx-4">
        <div className="text-center w-full">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {orgao.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 sm:mt-1.5 opacity-90">
            REGISTRO: #{orgao.id.toString().padStart(4, '0')}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-3 sm:pt-4 flex-1 space-y-2 sm:space-y-3 px-4 sm:px-6 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-1 sm:p-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">Data de Registro</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dateStr}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-2 sm:pt-3 sm:pb-3 border-t dark:border-gray-700/50 flex justify-end gap-2 bg-gray-50/50 dark:bg-gray-900/20 px-4 sm:px-6">
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
  );
}
