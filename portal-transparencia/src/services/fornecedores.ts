import { api } from './api'
import type {
  Fornecedor,
  FornecedorListItem,
  FornecedorFilters,
  FornecedorPayload,
  PaginatedResponse,
} from '@/types/fornecedor.types'

export const fornecedoresService = {
  getAll: async (): Promise<FornecedorListItem[]> => {
    const { data } = await api.get<FornecedorListItem[]>('/fornecedores')
    return data
  },

  getAllPaginated: async (filters: FornecedorFilters): Promise<PaginatedResponse<Fornecedor>> => {
    const params: Record<string, string | number> = {
      page: filters.page ?? 1,
      per_page: filters.per_page ?? 15,
    }
    const { data } = await api.get<PaginatedResponse<Fornecedor>>('/fornecedores/paginado', { params })
    return data
  },

  getById: async (id: number): Promise<Fornecedor> => {
    const { data } = await api.get<Fornecedor>(`/fornecedores/${id}`)
    return data
  },

  create: async (payload: FornecedorPayload): Promise<Fornecedor> => {
    const { data } = await api.post<Fornecedor>('/fornecedores', payload)
    return data
  },

  update: async (id: number, payload: FornecedorPayload): Promise<Fornecedor> => {
    const { data } = await api.put<Fornecedor>(`/fornecedores/${id}`, payload)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/fornecedores/${id}`)
  },
}
