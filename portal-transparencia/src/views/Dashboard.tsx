import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard';
import type { DataItem, ViewMode, GastoOrgao, GastoFornecedor } from '@/types/dashboard.types';
import { Card, CardHeader, CardTitle, CardAction, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ViewToggle } from '@/components/Dashboard/ViewToggle';
import { ChartRenderer } from '@/components/Dashboard/ChartRenderer';

export function Dashboard() {
  const [state, setState] = useState({
    gastosOrgao: [] as DataItem[],
    gastosFornecedor: [] as DataItem[],
    loading: true,
    error: null as string | null,
  })

  const [orgaoView, setOrgaoView] = useState<ViewMode>('valor')
  const [fornView, setFornView] = useState<ViewMode>('valor')

  useEffect(() => {
    async function loadData() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const [orgaos, fornecedores] = await Promise.all([
          dashboardService.getTotalPorOrgao(),
          dashboardService.getTotalPorFornecedor(),
        ])
        
        if (!Array.isArray(orgaos) || !Array.isArray(fornecedores)) {
          throw new Error('A resposta da API não está no formato esperado.')
        }

        const totalOrgao = orgaos.reduce((acc, curr) => acc + curr.total, 0)
        const totalFornecedor = fornecedores.reduce((acc, curr) => acc + curr.total, 0)

        const dataOrgaos: DataItem[] = orgaos.map((item: GastoOrgao) => ({
          name: item.orgao.name,
          value: item.total,
          percentage: totalOrgao > 0 ? parseFloat(((item.total / totalOrgao) * 100).toFixed(2)) : 0
        }));

        const dataFornecedores: DataItem[] = fornecedores.map((item: GastoFornecedor) => ({
          name: item.fornecedor.name,
          value: item.total,
          percentage: totalFornecedor > 0 ? parseFloat(((item.total / totalFornecedor) * 100).toFixed(2)) : 0
        }));

        setState({
          gastosOrgao: dataOrgaos,
          gastosFornecedor: dataFornecedores,
          loading: false,
          error: null
        });

      } catch (err: unknown) {
        console.error("Erro no loadData:", err)
        
        let errorMessage = 'Falha ao carregar os dados financeiros do Dashboard. Verifique se o backend está respondendo.'
        
        if (err instanceof Error) {
          errorMessage = err.message === 'Network Error' 
            ? 'Erro de conexão: Não foi possível alcançar o servidor.'
            : `Erro ao carregar o painel: ${err.message}`
        }
        
        setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      }
    }

    loadData()
  }, [])

  if (state.loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8 min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Carregando painel...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-100 dark:border-red-900/30">
          <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-lg mb-1">Ops! Ocorreu um erro</h3>
            <p className="text-sm rounded opacity-90">{state.error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full pb-20">
      
      <div className="flex items-center gap-3 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resumo Financeiro</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Acompanhamento das despesas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Card className="flex flex-col h-[420px]">
          <CardHeader>
            <CardTitle>Gastos por Órgão</CardTitle>
            <CardAction>
              <ViewToggle active={orgaoView} onChange={setOrgaoView} />
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 w-full">
            <ChartRenderer data={state.gastosOrgao} viewMode={orgaoView} />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[420px]">
          <CardHeader>
            <CardTitle>Gastos por Fornecedor</CardTitle>
            <CardAction>
              <ViewToggle active={fornView} onChange={setFornView} />
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 w-full">
            <ChartRenderer data={state.gastosFornecedor} viewMode={fornView} />
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
