// Hook que gerencia os dados financeiros mensais de um cliente específico.
// Expõe lista de meses salvos e operações de leitura, gravação e exclusão.
import { useState, useCallback } from 'react'
import {
  getAvailableMonths,
  getMonthData,
  saveMonthData,
  deleteMonthData,
  emptyMonthData,
  notifyError,
} from '../data/store.js'

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

  // Salva os dados do mês e atualiza a lista de meses disponíveis; retorna false se falhar
  const saveMonth = useCallback(
    async (monthKey, data) => {
      try {
        await saveMonthData(clientId, monthKey, data)
        setMonths(getAvailableMonths(clientId))
        return true
      } catch (err) {
        notifyError(err)
        return false
      }
    },
    [clientId],
  )

  // Remove os dados de um mês e atualiza a lista
  const deleteMonth = useCallback(
    async (monthKey) => {
      try {
        await deleteMonthData(clientId, monthKey)
        setMonths(getAvailableMonths(clientId))
      } catch (err) {
        notifyError(err)
      }
    },
    [clientId],
  )

  return { months, getMonth, saveMonth, deleteMonth, refresh }
}
