// Campo de entrada de valor monetário em reais.
// Quando em foco: aceita digitação numérica livre.
// Quando fora do foco: exibe o valor formatado como R$ X.XXX,XX.
import { useState } from 'react'

export function CurrencyInput({ value, onChange, placeholder = 'R$ 0,00', className = '' }) {
  // Controla se o campo está sendo editado agora
  const [focused, setFocused] = useState(false)

  // Valor exibido: enquanto edita mostra o número cru; ao sair formata como moeda
  const formatted = focused
    ? (value || '')
    : value
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
      : ''

  // Converte o texto digitado para número — remove tudo que não é dígito, vírgula ou ponto
  function handleChange(e) {
    const raw = e.target.value.replace(/[^\d,\.]/g, '').replace(',', '.')
    const num = parseFloat(raw)
    onChange(isNaN(num) ? 0 : num)
  }

  return (
    <input
      // Alterna entre type="number" (edição) e type="text" (exibição formatada)
      type={focused ? 'number' : 'text'}
      inputMode="decimal"
      value={focused ? (value || '') : formatted}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className={`block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
    />
  )
}
