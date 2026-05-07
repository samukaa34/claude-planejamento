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
  const [months, setMonths] = useState(() => getAvailableMonths(clientId))

  const refresh = useCallback(() => setMonths(getAvailableMonths(clientId)), [clientId])

  const getMonth = useCallback(
    (monthKey) => getMonthData(clientId, monthKey) || emptyMonthData(monthKey, clientId),
    [clientId],
  )

  const saveMonth = useCallback(
    (monthKey, data) => {
      saveMonthData(clientId, monthKey, data)
      setMonths(getAvailableMonths(clientId))
    },
    [clientId],
  )

  const deleteMonth = useCallback(
    (monthKey) => {
      deleteMonthData(clientId, monthKey)
      setMonths(getAvailableMonths(clientId))
    },
    [clientId],
  )

  return { months, getMonth, saveMonth, deleteMonth, refresh }
}
