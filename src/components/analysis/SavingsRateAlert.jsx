import { formatPercent } from '../../utils/formatters.js'

export function SavingsRateAlert({ savingsRate }) {
  if (savingsRate === undefined || savingsRate === null) return null

  let bg, text, icon, message

  if (savingsRate < 0) {
    bg = 'bg-red-50 border-red-200'
    text = 'text-red-800'
    icon = '🚨'
    message = `Gastos superiores à renda! O cliente está no vermelho (${formatPercent(savingsRate)}).`
  } else if (savingsRate < 0.1) {
    bg = 'bg-orange-50 border-orange-200'
    text = 'text-orange-800'
    icon = '⚠️'
    message = `Taxa de poupança muito baixa: ${formatPercent(savingsRate)}. Meta recomendada: 20%.`
  } else if (savingsRate < 0.2) {
    bg = 'bg-yellow-50 border-yellow-200'
    text = 'text-yellow-800'
    icon = '⚡'
    message = `Taxa de poupança de ${formatPercent(savingsRate)} — abaixo da meta de 20%. Há espaço para melhorar.`
  } else {
    bg = 'bg-green-50 border-green-200'
    text = 'text-green-800'
    icon = '✅'
    message = `Parabéns! Taxa de poupança saudável: ${formatPercent(savingsRate)}.`
  }

  return (
    <div className={`flex items-start gap-3 border rounded-xl px-5 py-4 ${bg}`}>
      <span className="text-xl flex-shrink-0">{icon}</span>
      <p className={`text-sm font-medium ${text}`}>{message}</p>
    </div>
  )
}
