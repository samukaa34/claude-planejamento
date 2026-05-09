// Hook que gerencia os dados financeiros mensais de um cliente específico.
// Expõe lista de meses salvos e operações de leitura, gravação e exclusão.
import { useState, useCallback } from 'react'
import {
  getClientData,
  getAvailableMonths,
  getMonthData,
  saveMonthData,
  deleteMonthData,
  emptyMonthData,
} from '../data/localStorage.js'

export function useFinancialData(clientId) {
  // Lista de chaves de meses salvos (ex: ["2024-03", "2024-02"]), em ordem decrescente
  const [months, setMonths] = useState(() => getAvailableMonths(clientId))

  // Atualiza a lista de meses após operações de salvar ou excluir
  const refresh = useCallback(() => setMonths(getAvailableMonths(clientId)), [clientId])

  // Retorna os dados do mês — se não existir, cria uma estrutura vazia com receitas do mês anterior pré-preenchidas
  const getMonth = useCallback(
    (monthKey) => getMonthData(clientId, monthKey) || emptyMonthData(monthKey, clientId),
    [clientId],
  )

  // Salva os dados do mês e atualiza a lista de meses disponíveis
  const saveMonth = useCallback(
    (monthKey, data) => {
      saveMonthData(clientId, monthKey, data)
      setMonths(getAvailableMonths(clientId))
    },
    [clientId],
  )

  // Remove os dados de um mês e atualiza a lista
  const deleteMonth = useCallback(
    (monthKey) => {
      deleteMonthData(clientId, monthKey)
      setMonths(getAvailableMonths(clientId))
    },
    [clientId],
  )

  return { months, getMonth, saveMonth, deleteMonth, refresh }
}
