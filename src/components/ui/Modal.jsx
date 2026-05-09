// Modal genérico com overlay escuro, título opcional e fechamento por tecla Escape
import { useEffect } from 'react'

export function Modal({ open, onClose, title, children }) {
  // Registra listener de teclado para fechar o modal ao pressionar Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    // Remove o listener quando o modal fecha ou o componente desmonta
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Não renderiza nada quando o modal está fechado
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay semitransparente — clique fecha o modal */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Painel branco centralizado com o conteúdo */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {/* Botão × no canto superior direito */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
