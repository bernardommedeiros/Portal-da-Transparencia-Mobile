export interface PaginationBarProps {
  currentPage: number
  lastPage: number
  total: number
  from?: number
  to?: number
  onPrev: () => void
  onNext: () => void
}