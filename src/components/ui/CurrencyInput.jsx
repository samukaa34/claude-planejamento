import { useState } from 'react'

export function CurrencyInput({ value, onChange, placeholder = 'R$ 0,00', className = '' }) {
  const [focused, setFocused] = useState(false)

  const formatted = focused
    ? (value || '')
    : value
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
      : ''

  function handleChange(e) {
    const raw = e.target.value.replace(/[^\d,\.]/g, '').replace(',', '.')
    const num = parseFloat(raw)
    onChange(isNaN(num) ? 0 : num)
  }

  return (
    <input
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
