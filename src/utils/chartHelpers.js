// Funções que transformam os dados financeiros no formato esperado pelos componentes de gráfico
import { EXPENSE_CATEGORIES } from '../constants/categories.js'
import { formatMonthShort } from './formatters.js'

// Converte o objeto expensesByCategory em array para o gráfico de pizza.
// Filtra categorias com valor zero para não exibir fatias vazias.
export function toExpensePieData(expensesByCategory) {
  return EXPENSE_CATEGORIES
    .map((cat) => ({
      name: cat.label,
      value: expensesByCategory?.[cat.key] || 0,
      color: cat.color,
    }))
    .filter((d) => d.value > 0)
}

// Converte o array de entradas mensais para o formato usado nos gráficos de linha/barra de tendência.
// Cada item vira um ponto com mês abreviado, receitas, despesas, poupança e taxa de poupança em %.
export function toTrendData(entries) {
  return entries.map((e) => ({
    month: formatMonthShort(e.monthKey),
    receitas: e.totalIncome,
    despesas: e.totalExpenses,
    poupanca: e.savings,
    taxaPoupanca: parseFloat((e.savingsRate * 100).toFixed(1)),
  }))
}

// Converte o resumo mensal em linhas para a tabela de detalhamento por categoria.
// Calcula a participação de cada categoria tanto em relação à renda quanto ao total de despesas.
// Retorna ordenado do maior para o menor valor.
export function toCategoryTableData(summary) {
  if (!summary) return []
  return EXPENSE_CATEGORIES
    .map((cat) => ({
      key: cat.key,
      label: cat.label,
      color: cat.color,
      amount: summary.expensesByCategory?.[cat.key] || 0,
      // % que esta categoria representa da renda total
      shareOfIncome: summary.totalIncome > 0
        ? (summary.expensesByCategory?.[cat.key] || 0) / summary.totalIncome
        : 0,
      // % que esta categoria representa do total de despesas
      shareOfExpenses: summary.totalExpenses > 0
        ? (summary.expensesByCategory?.[cat.key] || 0) / summary.totalExpenses
        : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}
