import { api } from './api';
import type { OrgaoListItem } from '@/types/orgaos.types';

export const orgaosService = {
  getAll: async () => {
    const { data } = await api.get<OrgaoListItem[]>('/orgaos')
    return data
  }
}
