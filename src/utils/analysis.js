// Funções de cálculo e análise financeira usadas pelos hooks e pela página de análise
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories.js'
import {
  RECOMMENDED_SAVINGS_RATE,
  WARNING_SAVINGS_RATE,
  MAX_CATEGORY_SHARE,
  MAX_FIXED_SHARE,
} from '../constants/thresholds.js'

// Soma os valores de um array de itens { amount } — retorna 0 se vazio ou undefined
function sumItems(items) {
  return (items || []).reduce((acc, item) => acc + (item.amount || 0), 0)
}

// Calcula o resumo financeiro completo de um mês:
// totais de receita e despesa por categoria, poupança, taxa de poupança,
// categoria de despesa dominante e quantidade de fontes de renda ativas
export function computeMonthSummary(monthData) {
  if (!monthData) return null

  // Soma cada categoria de receita individualmente
  const incomeByCategory = {}
  for (const cat of INCOME_CATEGORIES) {
    incomeByCategory[cat.key] = sumItems(monthData.income?.[cat.key])
  }

  // Soma cada categoria de despesa individualmente
  const expensesByCategory = {}
  for (const cat of EXPENSE_CATEGORIES) {
    expensesByCategory[cat.key] = sumItems(monthData.expenses?.[cat.key])
  }

  const totalIncome = Object.values(incomeByCategory).reduce((a, b) => a + b, 0)
  const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0)
  const savings = totalIncome - totalExpenses

  // Taxa de poupança = quanto sobrou dividido pela renda total (0 se não há renda)
  const savingsRate = totalIncome > 0 ? savings / totalIncome : 0

  // Encontra a categoria de despesa com maior valor absoluto
  const largestExpenseEntry = EXPENSE_CATEGORIES.reduce(
    (max, cat) => (expensesByCategory[cat.key] > max.value ? { key: cat.key, value: expensesByCategory[cat.key] } : max),
    { key: null, value: -1 },
  )

  // Conta quantas fontes de renda têm valor maior que zero
  const incomeSourceCount = Object.values(incomeByCategory).filter((v) => v > 0).length

  return {
    totalIncome,
    totalExpenses,
    savings,
    savingsRate,
    incomeByCategory,
    expensesByCategory,
    largestExpenseKey: largestExpenseEntry.key,
    largestExpenseValue: largestExpenseEntry.value,
    incomeSourceCount,
  }
}

// Analisa a tendência ao longo de vários meses comparando a primeira metade com a segunda:
// retorna se a taxa de poupança está melhorando, estável ou piorando
export function computeTrend(entries) {
  if (!entries || entries.length < 2) return null

  const rates = entries.map((e) => e.savingsRate)
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length

  // Divide os meses ao meio e compara as médias de cada metade
  const half = Math.floor(entries.length / 2)
  const firstHalfAvg = rates.slice(0, half).reduce((a, b) => a + b, 0) / half
  const secondHalfAvg = rates.slice(-half).reduce((a, b) => a + b, 0) / half

  // Diferença maior que 3% define a direção da tendência
  let trendDirection = 'stable'
  if (secondHalfAvg - firstHalfAvg > 0.03) trendDirection = 'improving'
  if (firstHalfAvg - secondHalfAvg > 0.03) trendDirection = 'worsening'

  // Mês com o maior gasto total no período analisado
  const highestExpensesEntry = entries.reduce(
    (max, e) => (e.totalExpenses > max.totalExpenses ? e : max),
    entries[0],
  )

  return { avgRate, trendDirection, highestExpensesEntry }
}

// Gera frases de análise em português com base no resumo e na tendência do período.
// Cada regra verifica um aspecto financeiro diferente e adiciona um insight ao array.
export function generateInsights(summary, trend, monthKey) {
  if (!summary) return []
  const insights = []

  // Função auxiliar: retorna o label da categoria de despesa pelo key
  const expCatLabel = (key) => EXPENSE_CATEGORIES.find((c) => c.key === key)?.label ?? key

  // Alerta de taxa de poupança abaixo do recomendado
  if (summary.savingsRate < 0) {
    insights.push('Seus gastos são maiores do que sua renda neste período. É necessário reduzir despesas urgentemente.')
  } else if (summary.savingsRate < WARNING_SAVINGS_RATE) {
    insights.push(`Taxa de poupança de ${(summary.savingsRate * 100).toFixed(1)}% — muito abaixo do recomendado de 20%. Revise as despesas com atenção.`)
  } else if (summary.savingsRate < RECOMMENDED_SAVINGS_RATE) {
    insights.push(`Taxa de poupança de ${(summary.savingsRate * 100).toFixed(1)}% — abaixo da meta de 20%. Pequenos ajustes podem fazer diferença.`)
  }

  // Alerta se uma única categoria de despesa consome mais de 40% da renda
  if (summary.totalIncome > 0 && summary.largestExpenseKey) {
    const share = summary.largestExpenseValue / summary.totalIncome
    if (share > MAX_CATEGORY_SHARE) {
      insights.push(`A categoria "${expCatLabel(summary.largestExpenseKey)}" representa ${(share * 100).toFixed(1)}% da sua renda — acima do limite recomendado de 40%.`)
    }
  }

  // Alerta se despesas fixas comprometem mais de 35% da renda
  if (summary.totalIncome > 0) {
    const fixasShare = (summary.expensesByCategory.fixas || 0) / summary.totalIncome
    if (fixasShare > MAX_FIXED_SHARE) {
      insights.push(`Despesas fixas comprometem ${(fixasShare * 100).toFixed(1)}% da renda, acima dos 35% recomendados. Avalie contratos e assinaturas.`)
    }
  }

  // Alerta de dependência de fonte única de renda
  if (summary.incomeSourceCount === 1) {
    insights.push('O cliente depende de uma única fonte de renda. Diversificar pode trazer mais segurança financeira.')
  }

  // Alertas de tendência ao longo dos meses
  if (trend?.trendDirection === 'worsening') {
    insights.push('Os gastos têm aumentado ao longo dos últimos meses. Vale revisar a tendência de consumo.')
  }

  if (trend?.trendDirection === 'improving') {
    insights.push('A taxa de poupança melhorou nos últimos meses. Bom progresso — mantenha o ritmo!')
  }

  // Aviso se 13° foi lançado em mês diferente de dezembro (pode ser adiantamento)
  const month = monthKey ? parseInt(monthKey.split('-')[1], 10) : null
  if (month && month !== 12 && (summary.incomeByCategory?.decimoTerceiro || 0) > 0) {
    insights.push('Foi registrado 13° Salário em mês diferente de dezembro — pode ser adiantamento. Considere reservá-lo.')
  }

  // Mensagem positiva quando não há nenhum problema detectado
  if (insights.length === 0 && summary.totalIncome > 0) {
    insights.push('Situação financeira saudável! Continue monitorando os gastos mensalmente.')
  }

  return insights
}
