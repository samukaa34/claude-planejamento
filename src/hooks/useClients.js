// Hook que expõe operações CRUD para a lista de clientes.
// Mantém o estado local sincronizado com o localStorage a cada operação.
import { useState, useCallback } from 'react'
import { getClients, addClient, updateClient, deleteClient } from '../data/localStorage.js'

export function useClients() {
  // Carrega a lista inicial direto do localStorage
  const [clients, setClients] = useState(() => getClients())

  // Força releitura do localStorage (usado após operações externas)
  const refresh = useCallback(() => setClients(getClients()), [])

  // Cria um novo cliente, persiste e atualiza o estado local
  const add = useCallback((data) => {
    const client = addClient(data)
    setClients(getClients())
    return client
  }, [])

  // Atualiza os dados de um cliente existente
  const update = useCallback((data) => {
    const client = updateClient(data)
    setClients(getClients())
    return client
  }, [])

  // Remove um cliente e todos os seus dados financeiros
  const remove = useCallback((id) => {
    deleteClient(id)
    setClients(getClients())
  }, [])

  // Busca um cliente pelo id no array em memória
  const find = useCallback((id) => clients.find((c) => c.id === id), [clients])

  return { clients, add, update, remove, find, refresh }
}
