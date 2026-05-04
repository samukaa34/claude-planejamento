import { formatCurrency, formatPercent } from '../../utils/formatters.js'

function Card({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

export function SummaryCards({ summary }) {
  if (!summary) return null

  const savingsColor =
    summary.savings < 0
      ? 'text-red-600'
      : summary.savingsRate >= 0.2
        ? 'text-green-600'
        : 'text-yellow-600'

  const rateColor =
    summary.savingsRate < 0
      ? 'text-red-600'
      : summary.savingsRate >= 0.2
        ? 'text-green-600'
        : 'text-yellow-600'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        label="Total Receitas"
        value={formatCurrency(summary.totalIncome)}
        color="text-blue-700"
      />
      <Card
        label="Total Despesas"
        value={formatCurrency(summary.totalExpenses)}
        color="text-gray-900"
        sub={summary.totalIncome > 0 ? `${formatPercent(summary.totalExpenses / summary.totalIncome)} da renda` : ''}
      />
      <Card
        label="Valor Poupado"
        value={formatCurrency(summary.savings)}
        color={savingsColor}
      />
      <Card
        label="Taxa de Poupança"
        value={formatPercent(summary.savingsRate)}
        color={rateColor}
        sub="Meta: 20%"
      />
    </div>
  )
}
