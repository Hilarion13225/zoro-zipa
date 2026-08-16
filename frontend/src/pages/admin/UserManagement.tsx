import { useState } from 'react'
import { KeyRound, ShieldCheck, Trash2, X } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'
import { useDeleteEntity, useUpdateEntity, useUsers } from '../../api/hooks'
import type { User, UserRole } from '../../types'
import { formatDate } from '../../utils/format'

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  CLIENT: 'Client',
}

/** Platform user management: roles, activation, deletion, password reset. */
export function UserManagement() {
  const { data: users } = useUsers()
  const update = useUpdateEntity<User & { password?: string }>('users')
  const remove = useDeleteEntity('users')

  const [passwordUser, setPasswordUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const closePasswordModal = () => {
    setPasswordUser(null)
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordUser) return

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas')
      return
    }

    setSaving(true)
    setError('')
    try {
      await update.mutateAsync({ id: passwordUser.id, body: { ...passwordUser, password: newPassword } })
      closePasswordModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <AdminHeader
        title="Gestion des utilisateurs"
        subtitle={`${users?.length ?? 0} utilisateur(s)`}
      />

      <DataTable
        rows={users ?? []}
        rowKey={(u) => u.id}
        columns={[
          { header: 'Nom', render: (u) => <span className="font-medium">{u.name}</span> },
          { header: 'Email', render: (u) => u.email },
          {
            header: 'Rôle',
            render: (u) => (
              <select
                value={u.role}
                onChange={(e) =>
                  update.mutate({ id: u.id, body: { ...u, role: e.target.value as UserRole } })
                }
                className="rounded-full border border-ink/10 px-3 py-1 text-xs outline-none focus:border-gold"
              >
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
            ),
          },
          { header: 'Inscription', render: (u) => formatDate(u.createdAt) },
          {
            header: 'Statut',
            render: (u) => (
              <button
                onClick={() => update.mutate({ id: u.id, body: { ...u, active: !u.active } })}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                  u.active ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ink/50'
                }`}
              >
                <ShieldCheck size={13} /> {u.active ? 'Actif' : 'Inactif'}
              </button>
            ),
          },
          {
            header: 'Actions',
            className: 'text-right',
            render: (u) => (
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => setPasswordUser(u)}
                  title="Changer le mot de passe"
                  className="rounded-full p-2 text-ink/50 hover:bg-gold/10 hover:text-gold"
                >
                  <KeyRound size={15} />
                </button>
                <button
                  onClick={() => remove.mutate(u.id)}
                  title="Supprimer"
                  className="rounded-full p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
      />

      {passwordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Changer le mot de passe</h2>
              <button onClick={closePasswordModal} className="text-ink/40 hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-sm text-ink/60">
              Pour <span className="font-medium text-ink">{passwordUser.name}</span> ({passwordUser.email})
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-ink/70">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  autoFocus
                  required
                  className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-ink/70">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                  className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/70 hover:border-ink/30"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-ink hover:bg-gold-soft disabled:opacity-60"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
