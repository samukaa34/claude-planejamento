// Gráfico de pizza (rosca) mostrando a composição das despesas por categoria
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toExpensePieData } from '../../utils/chartHelpers.js'
import { formatCurrency } from '../../utils/formatters.js'

// Tooltip customizado exibido ao passar o mouse sobre uma fatia da pizza
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-medium text-gray-800">{name}</p>
      <p className="text-gray-600">{formatCurrency(value)}</p>
    </div>
  )
}

export function ExpensePieChart({ expensesByCategory }) {
  // Converte os dados para o formato que o Recharts espera, filtrando categorias zeradas
  const data = toExpensePieData(expensesByCategory)

  // Exibe mensagem quando não há despesas registradas
  if (!data.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Nenhuma despesa registrada</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Composição das Despesas</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          {/* Rosca com raio interno 60 e externo 100 — paddingAngle cria espaço entre fatias */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {/* Cada fatia usa a cor definida na categoria (EXPENSE_CATEGORIES) */}
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
