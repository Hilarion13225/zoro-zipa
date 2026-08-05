import { Reveal } from '../../components/Reveal'

export function MasterclassPage() {
  return (
    <div>
      <section className="bg-ink pt-32 pb-24 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Masterclass</p>
            <h1 className="font-display text-6xl mb-8">Masterclass Exclusives</h1>
            <p className="text-ivory/70 text-lg">Photos et textes sur fond noir</p>
          </Reveal>
        </div>
      </section>
      <section className="bg-ink py-24 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-12">
            <div className="border border-gold/20 rounded-lg p-8 text-center text-ivory/40">
              <p>Aucune masterclass pour le moment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
