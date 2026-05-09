// Utilitários de formatação de valores para exibição na interface

// Formatador de moeda no padrão brasileiro (ex: R$ 1.234,56)
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// Formatador de percentual com até 1 casa decimal (ex: 23,5%)
const PCT = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 })

// Converte um número para string no formato R$ X.XXX,XX
export function formatCurrency(value) {
  return BRL.format(value ?? 0)
}

// Converte um número (0 a 1) para string percentual (ex: 0.235 → "23,5%")
export function formatPercent(value) {
  return PCT.format(value ?? 0)
}

// Nomes completos dos meses em português — o índice corresponde ao mês (0 = Janeiro)
const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

// Abreviações dos meses usadas nos gráficos
const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// Converte chave "YYYY-MM" para rótulo legível (ex: "2024-03" → "Março 2024")
export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-')
  return `${MONTHS_PT[parseInt(month, 10) - 1]} ${year}`
}

// Converte chave "YYYY-MM" para rótulo curto usado nos eixos dos gráficos (ex: "Mar/24")
export function formatMonthShort(monthKey) {
  const [year, month] = monthKey.split('-')
  const yy = year.slice(-2)
  return `${MONTHS_SHORT[parseInt(month, 10) - 1]}/${yy}`
}

// Retorna a chave do mês atual no formato "YYYY-MM"
export function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// Gera a lista de todos os meses dos últimos 2 anos para o seletor de mês
// Retorna um array de { key, label } em ordem decrescente (mais recente primeiro)
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
