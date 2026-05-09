// Página de análise financeira — permite selecionar um ou mais meses e exibe gráficos,
// resumos, alertas e insights automáticos para o cliente
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header.jsx'
import { SummaryCards } from '../components/analysis/SummaryCards.jsx'
import { SavingsRateAlert } from '../components/analysis/SavingsRateAlert.jsx'
import { ExpensePieChart } from '../components/analysis/ExpensePieChart.jsx'
import { IncomeExpenseBarChart } from '../components/analysis/IncomeExpenseBarChart.jsx'
import { MonthlyTrendChart } from '../components/analysis/MonthlyTrendChart.jsx'
import { CategoryBreakdownTable } from '../components/analysis/CategoryBreakdownTable.jsx'
import { InsightsList } from '../components/analysis/InsightsList.jsx'
import { Button } from '../components/ui/Button.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { useClients } from '../hooks/useClients.js'
import { useFinancialData } from '../hooks/useFinancialData.js'
import { useAnalysis } from '../hooks/useAnalysis.js'
import { exportClientJSON } from '../data/localStorage.js'
import { formatMonthLabel } from '../utils/formatters.js'

export function AnalysisPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { find } = useClients()
  const { months } = useFinancialData(clientId)
  const client = find(clientId)

  // Meses ativos no filtro — por padrão todos os meses disponíveis estão selecionados
  const [selectedMonths, setSelectedMonths] = useState(months)

  // Alterna a seleção de um mês: remove se já estava selecionado, adiciona se não estava
  function toggleMonth(mk) {
    setSelectedMonths((prev) =>
      prev.includes(mk) ? prev.filter((m) => m !== mk) : [...prev, mk].sort((a, b) => b.localeCompare(a)),
    )
  }

  // Seleciona todos os meses disponíveis de uma vez
  function selectAll() { setSelectedMonths([...months]) }

  // Limpa a seleção (nenhum mês ativo)
  function selectNone() { setSelectedMonths([]) }

  // Calcula os dados de análise somente para os meses selecionados
  const analysis = useAnalysis(clientId, selectedMonths)

  // Gera e dispara o download do JSON com todos os dados do cliente
  function handleExport() {
    const json = exportClientJSON(clientId)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${client?.name || 'cliente'}-dados.json`
    a.click()
    // Libera a URL temporária criada pelo navegador
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={client?.name || 'Análise'}
        subtitle="Análise Financeira"
        backTo={`/cliente/${clientId}`}
      />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Seletor de período — cada mês vira um botão pill clicável */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Período de Análise</h3>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-xs text-blue-600 hover:underline">Selecionar todos</button>
              <span className="text-gray-300">|</span>
              <button onClick={selectNone} className="text-xs text-gray-500 hover:underline">Limpar</button>
              <span className="text-gray-300">|</span>
              <button onClick={handleExport} className="text-xs text-gray-500 hover:underline">Exportar JSON</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {months.map((mk) => (
              <button
                key={mk}
                onClick={() => toggleMonth(mk)}
                // Azul preenchido quando selecionado, branco com borda quando não
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  selectedMonths.includes(mk)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                {formatMonthLabel(mk)}
              </button>
            ))}
          </div>
        </div>

        {/* Estado vazio quando nenhum mês está selecionado */}
        {!analysis ? (
          <EmptyState
            title="Selecione ao menos um mês"
            description="Escolha um ou mais meses acima para ver a análise financeira."
          />
        ) : (
          <>
            {/* Cartões de resumo numérico */}
            <SummaryCards summary={analysis.summary} />

            {/* Faixa de alerta de taxa de poupança */}
            <SavingsRateAlert savingsRate={analysis.summary.savingsRate} />

            {/* Insights gerados automaticamente pelas regras de analysis.js */}
            <InsightsList insights={analysis.insights} />

            {/* Gráficos de pizza e barras lado a lado em telas grandes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpensePieChart expensesByCategory={analysis.summary.expensesByCategory} />
              <IncomeExpenseBarChart entries={analysis.entries} />
            </div>

            {/* Gráfico de tendência mensal (só aparece com 2+ meses) */}
            <MonthlyTrendChart entries={analysis.entries} />

            {/* Tabela detalhada por categoria de despesa */}
            <CategoryBreakdownTable summary={analysis.summary} />
          </>
        )}
      </main>
    </div>
  )
}
