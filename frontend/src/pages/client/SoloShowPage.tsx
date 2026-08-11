import { Reveal } from '../../components/Reveal'
import { useSoloShows } from '../../api/hooks'

export function SoloShowPage() {
  const { data: soloShows = [], isLoading } = useSoloShows()

  return (
    <div>
      <section className="bg-ink pt-32 pb-24 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Solo Shows</p>
            <h1 className="font-display text-4xl mb-8 md:text-5xl lg:text-6xl">Exhibitions Exclusives</h1>
            <p className="text-ivory/70 text-lg">Découvrez les expositions en solo de Zoro Zipa</p>
          </Reveal>
        </div>
      </section>
      <section className="py-24 bg-ivory-dim">
        <div className="mx-auto max-w-7xl px-6">
          {isLoading ? (
            <p className="text-center text-ink/40">Chargement...</p>
          ) : soloShows.length === 0 ? (
            <div className="text-center text-ink/60">
              <p>Aucun solo show pour le moment</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {soloShows.map((show) => (
                <Reveal key={show.id}>
                  <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={show.imageUrl}
                        alt={show.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">{show.year}</p>
                      <h3 className="font-display text-lg text-ink mb-2">{show.title}</h3>
                      <p className="text-sm text-ink/60 line-clamp-2">{show.description}</p>
                      {show.featured && (
                        <div className="mt-4 inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium rounded">
                          En vedette
                        </div>
                      )}
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