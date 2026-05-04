const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const PCT = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 })

export function formatCurrency(value) {
  return BRL.format(value ?? 0)
}

export function formatPercent(value) {
  return PCT.format(value ?? 0)
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-')
  return `${MONTHS_PT[parseInt(month, 10) - 1]} ${year}`
}

export function formatMonthShort(monthKey) {
  const [year, month] = monthKey.split('-')
  const yy = year.slice(-2)
  return `${MONTHS_SHORT[parseInt(month, 10) - 1]}/${yy}`
}

export function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function allMonthOptions() {
  const options = []
  const now = new Date()
  for (let y = now.getFullYear(); y >= now.getFullYear() - 2; y--) {
    const maxMonth = y === now.getFullYear() ? now.getMonth() + 1 : 12
    for (let m = maxMonth; m >= 1; m--) {
      const key = `${y}-${String(m).padStart(2, '0')}`
      options.push({ key, label: formatMonthLabel(key) })
    }
  }
  return options
}
