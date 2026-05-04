import { useState, useCallback } from 'react'
import { getClients, addClient, updateClient, deleteClient } from '../data/localStorage.js'

export function useClients() {
  const [clients, setClients] = useState(() => getClients())

  const refresh = useCallback(() => setClients(getClients()), [])

  const add = useCallback((data) => {
    const client = addClient(data)
    setClients(getClients())
    return client
  }, [])

  const update = useCallback((data) => {
    const client = updateClient(data)
    setClients(getClients())
    return client
  }, [])

  const remove = useCallback((id) => {
    deleteClient(id)
    setClients(getClients())
  }, [])

  const find = useCallback((id) => clients.find((c) => c.id === id), [clients])

  return { clients, add, update, remove, find, refresh }
}
