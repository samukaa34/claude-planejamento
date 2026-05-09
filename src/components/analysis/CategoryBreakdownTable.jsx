// Tabela detalhada de despesas por categoria: valor, % da renda e % das despesas com barra visual
import { toCategoryTableData } from '../../utils/chartHelpers.js'
import { formatCurrency, formatPercent } from '../../utils/formatters.js'

export function CategoryBreakdownTable({ summary }) {
  if (!summary) return null

  // Converte o resumo em linhas ordenadas do maior para o menor valor
  const rows = toCategoryTableData(summary)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Detalhamento por Categoria</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Categoria
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Valor
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                % da Renda
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                % das Despesas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-gray-50">
                {/* Nome da categoria com bolinha colorida */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: row.color }} />
                    <span className="font-medium text-gray-800">{row.label}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-right font-semibold text-gray-900">
                  {formatCurrency(row.amount)}
                </td>
                <td className="px-6 py-3 text-right text-gray-600">
                  {formatPercent(row.shareOfIncome)}
                </td>
                {/* % das despesas com barra de progresso colorida ao lado do número */}
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${Math.min(row.shareOfExpenses * 100, 100)}%`, background: row.color }}
                      />
                    </div>
                    <span className="text-gray-600 w-12 text-right">
                      {formatPercent(row.shareOfExpenses)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}

            {/* Linha de totais no rodapé da tabela */}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-6 py-3 text-gray-700">Total Despesas</td>
              <td className="px-6 py-3 text-right text-gray-900">{formatCurrency(summary.totalExpenses)}</td>
              <td className="px-6 py-3 text-right text-gray-600">
                {summary.totalIncome > 0 ? formatPercent(summary.totalExpenses / summary.totalIncome) : '—'}
              </td>
              <td className="px-6 py-3 text-right text-gray-600">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
