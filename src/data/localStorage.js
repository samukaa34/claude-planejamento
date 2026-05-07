import { v4 as uuidv4 } from 'uuid'
import { EMPTY_INCOME, EMPTY_EXPENSES } from '../constants/categories.js'

const CLIENTS_KEY = 'fp_clients'

function dataKey(clientId) {
  return `fp_data_${clientId}`
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// ── Clients ──────────────────────────────────────────────────────────────────

export function getClients() {
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveClients(clients) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))
}

export function addClient({ name, cpf = '', email = '', phone = '', notes = '' }) {
  const clients = getClients()
  const now = new Date().toISOString()
  const client = { id: uuidv4(), name, cpf, email, phone, notes, createdAt: now, updatedAt: now }
  clients.push(client)
  saveClients(clients)
  return client
}

export function updateClient(updated) {
  const clients = getClients()
  const idx = clients.findIndex((c) => c.id === updated.id)
  if (idx === -1) return null
  clients[idx] = { ...clients[idx], ...updated, updatedAt: new Date().toISOString() }
  saveClients(clients)
  return clients[idx]
}

export function deleteClient(clientId) {
  const clients = getClients().filter((c) => c.id !== clientId)
  saveClients(clients)
  localStorage.removeItem(dataKey(clientId))
}

// ── Financial data ────────────────────────────────────────────────────────────

export function getClientData(clientId) {
  try {
    return JSON.parse(localStorage.getItem(dataKey(clientId)) || '{}')
  } catch {
    return {}
  }
}

export function getAvailableMonths(clientId) {
  const data = getClientData(clientId)
  return Object.keys(data).sort((a, b) => b.localeCompare(a))
}

export function getMonthData(clientId, monthKey) {
  const data = getClientData(clientId)
  return data[monthKey] || null
}

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

function getPreviousMonthIncome(clientId, monthKey) {
  const months = getAvailableMonths(clientId)
  const referenceMonth = months.find((m) => m !== monthKey)
  if (!referenceMonth) return null
  const data = getMonthData(clientId, referenceMonth)
  return data?.income ? deepClone(data.income) : null
}

export function saveMonthData(clientId, monthKey, monthData) {
  const data = getClientData(clientId)
  data[monthKey] = { ...monthData, savedAt: new Date().toISOString() }
  try {
    localStorage.setItem(dataKey(clientId), JSON.stringify(data))
  } catch {
    alert('Armazenamento local cheio. Exporte os dados de algum cliente para liberar espaço.')
  }
}

export function deleteMonthData(clientId, monthKey) {
  const data = getClientData(clientId)
  delete data[monthKey]
  localStorage.setItem(dataKey(clientId), JSON.stringify(data))
}

// ── Export / Import ───────────────────────────────────────────────────────────

export function exportClientJSON(clientId) {
  const clients = getClients()
  const client = clients.find((c) => c.id === clientId)
  const data = getClientData(clientId)
  return JSON.stringify({ client, data }, null, 2)
}
