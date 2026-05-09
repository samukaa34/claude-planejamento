// Tela de estado vazio — exibida quando não há itens para mostrar (ex: lista de clientes vazia)
// Recebe um título, descrição opcional e um botão de ação opcional
export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Ícone de gráfico centralizado em círculo cinza */}
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-gray-700 font-semibold text-lg mb-1">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-4 max-w-sm">{description}</p>}
      {/* action é qualquer elemento React — normalmente um botão */}
      {action}
    </div>
  )
}
