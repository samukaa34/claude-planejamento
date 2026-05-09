// Página de lançamento de dados mensais — receitas e despesas de um mês específico
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header.jsx'
import { CategorySection } from '../components/entry/CategorySection.jsx'
import { Button } from '../components/ui/Button.jsx'
import { useClients } from '../hooks/useClients.js'
import { useFinancialData } from '../hooks/useFinancialData.js'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/categories.js'
import { formatCurrency, formatMonthLabel } from '../utils/formatters.js'

export function MonthEntryPage() {
  const { clientId, monthKey } = useParams()
  const navigate = useNavigate()
  const { find } = useClients()
  const { getMonth, saveMonth } = useFinancialData(clientId)
  const client = find(clientId)

  // Estado do formulário — inicia com os dados já salvos ou estrutura vazia com receitas anteriores
  const [formData, setFormData] = useState(() => getMonth(monthKey))

  // Indica se os dados foram salvos desde a última alteração
  const [saved, setSaved] = useState(false)

  // Recarrega os dados ao navegar para um mês diferente sem desmontar o componente
  useEffect(() => {
    setFormData(getMonth(monthKey))
    setSaved(false)
  }, [monthKey])

  // Atualiza os itens de uma categoria de receita específica no estado do formulário
  function setIncomeCategory(key, items) {
    setFormData((prev) => ({
      ...prev,
      income: { ...prev.income, [key]: items },
    }))
    setSaved(false)
  }

  // Atualiza os itens de uma categoria de despesa específica no estado do formulário
  function setExpenseCategory(key, items) {
    setFormData((prev) => ({
      ...prev,
      expenses: { ...prev.expenses, [key]: items },
    }))
    setSaved(false)
  }

  // Soma todos os valores de um mapa de categorias (receitas ou despesas)
  function totalOf(categoryMap, categories) {
    return categories.reduce(
      (sum, cat) => sum + (categoryMap[cat.key] || []).reduce((s, i) => s + (i.amount || 0), 0),
      0,
    )
  }

  const totalIncome = totalOf(formData.income, INCOME_CATEGORIES)
  const totalExpenses = totalOf(formData.expenses, EXPENSE_CATEGORIES)
  const savings = totalIncome - totalExpenses

  // Persiste os dados no localStorage e marca como salvo
  function handleSave() {
    saveMonth(monthKey, formData)
    setSaved(true)
  }

  // Salva e navega direto para a página de análise do cliente
  function handleSaveAndAnalyze() {
    saveMonth(monthKey, formData)
    navigate(`/cliente/${clientId}/analise`)
  }

  // Limpa todos os dados do mês após confirmação — despesas ficam zeradas, receitas também
  function handleClear() {
    if (!window.confirm('Deseja limpar todos os dados deste mês?')) return
    const fresh = {
      monthKey,
      income: Object.fromEntries(INCOME_CATEGORIES.map((c) => [c.key, []])),
      expenses: Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c.key, []])),
      notes: '',
      savedAt: null,
    }
    setFormData(fresh)
    setSaved(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header
        title={client?.name || 'Cliente'}
        subtitle={formatMonthLabel(monthKey)}
        backTo={`/cliente/${clientId}`}
      />

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna de Receitas — sem campo de observação por item */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Receitas
            </h2>
            <div className="space-y-2">
              {INCOME_CATEGORIES.map((cat) => (
                <CategorySection
                  key={cat.key}
                  label={cat.label}
                  items={formData.income[cat.key] || []}
                  onChange={(items) => setIncomeCategory(cat.key, items)}
                />
              ))}
            </div>
          </div>

          {/* Coluna de Despesas — showObservation ativa o campo de observação por item */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              Despesas
            </h2>
            <div className="space-y-2">
              {EXPENSE_CATEGORIES.map((cat) => (
                <CategorySection
                  key={cat.key}
                  label={cat.label}
                  items={formData.expenses[cat.key] || []}
                  onChange={(items) => setExpenseCategory(cat.key, items)}
                  accentColor={cat.color}
                  showObservation
                />
              ))}
            </div>
          </div>
        </div>

        {/* Observações gerais do mês — campo livre de texto */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações do mês</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
            rows={2}
            placeholder="Contexto adicional sobre o mês..."
            className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </main>

      {/* Barra fixa no rodapé com totais e botões de ação */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-40">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          {/* Resumo financeiro em três colunas */}
          <div className="flex-1 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-xs text-gray-500">Total Receitas</p>
              <p className="font-semibold text-blue-700">{formatCurrency(totalIncome)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Despesas</p>
              <p className="font-semibold text-gray-900">{formatCurrency(totalExpenses)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Poupança</p>
              <p className={`font-semibold ${savings >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {formatCurrency(savings)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleClear}>Limpar</Button>
            {/* Botão Salvar muda para "Salvo ✓" após a primeira gravação */}
            <Button variant="secondary" size="sm" onClick={handleSave}>
              {saved ? 'Salvo ✓' : 'Salvar'}
            </Button>
            <Button size="sm" onClick={handleSaveAndAnalyze}>
              Analisar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
