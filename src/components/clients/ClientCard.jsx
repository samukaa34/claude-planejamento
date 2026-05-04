import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button.jsx'
import { formatMonthLabel } from '../../utils/formatters.js'
import { getAvailableMonths } from '../../data/localStorage.js'

export function ClientCard({ client, onEdit, onDelete }) {
  const navigate = useNavigate()
  const months = getAvailableMonths(client.id)
  const lastMonth = months[0]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex-1 cursor-pointer min-w-0"
          onClick={() => navigate(`/cliente/${client.id}`)}
        >
          <h3 className="font-semibold text-gray-900 truncate">{client.name}</h3>
          {client.cpf && <p className="text-xs text-gray-500 mt-0.5">CPF: {client.cpf}</p>}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            <span>{months.length} {months.length === 1 ? 'mês registrado' : 'meses registrados'}</span>
            {lastMonth && (
              <span className="text-blue-600">Último: {formatMonthLabel(lastMonth)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(client)}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            title="Editar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(client)}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Excluir"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <Button
          size="sm"
          variant="secondary"
          className="w-full"
          onClick={() => navigate(`/cliente/${client.id}`)}
        >
          Abrir
        </Button>
      </div>
    </div>
  )
}
