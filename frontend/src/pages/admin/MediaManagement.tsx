import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { EntityForm } from '../../components/admin/EntityForm'
import { useMedia } from '../../api/hooks'
import { api } from '../../api/client'
import type { Media } from '../../types'

const MEDIA_FIELDS = [
  { name: 'title', label: 'Titre', type: 'text' as const, required: true },
  { name: 'url', label: 'Fichier', type: 'file' as const, required: true, accept: 'image/*,video/*' },
  { name: 'type', label: 'Type (photo/video)', type: 'text' as const, required: true },
  { name: 'category', label: 'Catégorie', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
]

export function MediaManagement() {
  const { data: medias = [], refetch } = useMedia()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Media | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleCreate = async (data: Record<string, any>) => {
    await api.post('/media', data)
    refetch()
    setShowForm(false)
  }

  const handleUpdate = async (data: Record<string, any>) => {
    if (!editingId) return
    await api.put(`/media/${editingId}`, data)
    refetch()
    setEditingId(null)
    setEditingData(null)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr?')) return
    setDeleting(id)
    try {
      await api.delete(`/media/${id}`)
      refetch()
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (item: Media) => {
    setEditingId(item.id)
    setEditingData(item)
  }

  return (
    <div>
      <AdminHeader
        title="Gestion des Médias"
        subtitle="Photos et vidéos"
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

      {medias.length === 0 ? (
        <div className="rounded-lg border border-ink/10 bg-ivory-dim p-12 text-center">
          <p className="text-ink/60 mb-4">Aucun média pour le moment</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block rounded-full bg-gold px-6 py-2 text-sm font-medium text-ink hover:bg-gold-soft"
          >
            Ajouter le premier
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {medias.map((item) => (
            <div key={item.id} className="rounded-lg border border-ink/10 overflow-hidden bg-white">
              <img src={item.url} alt={item.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <p className="font-medium text-ink mb-1">{item.title}</p>
                <p className="text-xs text-ink/60 mb-3">{item.category}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-sm text-ink/60 hover:text-gold transition-colors"
                  >
                    <Edit2 size={14} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-sm text-ink/60 hover:text-red-600 transition-colors disabled:opacity-50"
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
          title="Ajouter un média"
          fields={MEDIA_FIELDS}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingData && editingId && (
        <EntityForm
          title="Modifier le média"
          fields={MEDIA_FIELDS}
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
