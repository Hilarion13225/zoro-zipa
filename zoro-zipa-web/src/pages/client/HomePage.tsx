import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '../../components/HeroSection'
import { ArtworkCard } from '../../components/ArtworkCard'
import { Reveal } from '../../components/Reveal'
import { useArtists, useArtworks } from '../../api/hooks'

export function HomePage() {
  const { data: artworks } = useArtworks()
  const { data: artists } = useArtists()

  const allWorks = artworks ?? []
  const artist = artists?.[0]
  const artistPhotos = allWorks.slice(0, 3)

  return (
    <div>
      <HeroSection />

      {artist && artistPhotos.length > 0 && (
        <section className="bg-ivory-dim py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">À propos de l'artiste</p>
              <h2 className="gold-underline font-display text-3xl mb-12">{artist.name}</h2>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                {artistPhotos.map((photo, i) => (
                  <Reveal key={photo.id} delay={i * 0.1}>
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

              <Reveal delay={0.3}>
                <div>
                  <p className="text-sm text-ink/60 mb-4">{artist.nationality} · {artist.style}</p>
                  <p className="font-display text-lg italic text-ink/80 mb-6">
                    « {artist.bio} »
                  </p>
                  <Link
                    to="/a-propos"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-gold transition-colors"
                  >
                    En savoir plus
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <Reveal>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">
                La collection
              </p>
              <h2 className="gold-underline font-display text-3xl font-medium text-ivory md:text-4xl">
                Œuvres de Zoro Zipa
              </h2>
            </Reveal>
            <Link
              to="/galerie"
              className="group flex items-center gap-2 text-sm text-ivory/60 transition-colors hover:text-gold"
            >
              Voir la galerie complète
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allWorks.map((a) => (
              <ArtworkCard key={a.id} artwork={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Domaines de Prédilection */}
      <section className="bg-ivory-dim py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Spécialités</p>
            <h2 className="gold-underline font-display text-3xl mb-12">Domaines de Prédilection</h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            <Reveal>
              <div className="bg-white p-8 rounded-lg">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="font-display text-2xl mb-4">Performance</h3>
                <p className="text-ink/70">
                  L'art en mouvement, l'expression vivante de l'imagination urbaine. Zoro Zipa transforme l'espace en expérience sensorielle.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-white p-8 rounded-lg">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="font-display text-2xl mb-4">Installation</h3>
                <p className="text-ink/70">
                  Sculptures monumentales et installations immersives qui dialoguent avec l'architecture urbaine. L'art occupe l'espace.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-white p-8 rounded-lg">
                <div className="text-4xl mb-4">🗿</div>
                <h3 className="font-display text-2xl mb-4">Sculpture</h3>
                <p className="text-ink/70">
                  Formes tridimensionnelles qui capturent l'essence du mouvement. Chaque sculpture raconte une histoire urbaine.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-center">
        <Reveal className="mx-auto max-w-2xl px-6">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
            Explorez & Découvrez
          </p>
          <h2 className="font-display text-3xl text-ivory md:text-5xl">
            Découvrez la Boutique
          </h2>
          <p className="mt-4 text-ivory/60">
            Explorez et commandez les œuvres et produits de Zoro Zipa
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
          >
            Aller à la boutique
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
