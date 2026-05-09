// Lista de insights gerados automaticamente pela análise financeira.
// Cada insight é exibido em um cartão azul com ícone de informação.
export function InsightsList({ insights }) {
  // Não renderiza nada se não houver insights
  if (!insights?.length) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Análise Automática</h3>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            {/* Ícone de informação (i) */}
            <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
