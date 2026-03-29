import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/views/Dashboard';
import { Despesas } from '@/views/Despesas/Despesas';
import { Orgaos } from '@/views/Orgaos/Orgaos'
import { Fornecedores } from '@/views/Fornecedores/Fornecedores'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/orgaos" element={<Orgaos />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
