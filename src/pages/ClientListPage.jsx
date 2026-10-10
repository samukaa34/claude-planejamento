// Página inicial da aplicação — lista todos os clientes cadastrados com busca, criação e exclusão
import { useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { ClientCard } from '../components/clients/ClientCard.jsx'
import { ClientForm } from '../components/clients/ClientForm.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { useClients } from '../hooks/useClients.js'

export function ClientListPage() {
  const { clients, add, update, remove, refresh } = useClients()

  // Dados antigos salvos neste navegador que ainda não foram enviados ao Supabase
  const [legacy, setLegacy] = useState(() => getLegacyData())
  const [importing, setImporting] = useState(false)

  // Envia os dados antigos para o Supabase e atualiza a lista
  async function handleImport() {
    setImporting(true)
    try {
      await importLegacyData(legacy)
      markLegacyImported()
      setLegacy(null)
      refresh()
    } catch (err) {
      notifyError(err)
    }
    setImporting(false)
  }

  // Oculta o aviso sem importar; os dados antigos continuam no navegador
  function dismissImport() {
    markLegacyImported()
    setLegacy(null)
  }

  // Texto da busca por nome ou CPF
  const [search, setSearch] = useState('')

  // Controla abertura do formulário de criação/edição
  const [formOpen, setFormOpen] = useState(false)

  // Cliente sendo editado (null = criação de novo)
  const [editTarget, setEditTarget] = useState(null)

  // Cliente pendente de confirmação de exclusão
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Filtra clientes pelo texto de busca (nome ou CPF)
  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.cpf || '').includes(search),
  )

  // Decide se salva como edição ou criação dependendo de editTarget
  function handleSave(data) {
    if (editTarget) {
      update({ ...editTarget, ...data })
      setEditTarget(null)
    } else {
      add(data)
    }
  }

  // Abre o formulário com os dados do cliente para edição
  function openEdit(client) {
    setEditTarget(client)
    setFormOpen(true)
  }

  // Executa a exclusão após confirmação no modal
  function confirmDelete() {
    if (deleteTarget) {
      remove(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Planejamento Financeiro" subtitle="Assessoria de Investimentos" />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Aviso de importação dos dados que estavam salvos apenas neste navegador */}
        {legacy && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="flex-1 min-w-[240px] text-sm text-blue-900">
              Encontramos {legacy.clients.length}{' '}
              {legacy.clients.length === 1 ? 'cliente salvo' : 'clientes salvos'} neste navegador.
              Deseja importar para a sua conta na nuvem?
            </p>
            <Button size="sm" onClick={handleImport} disabled={importing}>
              {importing ? 'Importando...' : 'Importar'}
            </Button>
            <Button size="sm" variant="ghost" onClick={dismissImport} disabled={importing}>
              Agora não
            </Button>
          </div>
        )}

        {/* Barra de busca + botão de novo cliente */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente por nome ou CPF..."
              className="pl-9 block w-full rounded-lg border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button onClick={() => { setEditTarget(null); setFormOpen(true) }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Cliente
          </Button>
        </div>

        {/* Estado vazio (lista vazia ou sem resultado na busca) ou grid de cards */}
        {filtered.length === 0 ? (
          <EmptyState
            title={search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            description={search ? 'Tente uma busca diferente.' : 'Clique em "Novo Cliente" para começar.'}
            action={
              !search && (
                <Button onClick={() => setFormOpen(true)}>Adicionar primeiro cliente</Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de criação/edição de cliente */}
      <ClientForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSave={handleSave}
        initial={editTarget}
      />

      {/* Modal de confirmação de exclusão */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir cliente"
      >
        <p className="text-sm text-gray-600 mb-5">
          Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>?
          Todos os dados financeiros serão removidos permanentemente.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
        </div>
      </Modal>
    </div>
  )
}
