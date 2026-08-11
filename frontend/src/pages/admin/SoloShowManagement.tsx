import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { EntityForm } from '../../components/admin/EntityForm'
import { useSoloShows } from '../../api/hooks'
import { api } from '../../api/client'
import type { SoloShow } from '../../types'

const SOLO_SHOW_FIELDS = [
  { name: 'title', label: 'Titre', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const, required: true },
  { name: 'imageUrl', label: 'Image', type: 'file' as const, required: true, accept: 'image/*' },
  { name: 'year', label: 'Année', type: 'text' as const, required: true },
  { name: 'featured', label: 'En vedette', type: 'checkbox' as const },
]

export function SoloShowManagement() {
  const { data: soloShows = [], refetch } = useSoloShows()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<SoloShow | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleCreate = async (data: Record<string, any>) => {
    await api.post('/solo-shows', data)
    refetch()
    setShowForm(false)
  }

  const handleUpdate = async (data: Record<string, any>) => {
    if (!editingId) return
    await api.put(`/solo-shows/${editingId}`, data)
    refetch()
    setEditingId(null)
    setEditingData(null)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr?')) return
    setDeleting(id)
    try {
      await api.delete(`/solo-shows/${id}`)
      refetch()
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (item: SoloShow) => {
    setEditingId(item.id)
    setEditingData(item)
  }

  return (
    <div>
      <AdminHeader
        title="Gestion des Solo Shows"
        subtitle="Vos exhibitions en solo"
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-soft"
          >
            <Plus size={16} />
            Nouveau
          </button>
        }
      />

      {soloShows.length === 0 ? (
        <div className="rounded-lg border border-ink/10 bg-ivory-dim p-12 text-center">
          <p className="text-ink/60 mb-4">Aucun solo show pour le moment</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block rounded-full bg-gold px-6 py-2 text-sm font-medium text-ink hover:bg-gold-soft"
          >
            Créer le premier
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ink/10">
          <table className="w-full">
            <thead className="bg-ivory-dim">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Titre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Année</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Vedette</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-ink">Actions</th>
              </tr>
            </thead>
            <tbody>
              {soloShows.map((item) => (
                <tr key={item.id} className="border-t border-ink/10 hover:bg-ivory-dim/50">
                  <td className="px-6 py-4">
                    <div className="flex gap-4 items-center">
                      <img src={item.imageUrl} alt={item.title} className="h-12 w-12 rounded object-cover" />
                      <p className="font-medium text-ink">{item.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink">{item.year}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        item.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.featured ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-ink/60 hover:text-gold transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="p-2 text-ink/60 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EntityForm
          title="Créer un solo show"
          fields={SOLO_SHOW_FIELDS}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingData && editingId && (
        <EntityForm
          title="Modifier le solo show"
          fields={SOLO_SHOW_FIELDS}
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
