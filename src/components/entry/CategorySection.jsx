import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { EntryRow } from './EntryRow.jsx'
import { formatCurrency } from '../../utils/formatters.js'

export function CategorySection({ label, items, onChange, accentColor }) {
  const [open, setOpen] = useState(true)

  const total = items.reduce((s, i) => s + (i.amount || 0), 0)

  function addItem() {
    onChange([...items, { id: uuidv4(), description: '', amount: 0 }])
  }

  function updateItem(updated) {
    onChange(items.map((i) => (i.id === updated.id ? updated : i)))
  }

  function deleteItem(id) {
    onChange(items.filter((i) => i.id !== id))
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {accentColor && (
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: accentColor }} />
          )}
          <span className="font-medium text-sm text-gray-800">{label}</span>
          <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <span className="text-sm font-semibold text-gray-700">{formatCurrency(total)}</span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-3 pt-2 space-y-0.5 bg-white">
          {items.length === 0 && (
            <p className="text-xs text-gray-400 py-2">Nenhum item. Clique em "+" para adicionar.</p>
          )}
          {items.map((item) => (
            <EntryRow
              key={item.id}
              item={item}
              onUpdate={updateItem}
              onDelete={() => deleteItem(item.id)}
            />
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar item
          </button>
        </div>
      )}
    </div>
  )
}
