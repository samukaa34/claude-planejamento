// Hook que expõe operações CRUD para a lista de clientes.
// Mantém o estado local sincronizado com a camada de dados a cada operação.
import { useState, useCallback } from 'react'
import { getClients, addClient, updateClient, deleteClient, notifyError } from '../data/store.js'

export function useClients() {
  // Carrega a lista inicial da camada de dados (já carregada após o login)
  const [clients, setClients] = useState(() => getClients())

  // Força releitura da camada de dados (usado após operações externas)
  const refresh = useCallback(() => setClients(getClients()), [])

  // Cria um novo cliente, persiste e atualiza o estado local; retorna null se falhar
  const add = useCallback(async (data) => {
    try {
      const client = await addClient(data)
      setClients(getClients())
      return client
    } catch (err) {
      notifyError(err)
      return null
    }
  }, [])

  // Atualiza os dados de um cliente existente; retorna null se falhar
  const update = useCallback(async (data) => {
    try {
      const client = await updateClient(data)
      setClients(getClients())
      return client
    } catch (err) {
      notifyError(err)
      return null
    }
  }, [])

  // Remove um cliente e todos os seus dados financeiros
  const remove = useCallback(async (id) => {
    try {
      await deleteClient(id)
      setClients(getClients())
    } catch (err) {
      notifyError(err)
    }
  }, [])

  // Busca um cliente pelo id no array em memória
  const find = useCallback((id) => clients.find((c) => c.id === id), [clients])

  return { clients, add, update, remove, find, refresh }
}
