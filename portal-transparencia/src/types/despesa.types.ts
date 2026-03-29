export interface Despesa {
  id: number;
  orgao_id: number;
  fornecedor_id: number;
  descricao: string;
  valor: string;
  created_at: string;
  updated_at: string;
  comprovante_path: string | null;
  comprovante_mime: string | null;
  tenant_id: string;
  orgao: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
  };
  fornecedor: {
    id: number;
    name: string;
    document: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
  };
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: PaginationLink[];
}

export interface DespesaFilters {
  orgao_id?: string | number;
  fornecedor_id?: string | number;
  valor_min?: string;
  valor_max?: string;
  page?: number;
  per_page?: number;
}

export interface DespesaPayload {
  orgao_id: string | number;
  fornecedor_id: string | number;
  descricao: string;
  valor: string;
}
