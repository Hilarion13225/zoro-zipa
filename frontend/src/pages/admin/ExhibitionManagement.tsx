import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { EntityForm } from '../../components/admin/EntityForm'
import { useExhibitions } from '../../api/hooks'
import { api } from '../../api/client'
import { formatDateRange } from '../../utils/format'
import type { Exhibition } from '../../types'

const EXHIBITION_FIELDS = [
  { name: 'title', label: 'Titre', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const, required: true },
  { name: 'imageUrl', label: 'Image', type: 'file' as const, required: true, accept: 'image/*' },
  { name: 'location', label: 'Lieu', type: 'text' as const, required: true },
  { name: 'startDate', label: 'Date de début', type: 'date' as const, required: true },
  { name: 'endDate', label: 'Date de fin', type: 'date' as const, required: true },
  { name: 'active', label: 'Active', type: 'checkbox' as const },
]

export function ExhibitionManagement() {
  const { data: exhibitions = [], refetch } = useExhibitions()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Exhibition | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState('')

  const handleCreate = async (data: Record<string, any>) => {
    try {
      setError('')
      await api.post('/exhibitions', data)
      refetch()
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
    }
  }

  const handleUpdate = async (data: Record<string, any>) => {
    if (!editingId) return
    try {
      setError('')
      await api.put(`/exhibitions/${editingId}`, data)
      refetch()
      setEditingId(null)
      setEditingData(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr?')) return
    setDeleting(id)
    try {
      setError('')
      await api.delete(`/exhibitions/${id}`)
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (item: Exhibition) => {
    setEditingId(item.id)
    setEditingData(item)
  }

  return (
    <div>
      <AdminHeader
        title="Gestion des Expositions"
        subtitle="Vos exhibitions"
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-soft"
          >
            <Plus size={16} />
            Nouvelle expo
          </button>
        }
      />

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {exhibitions.length === 0 ? (
        <div className="rounded-lg border border-ink/10 bg-ivory-dim p-12 text-center">
          <p className="text-ink/60 mb-4">Aucune exposition pour le moment</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block rounded-full bg-gold px-6 py-2 text-sm font-medium text-ink hover:bg-gold-soft"
          >
            Créer la première
          </button>
        </div>
      ) : (
        <>
          {/* Desktop / tablet: table layout */}
          <div className="hidden overflow-x-auto rounded-lg border border-ink/10 md:block">
            <table className="w-full">
              <thead className="bg-ivory-dim">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Exposition</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Lieu</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Dates</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-ink">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exhibitions.map((item) => (
                  <tr key={item.id} className="border-t border-ink/10 hover:bg-ivory-dim/50">
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
                        <img src={item.imageUrl} alt={item.title} className="h-12 w-12 rounded object-cover" />
                        <div>
                          <p className="font-medium text-ink">{item.title}</p>
                          <p className="text-xs text-ink/60">{item.description?.substring(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink">{item.location}</td>
                    <td className="px-6 py-4 text-sm text-ink/70">
                      {formatDateRange(item.startDate, item.endDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.active ? 'Active' : 'Inactive'}
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

          {/* Mobile: stacked cards, easier to read/tap than a squeezed table */}
          <div className="grid gap-4 md:hidden">
            {exhibitions.map((item) => (
              <div key={item.id} className="rounded-lg border border-ink/10 p-4">
                <div className="flex gap-3">
                  <img src={item.imageUrl} alt={item.title} className="h-16 w-16 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-ink">{item.title}</p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">{item.location}</p>
                    <p className="mt-0.5 text-sm text-ink/70">
                      {formatDateRange(item.startDate, item.endDate)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2 border-t border-ink/10 pt-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/70 hover:border-gold hover:text-gold"
                  >
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/70 hover:border-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <EntityForm
          title="Créer une exposition"
          fields={EXHIBITION_FIELDS}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingData && editingId && (
        <EntityForm
          title="Modifier l'exposition"
          fields={EXHIBITION_FIELDS}
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