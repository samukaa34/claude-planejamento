import { useMemo } from 'react'
import { getMonthData } from '../data/localStorage.js'
import { computeMonthSummary, computeTrend, generateInsights } from '../utils/analysis.js'

export function useAnalysis(clientId, selectedMonths) {
  return useMemo(() => {
    if (!clientId || !selectedMonths?.length) return null

    const entries = selectedMonths
      .map((mk) => {
        const data = getMonthData(clientId, mk)
        const summary = computeMonthSummary(data)
        return summary ? { monthKey: mk, ...summary } : null
      })
      .filter(Boolean)

    if (!entries.length) return null

    const combined = entries.reduce(
      (acc, e) => ({
        totalIncome: acc.totalIncome + e.totalIncome,
        totalExpenses: acc.totalExpenses + e.totalExpenses,
        savings: acc.savings + e.savings,
        incomeByCategory: mergeCategories(acc.incomeByCategory, e.incomeByCategory),
        expensesByCategory: mergeCategories(acc.expensesByCategory, e.expensesByCategory),
        incomeSourceCount: Math.max(acc.incomeSourceCount, e.incomeSourceCount),
      }),
      {
        totalIncome: 0,
        totalExpenses: 0,
        savings: 0,
        incomeByCategory: {},
        expensesByCategory: {},
        incomeSourceCount: 0,
      },
    )

    combined.savingsRate = combined.totalIncome > 0 ? combined.savings / combined.totalIncome : 0

    const largestExpense = Object.entries(combined.expensesByCategory).reduce(
      (max, [key, val]) => (val > max.value ? { key, value: val } : max),
      { key: null, value: -1 },
    )
    combined.largestExpenseKey = largestExpense.key
    combined.largestExpenseValue = largestExpense.value

    const trend = computeTrend(entries)
    const insights = generateInsights(
      combined,
      trend,
      selectedMonths.length === 1 ? selectedMonths[0] : null,
    )

    return { summary: combined, entries, trend, insights }
  }, [clientId, selectedMonths])
}

function mergeCategories(acc, next) {
  const result = { ...acc }
  for (const [key, val] of Object.entries(next || {})) {
    result[key] = (result[key] || 0) + val
  }
  return result
}
