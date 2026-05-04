import { EXPENSE_CATEGORIES } from '../constants/categories.js'
import { formatMonthShort } from './formatters.js'

export function toExpensePieData(expensesByCategory) {
  return EXPENSE_CATEGORIES
    .map((cat) => ({
      name: cat.label,
      value: expensesByCategory?.[cat.key] || 0,
      color: cat.color,
    }))
    .filter((d) => d.value > 0)
}

export function toTrendData(entries) {
  return entries.map((e) => ({
    month: formatMonthShort(e.monthKey),
    receitas: e.totalIncome,
    despesas: e.totalExpenses,
    poupanca: e.savings,
    taxaPoupanca: parseFloat((e.savingsRate * 100).toFixed(1)),
  }))
}

export function toCategoryTableData(summary) {
  if (!summary) return []
  return EXPENSE_CATEGORIES
    .map((cat) => ({
      key: cat.key,
      label: cat.label,
      color: cat.color,
      amount: summary.expensesByCategory?.[cat.key] || 0,
      shareOfIncome: summary.totalIncome > 0
        ? (summary.expensesByCategory?.[cat.key] || 0) / summary.totalIncome
        : 0,
      shareOfExpenses: summary.totalExpenses > 0
        ? (summary.expensesByCategory?.[cat.key] || 0) / summary.totalExpenses
        : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}
