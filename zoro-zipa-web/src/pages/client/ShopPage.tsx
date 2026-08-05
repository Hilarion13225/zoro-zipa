import { ShoppingCart, X } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from '../../components/Reveal'
import { CheckoutModal } from '../../components/shop/CheckoutModal'
import { useProducts } from '../../api/hooks'
import { useCartStore } from '../../stores/cartStore'

export function ShopPage() {
  const { data: products = [], isLoading } = useProducts()
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const { items, addItem, removeItem, total } = useCartStore()

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-ink/40">Chargement de la boutique...</p>
      </div>
    )

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-ink py-24 text-center text-ivory">
        <Reveal className="mx-auto max-w-3xl px-6">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">
            Boutique Officielle
          </p>
          <h1 className="font-display text-5xl md:text-6xl mb-6">
            Zoro Zipa Store
          </h1>
          <p className="text-ivory/70 text-lg">
            Explorez et commandez les œuvres et produits exclusifs de Zoro Zipa
          </p>
        </Reveal>
      </section>

      {/* Products Grid */}
      <section className="bg-ivory-dim py-20">
        <div className="mx-auto max-w-7xl px-6">
          {products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-ink/60 mb-8">La boutique sera bientôt disponible</p>
            </div>
          ) : (
            <>
              <Reveal className="mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">
                  {products.length} produit(s)
                </p>
                <h2 className="gold-underline font-display text-3xl">
                  Nos Produits
                </h2>
              </Reveal>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Reveal key={product.id}>
                    <div className="group rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                      {/* Product Image */}
                      <div className="aspect-square overflow-hidden bg-ink/5">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
                              {product.category}
                            </p>
                            <h3 className="font-display text-xl text-ink mb-2">
                              {product.title}
                            </h3>
                          </div>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              product.available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.available ? 'Stock' : 'Rupture'}
                          </span>
                        </div>

                        <p className="text-sm text-ink/60 mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <p className="font-display text-2xl text-gold">
                            {product.price}€
                          </p>
                          <button
                            onClick={() => {
                              addItem(product, 1)
                              setShowCart(true)
                            }}
                            disabled={!product.available}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              product.available
                                ? 'bg-ink text-ivory hover:bg-gold hover:text-ink'
                                : 'bg-ink/20 text-ink/40 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart size={16} />
                            <span className="hidden sm:inline">Ajouter</span>
                          </button>
                        </div>

                        {/* Stock Info */}
                        <p className="mt-4 text-xs text-ink/50">
                          Stock: {product.quantity} disponible(s)
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {products.length > 0 && (
        <section className="bg-ink py-20 text-center">
          <Reveal className="mx-auto max-w-2xl px-6">
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
              Questions?
            </p>
            <h2 className="font-display text-3xl text-ivory mb-4">
              Contactez-nous
            </h2>
            <p className="text-ivory/60 mb-8">
              Pour des demandes spéciales ou des commandes en volume
            </p>
            <a
              href="mailto:contact@zorozipa.com"
              className="inline-block rounded-full bg-gold px-8 py-3 font-medium text-ink hover:bg-gold-soft transition-colors"
            >
              Nous contacter
            </a>
          </Reveal>
        </section>
      )}

      {/* Cart Button */}
      {items.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-medium text-ink shadow-lg hover:bg-gold-soft transition-all z-40"
        >
          <ShoppingCart size={20} />
          <span>{items.length}</span>
          <span className="hidden sm:inline">{total().toFixed(2)}€</span>
        </button>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-ink/10 bg-white p-6">
              <h2 className="font-display text-2xl text-ink">Panier</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-ink/40 hover:text-ink"
              >
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-6 text-center text-ink/60">
                Panier vide
              </div>
            ) : (
              <>
                <div className="divide-y divide-ink/10">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-6">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-24 w-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-ink">{item.title}</h3>
                        <p className="text-sm text-ink/60 mb-2">
                          {item.price}€ × {item.cartQuantity}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {successMsg && (
                  <div className="m-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                    {successMsg}
                  </div>
                )}

                <div className="sticky bottom-0 border-t border-ink/10 bg-white p-6">
                  <div className="mb-4 flex justify-between">
                    <span className="font-semibold text-ink">Total</span>
                    <span className="font-display text-xl text-gold">{total().toFixed(2)}€</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCart(false)
                      setShowCheckout(true)
                    }}
                    className="w-full rounded-full bg-gold px-6 py-3 font-medium text-ink hover:bg-gold-soft transition-colors"
                  >
                    Finaliser la commande
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          items={items}
          total={total()}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setSuccessMsg('Commande confirmée! 🎉')
            setTimeout(() => {
              setShowCart(false)
              setSuccessMsg('')
            }, 2000)
          }}
        />
      )}
    </div>
  )
}
