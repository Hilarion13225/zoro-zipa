import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { EntityForm } from '../../components/admin/EntityForm'
import { useProducts } from '../../api/hooks'
import { api } from '../../api/client'
import type { Product } from '../../types'

const PRODUCT_FIELDS = [
  { name: 'title', label: 'Titre', type: 'text' as const, required: true, placeholder: 'Ex: Toile Premium' },
  { name: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Décrivez le produit' },
  { name: 'imageUrl', label: 'Image', type: 'file' as const, required: true, accept: 'image/*' },
  { name: 'price', label: 'Prix (€)', type: 'number' as const, required: true },
  { name: 'quantity', label: 'Quantité', type: 'number' as const, required: true },
  { name: 'category', label: 'Catégorie', type: 'text' as const, required: true, placeholder: 'Ex: Toiles, Prints...' },
  { name: 'available', label: 'Disponible', type: 'checkbox' as const },
]

export function ProductManagement() {
  const { data: products = [], refetch } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleCreate = async (data: Record<string, any>) => {
    await api.post('/products', data)
    refetch()
    setShowForm(false)
  }

  const handleUpdate = async (data: Record<string, any>) => {
    if (!editingId) return
    await api.put(`/products/${editingId}`, data)
    refetch()
    setEditingId(null)
    setEditingData(null)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr?')) return
    setDeleting(id)
    try {
      await api.delete(`/products/${id}`)
      refetch()
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditingData(product)
  }

  return (
    <div>
      <AdminHeader
        title="Gestion des Produits"
        subtitle="Gérez votre boutique en ligne"
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
          >
            <Plus size={16} />
            Nouveau produit
          </button>
        }
      />

      {products.length === 0 ? (
        <div className="rounded-lg border border-ink/10 bg-ivory-dim p-12 text-center">
          <p className="text-ink/60 mb-4">Aucun produit pour le moment</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block rounded-full bg-gold px-6 py-2 text-sm font-medium text-ink hover:bg-gold-soft"
          >
            Créer le premier produit
          </button>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-ink/10 md:block">
            <table className="w-full">
              <thead className="bg-ivory-dim">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Produit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Catégorie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Prix</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-ink">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-ink/10 hover:bg-ivory-dim/50">
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-ink">{product.title}</p>
                          <p className="text-xs text-ink/60">{product.description?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink/70">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-ink">{product.price}€</td>
                    <td className="px-6 py-4 text-sm text-ink">{product.quantity}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          product.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.available ? 'En stock' : 'Rupture'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-ink/60 hover:text-gold transition-colors"
                          title="Modifier"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="p-2 text-ink/60 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Supprimer"
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

          <div className="grid gap-4 md:hidden">
            {products.map((product) => (
              <div key={product.id} className="rounded-lg border border-ink/10 p-4">
                <div className="flex gap-3">
                  <img src={product.imageUrl} alt={product.title} className="h-16 w-16 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-ink">{product.title}</p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.available ? 'En stock' : 'Rupture'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">{product.category}</p>
                    <div className="mt-1 flex items-center gap-3 text-sm text-ink/70">
                      <span className="font-medium text-ink">{product.price}€</span>
                      <span>·</span>
                      <span>{product.quantity} en stock</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2 border-t border-ink/10 pt-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/70 hover:border-gold hover:text-gold"
                  >
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
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
          title="Créer un produit"
          fields={PRODUCT_FIELDS}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingData && editingId && (
        <EntityForm
          title="Modifier le produit"
          fields={PRODUCT_FIELDS}
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