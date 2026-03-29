import type { PaginatedResponse } from './despesa.types'

export interface Orgao {
  id: number
  name: string
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface OrgaoListItem {
  id: number
  name: string
}

export interface OrgaoPayload {
  name: string
}

export interface OrgaoFilters {
  page?: number
  per_page?: number
  search?: string
}

export interface OrgaoCardProps {
  orgao: Orgao
  onEdit: () => void
  onDelete: () => void
}

export interface OrgaoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: Orgao | null
}

export type { PaginatedResponse }
