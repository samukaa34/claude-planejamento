// Linha de item de receita ou despesa — descrição, valor e botão de remover.
// Quando showObservation é true (apenas nas despesas), exibe também um campo de observação abaixo.
import { CurrencyInput } from '../ui/CurrencyInput.jsx'

export function EntryRow({ item, onUpdate, onDelete, showObservation }) {
  return (
    <div className="py-1.5">
      {/* Linha principal: descrição + valor + botão remover */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={item.description}
          onChange={(e) => onUpdate({ ...item, description: e.target.value })}
          placeholder="Descrição"
          className="flex-1 min-w-0 rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <div className="w-36 flex-shrink-0">
          <CurrencyInput
            value={item.amount}
            onChange={(amount) => onUpdate({ ...item, amount })}
          />
        </div>
        <button
          onClick={onDelete}
          className="flex-shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors"
          title="Remover"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Campo de observação — aparece apenas nas despesas (showObservation=true).
          O valor é salvo em item.observation e persistido junto com o item no localStorage. */}
      {showObservation && (
        <textarea
          value={item.observation || ''}
          onChange={(e) => onUpdate({ ...item, observation: e.target.value })}
          placeholder="Observação..."
          rows={1}
          className="mt-1 ml-0 block w-full rounded-md border-gray-200 bg-gray-50 text-xs text-gray-600 shadow-sm focus:border-blue-400 focus:ring-blue-400 resize-none"
        />
      )}
    </div>
  )
}
