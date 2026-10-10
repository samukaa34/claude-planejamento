// Camada de persistência — toda leitura e escrita de dados passa por aqui.
// Os dados ficam no Supabase; uma cópia em memória é carregada após o login (loadAll)
// para que as leituras continuem síncronas. As escritas gravam primeiro no Supabase
// e só então atualizam a cópia em memória.
import { v4 as uuidv4 } from 'uuid'
import { supabase } from './supabaseClient.js'
import { EMPTY_INCOME, EMPTY_EXPENSES } from '../constants/categories.js'

// Cópia em memória: lista de clientes e, por cliente, os meses indexados por monthKey
let clients = []
let dataByClient = {}

// Tamanho de página das leituras — o Supabase limita cada resposta a 1000 linhas
const PAGE_SIZE = 1000

// Clona profundamente um objeto para evitar mutações acidentais nas estruturas padrão
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Converte uma linha da tabela clients para o formato usado pela aplicação
function toClient(row) {
  return {
    id: row.id,
    name: row.name,
    cpf: row.cpf,
    email: row.email,
    phone: row.phone,
    notes: row.notes,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

// Converte uma linha da tabela month_data para o registro monthData da aplicação
function toMonthData(row) {
  return {
    monthKey: row.month_key,
    income: row.income,
    expenses: row.expenses,
    notes: row.notes,
    savedAt: new Date(row.saved_at).toISOString(),
  }
}

// Lê todas as linhas de uma tabela, página por página
async function fetchAll(table, orderColumns) {
  const rows = []
  for (let from = 0; ; from += PAGE_SIZE) {
    let query = supabase.from(table).select('*')
    for (const column of orderColumns) query = query.order(column)
    const { data, error } = await query.range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    rows.push(...data)
    if (data.length < PAGE_SIZE) return rows
  }
}

// ── Carga inicial ─────────────────────────────────────────────────────────────

// Carrega do Supabase todos os clientes e meses do usuário autenticado para a memória
export async function loadAll() {
  const [clientRows, monthRows] = await Promise.all([
    fetchAll('clients', ['created_at', 'id']),
    fetchAll('month_data', ['client_id', 'month_key']),
  ])
  clients = clientRows.map(toClient)
  dataByClient = {}
  for (const row of monthRows) {
    dataByClient[row.client_id] ??= {}
    dataByClient[row.client_id][row.month_key] = toMonthData(row)
  }
}

// Esvazia a cópia em memória (usado ao sair da conta)
export function clearCache() {
  clients = []
  dataByClient = {}
}

// Avisa o usuário quando uma gravação no Supabase falha
export function notifyError(err) {
  console.error(err)
  alert('Não foi possível salvar na nuvem. Verifique sua conexão e tente novamente.')
}

// ── Clientes ──────────────────────────────────────────────────────────────────

// Retorna todos os clientes carregados
export function getClients() {
  return [...clients]
}

// Cria um novo cliente com id único; retorna o objeto criado
export async function addClient({ name, cpf = '', email = '', phone = '', notes = '' }) {
  const { data, error } = await supabase
    .from('clients')
    .insert({ id: uuidv4(), name, cpf, email, phone, notes })
    .select()
    .single()
  if (error) throw error
  const client = toClient(data)
  clients.push(client)
  return client
}

// Atualiza os campos de um cliente existente e renova o updatedAt
export async function updateClient({ id, name, cpf, email, phone, notes }) {
  const { data, error } = await supabase
    .from('clients')
    .update({ name, cpf, email, phone, notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const client = toClient(data)
  clients = clients.map((c) => (c.id === id ? client : c))
  return client
}

// Remove o cliente; os dados financeiros dele são apagados em cascata pelo banco
export async function deleteClient(clientId) {
  const { error } = await supabase.from('clients').delete().eq('id', clientId)
  if (error) throw error
  clients = clients.filter((c) => c.id !== clientId)
  delete dataByClient[clientId]
}

// ── Dados Financeiros ────────────────────────────────────────────────────────

// Retorna o objeto completo de dados financeiros de um cliente (todos os meses)
export function getClientData(clientId) {
  return dataByClient[clientId] || {}
}

// Retorna as chaves dos meses salvos ordenadas do mais recente para o mais antigo
export function getAvailableMonths(clientId) {
  return Object.keys(getClientData(clientId)).sort((a, b) => b.localeCompare(a))
}

// Retorna os dados de um mês específico ou null se não existir
export function getMonthData(clientId, monthKey) {
  return getClientData(clientId)[monthKey] || null
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
  const referenceMonth = Object.values(getClientData(clientId))
    .filter((m) => m.monthKey !== monthKey && m.savedAt)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt))[0]
  if (!referenceMonth) return null
  return referenceMonth.income ? deepClone(referenceMonth.income) : null
}

// Salva ou sobrescreve os dados de um mês específico e atualiza o savedAt
export async function saveMonthData(clientId, monthKey, monthData) {
  const { data, error } = await supabase
    .from('month_data')
    .upsert({
      client_id: clientId,
      month_key: monthKey,
      income: monthData.income,
      expenses: monthData.expenses,
      notes: monthData.notes || '',
      saved_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error) throw error
  dataByClient[clientId] ??= {}
  dataByClient[clientId][monthKey] = toMonthData(data)
}

// Remove os dados de um mês do registro do cliente
export async function deleteMonthData(clientId, monthKey) {
  const { error } = await supabase
    .from('month_data')
    .delete()
    .eq('client_id', clientId)
    .eq('month_key', monthKey)
  if (error) throw error
  if (dataByClient[clientId]) delete dataByClient[clientId][monthKey]
}

// ── Exportação ────────────────────────────────────────────────────────────────

// Serializa o cliente e todos os seus dados financeiros em JSON formatado
// para download pelo usuário na página de análise
export function exportClientJSON(clientId) {
  const client = clients.find((c) => c.id === clientId)
  const data = getClientData(clientId)
  return JSON.stringify({ client, data }, null, 2)
}

// ── Importação dos dados antigos ──────────────────────────────────────────────

// Envia para o Supabase os clientes e meses que estavam salvos no navegador
// (formato devolvido por getLegacyData) e recarrega a cópia em memória
export async function importLegacyData({ clients: legacyClients, dataByClient: legacyData }) {
  const now = new Date().toISOString()

  const clientRows = legacyClients.map((c) => ({
    id: c.id,
    name: c.name,
    cpf: c.cpf || '',
    email: c.email || '',
    phone: c.phone || '',
    notes: c.notes || '',
    created_at: c.createdAt || now,
    updated_at: c.updatedAt || now,
  }))
  if (clientRows.length) {
    const { error } = await supabase.from('clients').upsert(clientRows)
    if (error) throw error
  }

  const monthRows = legacyClients.flatMap((c) =>
    Object.entries(legacyData[c.id] || {}).map(([monthKey, m]) => ({
      client_id: c.id,
      month_key: monthKey,
      income: m.income || deepClone(EMPTY_INCOME),
      expenses: m.expenses || deepClone(EMPTY_EXPENSES),
      notes: m.notes || '',
      saved_at: m.savedAt || now,
    })),
  )
  if (monthRows.length) {
    const { error } = await supabase.from('month_data').upsert(monthRows)
    if (error) throw error
  }

  await loadAll()
}
