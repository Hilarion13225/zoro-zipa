import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { EntityForm } from '../../components/admin/EntityForm'
import { useMasterclasses } from '../../api/hooks'
import { api } from '../../api/client'
import type { Masterclass } from '../../types'

const MASTERCLASS_FIELDS = [
  { name: 'title', label: 'Titre', type: 'text' as const, required: true },
  { name: 'imageUrl', label: 'Image', type: 'file' as const, required: true, accept: 'image/*' },
  { name: 'content', label: 'Contenu', type: 'textarea' as const, required: true },
  { name: 'displayOrder', label: 'Ordre d\'affichage', type: 'number' as const },
]

export function MasterclassManagement() {
  const { data: masterclasses = [], refetch } = useMasterclasses()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Masterclass | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleCreate = async (data: Record<string, any>) => {
    await api.post('/masterclasses', data)
    refetch()
    setShowForm(false)
  }

  const handleUpdate = async (data: Record<string, any>) => {
    if (!editingId) return
    await api.put(`/masterclasses/${editingId}`, data)
    refetch()
    setEditingId(null)
    setEditingData(null)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr?')) return
    setDeleting(id)
    try {
      await api.delete(`/masterclasses/${id}`)
      refetch()
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (item: Masterclass) => {
    setEditingId(item.id)
    setEditingData(item)
  }

  return (
    <div>
      <AdminHeader
        title="Gestion des Masterclass"
        subtitle="Contenus éducatifs"
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-soft"
          >
            <Plus size={16} />
            Ajouter
          </button>
        }
      />

      {masterclasses.length === 0 ? (
        <div className="rounded-lg border border-ink/10 bg-ivory-dim p-12 text-center">
          <p className="text-ink/60 mb-4">Aucune masterclass pour le moment</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block rounded-full bg-gold px-6 py-2 text-sm font-medium text-ink hover:bg-gold-soft"
          >
            Ajouter la première
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {masterclasses
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-white p-4 sm:flex-row sm:gap-6 sm:p-6">
                <img src={item.imageUrl} alt={item.title} className="h-32 w-full rounded object-cover sm:w-32" />
                <div className="flex-1">
                  <p className="font-display text-lg text-ink mb-2">{item.title}</p>
                  <p className="text-sm text-ink/60 mb-4 line-clamp-2">{item.content}</p>
                  <p className="text-xs text-ink/40 mb-4">Ordre: {item.displayOrder}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-ink/60 hover:text-gold transition-colors"
                    >
                      <Edit2 size={14} />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-ink/60 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {showForm && (
        <EntityForm
          title="Ajouter une masterclass"
          fields={MASTERCLASS_FIELDS}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingData && editingId && (
        <EntityForm
          title="Modifier la masterclass"
          fields={MASTERCLASS_FIELDS}
          initialData={editingData}
          onSubmit={handleUpdate}
          onClose={() => {
            setEditingId(null)
            setEditingData(null)
          }}
        />
      )}
    </div>
  )
}