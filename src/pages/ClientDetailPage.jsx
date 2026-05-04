import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { useClients } from '../hooks/useClients.js'
import { useFinancialData } from '../hooks/useFinancialData.js'
import { computeMonthSummary } from '../utils/analysis.js'
import { getMonthData } from '../data/localStorage.js'
import { formatCurrency, formatPercent, formatMonthLabel, allMonthOptions, currentMonthKey } from '../utils/formatters.js'

function savingsColor(rate) {
  if (rate < 0) return 'red'
  if (rate < 0.1) return 'orange'
  if (rate < 0.2) return 'yellow'
  return 'green'
}

export function ClientDetailPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { find } = useClients()
  const { months, deleteMonth } = useFinancialData(clientId)
  const client = find(clientId)

  const [monthPickerOpen, setMonthPickerOpen] = useState(false)
  const [selectedNewMonth, setSelectedNewMonth] = useState(currentMonthKey())
  const [deleteTarget, setDeleteTarget] = useState(null)

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Cliente não encontrado" backTo="/" />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <EmptyState title="Cliente não encontrado" description="Este cliente não existe ou foi removido." />
        </main>
      </div>
    )
  }

  const availableNewMonths = allMonthOptions().filter((o) => !months.includes(o.key))

  function openNewMonth() {
    const first = availableNewMonths[0]?.key || currentMonthKey()
    setSelectedNewMonth(first)
    setMonthPickerOpen(true)
  }

  function goToMonth(monthKey) {
    navigate(`/cliente/${clientId}/mes/${monthKey}`)
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteMonth(deleteTarget)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={client.name}
        subtitle={client.cpf || client.email || ''}
        backTo="/"
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-700">
            Meses Registrados ({months.length})
          </h2>
          <div className="flex gap-2">
            {months.length > 0 && (
              <Button variant="secondary" onClick={() => navigate(`/cliente/${clientId}/analise`)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Ver Análise
              </Button>
            )}
            <Button onClick={openNewMonth} disabled={availableNewMonths.length === 0}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Mês
            </Button>
          </div>
        </div>

        {months.length === 0 ? (
          <EmptyState
            title="Nenhum mês registrado"
            description="Adicione um mês para começar a registrar as finanças deste cliente."
            action={<Button onClick={openNewMonth}>Adicionar primeiro mês</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {months.map((monthKey) => {
              const data = getMonthData(clientId, monthKey)
              const summary = computeMonthSummary(data)
              const rate = summary?.savingsRate ?? 0

              return (
                <div
                  key={monthKey}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{formatMonthLabel(monthKey)}</h3>
                    <Badge color={savingsColor(rate)}>{formatPercent(rate)}</Badge>
                  </div>
                  {summary && (
                    <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Receitas</span>
                        <span className="font-medium text-blue-700">{formatCurrency(summary.totalIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Despesas</span>
                        <span className="font-medium text-gray-900">{formatCurrency(summary.totalExpenses)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-100 pt-1.5">
                        <span>Poupança</span>
                        <span className={`font-semibold ${summary.savings >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                          {formatCurrency(summary.savings)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => goToMonth(monthKey)}>
                      Editar
                    </Button>
                    <button
                      onClick={() => setDeleteTarget(monthKey)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Excluir mês"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Month picker modal */}
      <Modal open={monthPickerOpen} onClose={() => setMonthPickerOpen(false)} title="Selecionar Mês">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mês de referência</label>
            <select
              value={selectedNewMonth}
              onChange={(e) => setSelectedNewMonth(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {availableNewMonths.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setMonthPickerOpen(false)}>Cancelar</Button>
            <Button onClick={() => { setMonthPickerOpen(false); goToMonth(selectedNewMonth) }}>
              Continuar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete month modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Excluir mês">
        <p className="text-sm text-gray-600 mb-5">
          Tem certeza que deseja excluir os dados de <strong>{deleteTarget ? formatMonthLabel(deleteTarget) : ''}</strong>?
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
        </div>
      </Modal>
    </div>
  )
}
