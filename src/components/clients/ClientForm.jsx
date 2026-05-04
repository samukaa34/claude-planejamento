import { useState } from 'react'
import { Modal } from '../ui/Modal.jsx'
import { Button } from '../ui/Button.jsx'

const EMPTY = { name: '', cpf: '', email: '', phone: '', notes: '' }

export function ClientForm({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || EMPTY)

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    if (!form.name.trim()) return
    onSave(form)
    setForm(EMPTY)
    onClose()
  }

  function handleClose() {
    setForm(initial || EMPTY)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={initial ? 'Editar Cliente' : 'Novo Cliente'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Nome completo do cliente"
            className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              value={form.cpf}
              onChange={(e) => set('cpf', e.target.value)}
              placeholder="000.000.000-00"
              className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="(11) 99999-9999"
              className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="cliente@email.com"
            className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={2}
            placeholder="Anotações sobre o cliente..."
            className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 pt-2 justify-end">
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>Salvar</Button>
        </div>
      </div>
    </Modal>
  )
}
