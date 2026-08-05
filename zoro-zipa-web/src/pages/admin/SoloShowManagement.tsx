import { Plus } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'

export function SoloShowManagement() {
  return (
    <div>
      <AdminHeader
        title="Gestion des Solo Shows"
        subtitle="Gérez vos solo shows"
        actions={<button className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"><Plus size={15} /> Nouveau</button>}
      />
      <DataTable rows={[]} rowKey={(r) => r.id} columns={[]} />
    </div>
  )
}
