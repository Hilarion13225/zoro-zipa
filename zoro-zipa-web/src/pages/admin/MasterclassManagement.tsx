import { Plus } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'

export function MasterclassManagement() {
  return (
    <div>
      <AdminHeader
        title="Gestion des Masterclass"
        subtitle="Photos et texte"
        actions={<button className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"><Plus size={15} /> Ajouter</button>}
      />
      <DataTable rows={[]} rowKey={(r) => r.id} columns={[]} />
    </div>
  )
}
