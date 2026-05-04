import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClientListPage } from './pages/ClientListPage.jsx'
import { ClientDetailPage } from './pages/ClientDetailPage.jsx'
import { MonthEntryPage } from './pages/MonthEntryPage.jsx'
import { AnalysisPage } from './pages/AnalysisPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientListPage />} />
        <Route path="/cliente/:clientId" element={<ClientDetailPage />} />
        <Route path="/cliente/:clientId/mes/:monthKey" element={<MonthEntryPage />} />
        <Route path="/cliente/:clientId/analise" element={<AnalysisPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
