// Leitura dos dados antigos que ficavam no localStorage antes da migração para o Supabase.
// Serve apenas para a importação única feita em ClientListPage; a persistência atual
// está em store.js. Nenhum outro arquivo deve acessar o localStorage diretamente.

// Chave fixa onde o array de clientes era armazenado
const CLIENTS_KEY = 'fp_clients'

// Marca que os dados antigos já foram importados (ou dispensados) neste navegador
const IMPORTED_KEY = 'fp_imported_at'

// Gera a chave de dados financeiros de um cliente específico
function dataKey(clientId) {
  return `fp_data_${clientId}`
}

// Lê e interpreta um valor JSON; retorna o padrão em caso de erro
function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

// Retorna { clients, dataByClient } com os dados antigos ainda não importados,
// ou null se não houver nada pendente
export function getLegacyData() {
  if (localStorage.getItem(IMPORTED_KEY)) return null
  const clients = readJSON(CLIENTS_KEY, [])
  if (!Array.isArray(clients) || clients.length === 0) return null
  const dataByClient = Object.fromEntries(clients.map((c) => [c.id, readJSON(dataKey(c.id), {})]))
  return { clients, dataByClient }
}

// Registra que a importação foi concluída; os dados antigos são mantidos como cópia de segurança
export function markLegacyImported() {
  localStorage.setItem(IMPORTED_KEY, new Date().toISOString())
}
