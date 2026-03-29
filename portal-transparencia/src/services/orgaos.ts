import { api } from './api';
import type { OrgaoListItem, Orgao, OrgaoFilters, OrgaoPayload, PaginatedResponse } from '@/types/orgao.types'

export const orgaosService = {
  getAll: async () => {
    const { data } = await api.get<OrgaoListItem[]>('/orgaos')
    return data
  },

  getAllPaginated: async (filters: OrgaoFilters) => {
    const params: Record<string, string | number> = {
      page: filters.page ?? 1,
      per_page: filters.per_page ?? 15,
    }
    if (filters.search && filters.search.trim() !== '') {
      params['search'] = filters.search.trim()
    }
    const { data } = await api.get<PaginatedResponse<Orgao>>('/orgaos/paginado', { params })
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get<Orgao>(`/orgaos/${id}`)
    return data
  },

  create: async (payload: OrgaoPayload) => {
    const { data } = await api.post<Orgao>('/orgaos', payload)
    return data
  },

  update: async (id: number, payload: OrgaoPayload) => {
    const { data } = await api.put<Orgao>(`/orgaos/${id}`, payload)
    return data
  },

  delete: async (id: number) => {
    await api.delete(`/orgaos/${id}`)
  }
}
