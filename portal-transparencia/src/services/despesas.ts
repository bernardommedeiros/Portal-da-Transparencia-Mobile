import { api } from './api';
import type { Despesa, PaginatedResponse, DespesaFilters, DespesaPayload } from '@/types/despesa.types';

export const despesasService = {
  getAllPaginated: async (filters?: DespesaFilters) => {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }

    const { data } = await api.get<PaginatedResponse<Despesa>>('/despesas/paginado', { params })
    return data
  },

  create: async (payload: DespesaPayload) => {
    const { data } = await api.post<Despesa>('/despesas', payload)
    return data
  },

  update: async (id: number | string, payload: DespesaPayload) => {
    const { data } = await api.put<Despesa>(`/despesas/${id}`, payload)
    return data
  },

  delete: async (id: number | string) => {
    await api.delete(`/despesas/${id}`)
  },

  getComprovante: async (id: number | string) => {
    const { data } = await api.get(`/despesas/${id}/comprovante`, {
      responseType: 'blob'
    })
    return data
  },

  deleteComprovante: async (id: number | string) => {
    await api.delete(`/despesas/${id}/comprovante`)
  }
}
