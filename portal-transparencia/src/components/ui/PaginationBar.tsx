import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PaginationBarProps } from '@/types/pagination.types'

export function PaginationBar({
  currentPage,
  lastPage,
  total,
  onPrev,
  onNext,
}: PaginationBarProps) {
  if (lastPage <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4 pb-4">
      <span className="text-sm text-gray-500">
        Página {currentPage} de {lastPage} ({total} itens)
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={onPrev}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === lastPage}
          onClick={onNext}
        >
          Próxima <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
