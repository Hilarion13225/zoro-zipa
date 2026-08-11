import { Link } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { ArtworkCard } from '../../components/ArtworkCard'
import { useArtists, useArtworks } from '../../api/hooks'

/** Magazine-style artist profile: Zoro Zipa biography, journey and works. */
export function ArtistProfilePage() {
  const { data: artists, isLoading } = useArtists()
  const { data: artworks } = useArtworks()

  // Get the first (and only) artist: Zoro Zipa
  const artist = artists?.[0]

  if (isLoading)
    return <p className="px-6 pt-40 text-center text-ink/40">Chargement du profil…</p>
  if (!artist)
    return <p className="px-6 pt-40 text-center text-ink/40">Profil introuvable.</p>

  const works = artworks ?? []
  const firstWork = works[0]
  const artistPhotos = works.slice(0, 3)
  const galleryWorks = works.filter((_, i) => i !== 3)

  return (
    <div>
      {artistPhotos.length > 0 && (
        <section className="bg-ink py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {artistPhotos.map((photo) => (
                <Reveal key={photo.id}>
                  <div className="aspect-[4/5] overflow-hidden rounded-lg">
                    <img
                      src={photo.imageUrl}
                      alt=""
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-ink pb-20 pt-20 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">
              {artist.nationality} · {artist.style}
            </p>
            <h1 className="mt-4 font-display text-5xl md:text-6xl">{artist.name}</h1>
            <p className="mt-8 max-w-2xl font-display text-lg italic leading-relaxed text-ivory/70">
              « {artist.bio} »
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <h2 className="gold-underline font-display text-3xl mb-12">Parcours de l'Innovateur Urbain</h2>

          <div className="space-y-12">
            <div>
              <h3 className="font-display text-2xl text-gold mb-4">Graffiti : Les Origines</h3>
              <p className="text-ink/70 leading-relaxed">
                Zoro Zipa débute avec le graffiti, explorant les murs d'Abidjan comme toile vierge. Ces premières touches marquent le début d'une transformation urbaine.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-gold mb-4">Basquiat : L'Inspiration Mondiale</h3>
              <p className="text-ink/70 leading-relaxed">
                Influencé par Jean-Michel Basquiat, Zoro Zipa fusionne le graffiti avec l'art contemporain, créant une voix unique qui mélange figuration brute et abstraction poétique.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-gold mb-4">Banksy : L'Art Engagé</h3>
              <p className="text-ink/70 leading-relaxed">
                L'art politique et social de Banksy inspire Zoro Zipa à donner du sens à chaque coup de pinceau. L'art urbain devient un cri d'expression.
              </p>
            </div>

            <div className="border-t border-ink/10 pt-12">
              <h3 className="font-display text-2xl text-gold mb-4">Zoro Zipa : L'Innovateur d'Afrique</h3>
              <p className="text-ink/70 leading-relaxed whitespace-pre-line">
                {artist.journey}
              </p>
              <p className="text-ink/70 leading-relaxed mt-6">
                Aujourd'hui, Zoro Zipa se positionne comme innovateur urbain en Afrique, transformant les murs d'Abidjan en galeries à ciel ouvert, célébrant la vie citadine africaine avec audace et authenticité.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {firstWork && (
        <section className="bg-ivory-dim py-20">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Signature</p>
              <h2 className="gold-underline font-display text-3xl mb-12">{firstWork.title}</h2>
            </Reveal>

            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <Reveal>
                <div className="aspect-[4/5] overflow-hidden rounded-lg">
                  <img
                    src={firstWork.imageUrl}
                    alt={firstWork.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div>
                  <p className="text-sm text-ink/60 mb-6">{firstWork.category} · {firstWork.year}</p>
                  <p className="font-display text-lg leading-relaxed text-ink/80 mb-6">
                    {firstWork.description}
                  </p>

                  <div className="space-y-3 mb-8 text-sm text-ink/70">
                    <p><span className="text-gold font-semibold">Technique :</span> {firstWork.technique}</p>
                    <p><span className="text-gold font-semibold">Dimensions :</span> {firstWork.dimensions}</p>
                  </div>

                  <Link
                    to={`/oeuvres/${firstWork.id}`}
                    className="inline-block rounded-full bg-ink px-10 py-4 text-sm font-medium text-ivory transition-all hover:bg-gold hover:text-ink"
                  >
                    Voir cette œuvre
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <Reveal>
          <h2 className="gold-underline font-display text-3xl">
            Galerie complète
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {galleryWorks.map((a) => (
            <ArtworkCard key={a.id} artwork={a} />
          ))}
        </div>
        {galleryWorks.length === 0 && (
          <p className="mt-8 text-ink/40">Aucune œuvre publiée pour le moment.</p>
        )}
      </section>
    </div>
  )
}
