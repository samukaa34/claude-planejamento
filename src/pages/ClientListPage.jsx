import { useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { ClientCard } from '../components/clients/ClientCard.jsx'
import { ClientForm } from '../components/clients/ClientForm.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { useClients } from '../hooks/useClients.js'

export function ClientListPage() {
  const { clients, add, update, remove } = useClients()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.cpf || '').includes(search),
  )

  function handleSave(data) {
    if (editTarget) {
      update({ ...editTarget, ...data })
      setEditTarget(null)
    } else {
      add(data)
    }
  }

  function openEdit(client) {
    setEditTarget(client)
    setFormOpen(true)
  }

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

      <ClientForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSave={handleSave}
        initial={editTarget}
      />

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
