// Camada de persistência — toda leitura e escrita no localStorage passa por aqui.
// Nenhum outro arquivo deve acessar o localStorage diretamente.
import { v4 as uuidv4 } from 'uuid'
import { EMPTY_INCOME, EMPTY_EXPENSES } from '../constants/categories.js'

// Chave fixa onde o array de clientes é armazenado
const CLIENTS_KEY = 'fp_clients'

// Gera a chave de dados financeiros de um cliente específico
function dataKey(clientId) {
  return `fp_data_${clientId}`
}

// Clona profundamente um objeto para evitar mutações acidentais nas estruturas padrão
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// ── Clientes ──────────────────────────────────────────────────────────────────

// Lê todos os clientes do localStorage; retorna array vazio em caso de erro
export function getClients() {
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]')
  } catch {
    return []
  }
}

// Persiste o array de clientes no localStorage
function saveClients(clients) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))
}

// Cria um novo cliente com id único e timestamps; retorna o objeto criado
export function addClient({ name, cpf = '', email = '', phone = '', notes = '' }) {
  const clients = getClients()
  const now = new Date().toISOString()
  const client = { id: uuidv4(), name, cpf, email, phone, notes, createdAt: now, updatedAt: now }
  clients.push(client)
  saveClients(clients)
  return client
}

// Atualiza os campos de um cliente existente e renova o updatedAt
export function updateClient(updated) {
  const clients = getClients()
  const idx = clients.findIndex((c) => c.id === updated.id)
  if (idx === -1) return null
  clients[idx] = { ...clients[idx], ...updated, updatedAt: new Date().toISOString() }
  saveClients(clients)
  return clients[idx]
}

// Remove o cliente da lista e apaga todos os seus dados financeiros
export function deleteClient(clientId) {
  const clients = getClients().filter((c) => c.id !== clientId)
  saveClients(clients)
  localStorage.removeItem(dataKey(clientId))
}

// ── Dados Financeiros ────────────────────────────────────────────────────────

// Lê o objeto completo de dados financeiros de um cliente (todas os meses)
export function getClientData(clientId) {
  try {
    return JSON.parse(localStorage.getItem(dataKey(clientId)) || '{}')
  } catch {
    return {}
  }
}

// Retorna as chaves dos meses salvos ordenadas do mais recente para o mais antigo
export function getAvailableMonths(clientId) {
  const data = getClientData(clientId)
  return Object.keys(data).sort((a, b) => b.localeCompare(a))
}

// Retorna os dados de um mês específico ou null se não existir
export function getMonthData(clientId, monthKey) {
  const data = getClientData(clientId)
  return data[monthKey] || null
}

// Cria um registro de mês vazio.
// Se houver dados anteriores salvos, pré-preenche as receitas do mês mais recente
// para evitar retrabalho de digitação.
export function emptyMonthData(monthKey, clientId) {
  const previousIncome = clientId ? getPreviousMonthIncome(clientId, monthKey) : null
  return {
    monthKey,
    income: previousIncome ?? deepClone(EMPTY_INCOME),
    expenses: deepClone(EMPTY_EXPENSES),
    notes: '',
    savedAt: null,
  }
}

// Encontra o mês mais recentemente salvo (diferente do mês atual) e retorna suas receitas
function getPreviousMonthIncome(clientId, monthKey) {
  const allData = getClientData(clientId)
  const referenceMonth = Object.values(allData)
    .filter((m) => m.monthKey !== monthKey && m.savedAt)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt))[0]
  if (!referenceMonth) return null
  return referenceMonth.income ? deepClone(referenceMonth.income) : null
}

// Salva ou sobrescreve os dados de um mês específico e atualiza o savedAt
export function saveMonthData(clientId, monthKey, monthData) {
  const data = getClientData(clientId)
  data[monthKey] = { ...monthData, savedAt: new Date().toISOString() }
  try {
    localStorage.setItem(dataKey(clientId), JSON.stringify(data))
  } catch {
    // localStorage cheio — avisa o usuário para exportar dados e liberar espaço
    alert('Armazenamento local cheio. Exporte os dados de algum cliente para liberar espaço.')
  }
}

// Remove os dados de um mês do registro do cliente
export function deleteMonthData(clientId, monthKey) {
  const data = getClientData(clientId)
  delete data[monthKey]
  localStorage.setItem(dataKey(clientId), JSON.stringify(data))
}

// ── Exportação ────────────────────────────────────────────────────────────────

// Serializa o cliente e todos os seus dados financeiros em JSON formatado
// para download pelo usuário na página de análise
export function exportClientJSON(clientId) {
  const clients = getClients()
  const client = clients.find((c) => c.id === clientId)
  const data = getClientData(clientId)
  return JSON.stringify({ client, data }, null, 2)
}
