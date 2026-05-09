// Componente raiz — define todas as rotas da aplicação usando React Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClientListPage } from './pages/ClientListPage.jsx'
import { ClientDetailPage } from './pages/ClientDetailPage.jsx'
import { MonthEntryPage } from './pages/MonthEntryPage.jsx'
import { AnalysisPage } from './pages/AnalysisPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial: lista de clientes */}
        <Route path="/" element={<ClientListPage />} />

        {/* Detalhe do cliente: lista os meses registrados */}
        <Route path="/cliente/:clientId" element={<ClientDetailPage />} />

        {/* Entrada de dados de um mês específico */}
        <Route path="/cliente/:clientId/mes/:monthKey" element={<MonthEntryPage />} />

        {/* Página de análise financeira do cliente */}
        <Route path="/cliente/:clientId/analise" element={<AnalysisPage />} />

        {/* Qualquer rota desconhecida redireciona para a raiz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
