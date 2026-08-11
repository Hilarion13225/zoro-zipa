import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { useOrders } from '../../api/hooks'
import { api } from '../../api/client'
import type { PurchaseOrder } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED']

export function OrderManagement() {
  const { data: orders = [], refetch } = useOrders()
  const [updating, setUpdating] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleStatusChange = async (order: PurchaseOrder, newStatus: string) => {
    setUpdating(order.id)
    try {
      await api.put(`/orders/${order.id}`, {
        ...order,
        status: newStatus,
      })
      refetch()
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr?')) return
    setDeleting(id)
    try {
      await api.delete(`/orders/${id}`)
      refetch()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <AdminHeader
        title="Gestion des Commandes"
        subtitle="Suivez les commandes clients"
      />

      {orders.length === 0 ? (
        <div className="rounded-lg border border-ink/10 bg-ivory-dim p-12 text-center">
          <p className="text-ink/60 mb-4">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ink/10">
          <table className="w-full">
            <thead className="bg-ivory-dim">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Produit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Quantité</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Prix Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-ink">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-ink/10 hover:bg-ivory-dim/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-ink">{order.customerName}</p>
                      <p className="text-xs text-ink/60">{order.customerEmail}</p>
                      <p className="text-xs text-ink/60">{order.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink">{order.productTitle}</td>
                  <td className="px-6 py-4 text-sm text-ink font-medium">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gold">
                    {(order.price * order.quantity).toFixed(2)}€
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      disabled={updating === order.id}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                        STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink/60">
                    {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(order.id)}
                      disabled={deleting === order.id}
                      className="p-2 text-ink/60 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
