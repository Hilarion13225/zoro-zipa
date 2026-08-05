import { Reveal } from '../../components/Reveal'
import { useExhibitions } from '../../api/hooks'

export function ExhibitionPage() {
  const { data: exhibitions = [], isLoading } = useExhibitions()

  return (
    <div>
      <section className="bg-ink pt-32 pb-24 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Expositions</p>
            <h1 className="font-display text-6xl mb-8">Mes Expositions</h1>
            <p className="text-ivory/70 max-w-2xl text-lg">Galeries urbaines et espaces contemporains à travers le monde</p>
          </Reveal>
        </div>
      </section>
      <section className="py-24 bg-ivory-dim">
        <div className="mx-auto max-w-7xl px-6">
          {isLoading ? (
            <p className="text-center text-ink/40">Chargement...</p>
          ) : exhibitions.length === 0 ? (
            <div className="text-center text-ink/60">
              <p>Aucune exposition pour le moment</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {exhibitions.map((expo) => (
                <Reveal key={expo.id}>
                  <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={expo.imageUrl}
                        alt={expo.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">{expo.location}</p>
                      <h3 className="font-display text-lg text-ink mb-2">{expo.title}</h3>
                      <p className="text-sm text-ink/60 mb-4 line-clamp-2">{expo.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-ink/50">{expo.dates}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            expo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {expo.active ? 'Active' : 'Passée'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
