import { api } from './api';
import type { FornecedorListItem } from '@/types/fornecedores.types';

export const fornecedoresService = {
  getAll: async () => {
    const { data } = await api.get<FornecedorListItem[]>('/fornecedores')
    return data
  }
}
