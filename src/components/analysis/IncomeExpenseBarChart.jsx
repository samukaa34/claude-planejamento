import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '../../utils/formatters.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm space-y-1">
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

function yFormatter(v) {
  if (v >= 1000) return `R$${(v / 1000).toFixed(0)}k`
  return `R$${v}`
}

export function IncomeExpenseBarChart({ entries }) {
  if (!entries?.length) return null

  const data = entries.map((e) => ({
    month: e.monthKey,
    Receitas: e.totalIncome,
    Despesas: e.totalExpenses,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Receitas vs Despesas</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={yFormatter} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
          <Bar dataKey="Receitas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Despesas" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
