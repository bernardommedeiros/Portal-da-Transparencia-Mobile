import type { PaginatedResponse } from './despesa.types'

export interface Fornecedor {
  id: number
  name: string
  document: string
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface FornecedorListItem {
  id: number
  name: string
  document: string
}

export interface FornecedorPayload {
  name: string
  document: string
}

export interface FornecedorFilters {
  page?: number
  per_page?: number
  search?: string
}

export interface FornecedorCardProps {
  fornecedor: Fornecedor
  onEdit: () => void
  onDelete: () => void
}

export interface FornecedorFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: Fornecedor | null
}

export type { PaginatedResponse }
