import { Reveal } from '../../components/Reveal'
import { useMasterclasses } from '../../api/hooks'

export function MasterclassPage() {
  const { data: masterclasses = [], isLoading } = useMasterclasses()

  return (
    <div>
      <section className="bg-ink pt-32 pb-24 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Masterclass</p>
            <h1 className="font-display text-4xl mb-8 md:text-5xl lg:text-6xl">Enseignements Exclusifs</h1>
            <p className="text-ivory/70 text-lg">Apprenez directement de Zoro Zipa</p>
          </Reveal>
        </div>
      </section>
      <section className="bg-ink py-24 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          {isLoading ? (
            <p className="text-center text-ivory/40">Chargement...</p>
          ) : masterclasses.length === 0 ? (
            <div className="text-center text-ivory/60">
              <p>Aucune masterclass pour le moment</p>
            </div>
          ) : (
            <div className="space-y-12">
              {masterclasses
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((master) => (
                  <Reveal key={master.id}>
                    <div className="grid md:grid-cols-2 gap-8 items-center border border-gold/20 rounded-lg p-8">
                      <div className="order-2 md:order-1">
                        <h3 className="font-display text-3xl text-gold mb-4">{master.title}</h3>
                        <p className="text-ivory/70 leading-relaxed">{master.content}</p>
                      </div>
                      <div className="order-1 md:order-2">
                        <img
                          src={master.imageUrl}
                          alt={master.title}
                          className="rounded-lg w-full h-64 object-cover"
                        />
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