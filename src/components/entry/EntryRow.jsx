import { CurrencyInput } from '../ui/CurrencyInput.jsx'

export function EntryRow({ item, onUpdate, onDelete }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
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
  )
}
