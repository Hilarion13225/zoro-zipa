import { Reveal } from '../../components/Reveal'

export function SoloShowPage() {
  return (
    <div>
      <section className="bg-ink pt-32 pb-24 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Solo Show</p>
            <h1 className="font-display text-6xl mb-8">Solo Shows</h1>
            <p className="text-ivory/70 text-lg">Découvrez les expositions exclusives de Zoro Zipa</p>
          </Reveal>
        </div>
      </section>
      <section className="py-24 bg-ivory-dim">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-lg text-center text-ink/40"><p>Aucun solo show pour le moment</p></div>
          </div>
        </div>
      </section>
    </div>
  )
}
