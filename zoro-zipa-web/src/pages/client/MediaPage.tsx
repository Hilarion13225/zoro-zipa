import { Reveal } from '../../components/Reveal'
import { useMedia } from '../../api/hooks'

export function MediaPage() {
  const { data: medias = [], isLoading } = useMedia()

  return (
    <div>
      <section className="bg-ink pt-32 pb-24 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Média</p>
            <h1 className="font-display text-6xl mb-8">Galerie Multimédia</h1>
            <p className="text-ivory/70 text-lg">Photos et vidéos de Zoro Zipa</p>
          </Reveal>
        </div>
      </section>
      <section className="py-24 bg-ivory-dim">
        <div className="mx-auto max-w-7xl px-6">
          {isLoading ? (
            <p className="text-center text-ink/40">Chargement...</p>
          ) : medias.length === 0 ? (
            <div className="text-center text-ink/60">
              <p>Aucun média pour le moment</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {medias.map((media) => (
                <Reveal key={media.id}>
                  <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-video overflow-hidden bg-ink/5">
                      {media.type === 'video' ? (
                        <video src={media.url} controls className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={media.url}
                          alt={media.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">{media.category}</p>
                      <h3 className="font-display text-lg text-ink mb-2">{media.title}</h3>
                      <p className="text-sm text-ink/60">{media.description}</p>
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
