import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'

export function OrderManagement() {
  return (
    <div>
      <AdminHeader title="Gestion des Commandes" subtitle="Commandes clients" />
      <DataTable rows={[]} rowKey={(r) => r.id} columns={[]} />
    </div>
  )
}
