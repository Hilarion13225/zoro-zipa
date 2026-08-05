import { Reveal } from '../../components/Reveal'

export function ShopPage() {
  return (
    <div>
      <section className="bg-ink pt-32 pb-24 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Shop</p>
            <h1 className="font-display text-6xl mb-8">Boutique</h1>
            <p className="text-ivory/70 text-lg">Œuvres et produits de Zoro Zipa</p>
          </Reveal>
        </div>
      </section>
      <section className="py-24 bg-ivory-dim">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="bg-white p-8 rounded-lg text-center text-ink/40"><p>Aucun produit pour le moment</p></div>
          </div>
        </div>
      </section>
    </div>
  )
}
