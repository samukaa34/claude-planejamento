import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { toTrendData } from '../../utils/chartHelpers.js'
import { formatCurrency } from '../../utils/formatters.js'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm space-y-1">
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-medium">
            {p.name === 'Poupança (%)' ? `${p.value}%` : formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function MonthlyTrendChart({ entries }) {
  if (!entries || entries.length < 2) return null

  const data = toTrendData(entries)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Evolução Mensal</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis
            yAxisId="left"
            tickFormatter={(v) => v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11 }}
            domain={[-20, 60]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
          <Bar yAxisId="left" dataKey="receitas" name="Receitas" fill="#3b82f6" opacity={0.7} radius={[3, 3, 0, 0]} />
          <Bar yAxisId="left" dataKey="despesas" name="Despesas" fill="#f97316" opacity={0.7} radius={[3, 3, 0, 0]} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="taxaPoupanca"
            name="Poupança (%)"
            stroke="#16a34a"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
