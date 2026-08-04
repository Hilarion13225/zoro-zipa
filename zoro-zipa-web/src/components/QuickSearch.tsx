import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Image, MapPin, Palette, Search, Ticket } from 'lucide-react'
import { useArtists, useArtworks, useExhibitions, useGalleries } from '../api/hooks'
import { useQuickSearch } from '../store/quickSearch'

type ResultKind = 'artwork' | 'artist' | 'exhibition' | 'gallery'

interface Result {
  kind: ResultKind
  id: number
  title: string
  subtitle: string
  to: string
}

const kindIcon: Record<ResultKind, typeof Image> = {
  artwork: Image,
  artist: Palette,
  exhibition: Ticket,
  gallery: MapPin,
}

const kindLabel: Record<ResultKind, string> = {
  artwork: 'Œuvre',
  artist: 'Artiste',
  exhibition: 'Exposition',
  gallery: 'Galerie',
}

/** Global Cmd/Ctrl+K command palette: instant cross-catalogue search. */
export function QuickSearch() {
  const open = useQuickSearch((s) => s.open)
  const setOpen = useQuickSearch((s) => s.setOpen)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { data: artworks } = useArtworks()
  const { data: artists } = useArtists()
  const { data: exhibitions } = useExhibitions()
  const { data: galleries } = useGalleries()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setOpen, open])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const artworkResults: Result[] = (artworks ?? [])
      .filter((a) => a.title.toLowerCase().includes(q) || a.artistName.toLowerCase().includes(q))
      .map((a) => ({ kind: 'artwork', id: a.id, title: a.title, subtitle: a.artistName, to: `/oeuvres/${a.id}` }))

    const artistResults: Result[] = (artists ?? [])
      .filter((a) => a.name.toLowerCase().includes(q) || a.nationality.toLowerCase().includes(q))
      .map((a) => ({ kind: 'artist', id: a.id, title: a.name, subtitle: a.nationality, to: `/artistes/${a.id}` }))

    const exhibitionResults: Result[] = (exhibitions ?? [])
      .filter((e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q))
      .map((e) => ({ kind: 'exhibition', id: e.id, title: e.title, subtitle: e.location, to: `/expositions/${e.id}` }))

    const galleryResults: Result[] = (galleries ?? [])
      .filter((g) => g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q))
      .map((g) => ({ kind: 'gallery', id: g.id, title: g.name, subtitle: g.city, to: '/galeries' }))

    return [...artworkResults, ...artistResults, ...exhibitionResults, ...galleryResults].slice(0, 8)
  }, [query, artworks, artists, exhibitions, galleries])

  const select = (result: Result) => {
    navigate(result.to)
    setOpen(false)
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      select(results[active])
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
                <Search size={18} className="text-ink/40" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActive(0)
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Rechercher une œuvre, un artiste, une exposition, une galerie…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-ink/30"
                />
                <kbd className="rounded border border-ink/15 px-1.5 py-0.5 text-[10px] text-ink/40">Esc</kbd>
              </div>

              <div className="max-h-[50vh] overflow-y-auto py-2">
                {query.trim() === '' && (
                  <p className="px-5 py-8 text-center text-sm text-ink/30">
                    Commencez à taper pour explorer toute la collection.
                  </p>
                )}
                {query.trim() !== '' && results.length === 0 && (
                  <p className="px-5 py-8 text-center text-sm text-ink/30">Aucun résultat pour « {query} ».</p>
                )}
                {results.map((r, i) => {
                  const Icon = kindIcon[r.kind]
                  return (
                    <button
                      key={`${r.kind}-${r.id}`}
                      onClick={() => select(r)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-colors ${
                        i === active ? 'bg-ink/5' : ''
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink/50">
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">{r.title}</span>
                        <span className="block truncate text-xs text-ink/40">{r.subtitle}</span>
                      </span>
                      <span className="shrink-0 text-[10px] uppercase tracking-wider text-gold">
                        {kindLabel[r.kind]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
