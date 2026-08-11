import { useState } from 'react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { FormField, inputClass } from '../../components/admin/FormField'
import { ImageUpload } from '../../components/admin/ImageUpload'
import { Modal } from '../../components/Modal'
import { useArtists, useUpdateEntity } from '../../api/hooks'
import type { Artist } from '../../types'

export function ProfileManagement() {
  const { data: artists } = useArtists()
  const update = useUpdateEntity<Artist>('artists')

  const artist = artists?.[0] // Zoro Zipa (first and only artist)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Partial<Artist> | null>(null)

  const openEdit = () => {
    if (artist) {
      setForm({
        name: artist.name,
        portraitUrl: artist.portraitUrl,
        nationality: artist.nationality,
        style: artist.style,
        bio: artist.bio,
        journey: artist.journey,
      })
      setModalOpen(true)
    }
  }

  const submit = () => {
    if (!artist || !form) return
    update.mutate({ id: artist.id, body: form }, {
      onSuccess: () => {
        setModalOpen(false)
      },
    })
  }

  if (!artist) {
    return <p className="px-6 pt-40 text-center text-ink/40">Profil introuvable.</p>
  }

  return (
    <div>
      <AdminHeader
        title="Gestion du profil"
        subtitle={`Profil de ${artist.name}`}
        actions={
          <button
            onClick={openEdit}
            className="rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            Modifier le profil
          </button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Photo de profil */}
        <div className="border border-ink/10 bg-white p-6 rounded-lg">
          <h3 className="font-display text-lg mb-4">Photo de profil</h3>
          <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
            <img
              src={artist.portraitUrl}
              alt={artist.name}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-xs text-ink/50">Dernière mise à jour: Aujourd'hui</p>
        </div>

        {/* Informations principales */}
        <div className="lg:col-span-2 border border-ink/10 bg-white p-6 rounded-lg">
          <h3 className="font-display text-lg mb-6">Informations principales</h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold">Nom d'artiste</p>
              <p className="text-2xl font-display mt-1">{artist.name}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold">Nationalité</p>
              <p className="text-lg mt-1">{artist.nationality}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold">Style</p>
              <p className="text-lg mt-1">{artist.style}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold">Bio</p>
              <p className="text-sm mt-2 leading-relaxed text-ink/70">{artist.bio}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold">Parcours</p>
              <p className="text-sm mt-2 leading-relaxed text-ink/70 whitespace-pre-line">{artist.journey}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modifier le profil" wide>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <FormField label="Nom d'artiste">
            <input
              required
              className={inputClass}
              value={form?.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>

          <FormField label="Nationalité">
            <input
              className={inputClass}
              value={form?.nationality || ''}
              onChange={(e) => setForm({ ...form, nationality: e.target.value })}
            />
          </FormField>

          <FormField label="Style artistique">
            <input
              className={inputClass}
              value={form?.style || ''}
              onChange={(e) => setForm({ ...form, style: e.target.value })}
            />
          </FormField>

          <div className="md:col-span-2">
            <ImageUpload
              label="Photo de profil"
              value={form?.portraitUrl || ''}
              onChange={(url) => setForm({ ...form, portraitUrl: url })}
            />
          </div>

          <div className="md:col-span-2">
            <FormField label="Bio (courte présentation)">
              <textarea
                rows={3}
                className={inputClass}
                value={form?.bio || ''}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Parcours (histoire complète)">
              <textarea
                rows={5}
                className={inputClass}
                value={form?.journey || ''}
                onChange={(e) => setForm({ ...form, journey: e.target.value })}
              />
            </FormField>
          </div>

          <button
            type="submit"
            className="rounded-full bg-ink px-8 py-3 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink md:col-span-2"
          >
            Enregistrer les modifications
          </button>
        </form>
      </Modal>
    </div>
  )
}
