import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useArtworks } from '../api/hooks'

/** Full-screen immersive hero featuring the primary artwork. */
export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { data: artworks } = useArtworks()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Always use image00004 (Écho Urbain) - fallback guaranteed
  const featuredWork = artworks?.[3]
  const heroImage = featuredWork?.imageUrl || '/uploads/image00004.jpeg'

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/30 to-ink" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-xs uppercase tracking-[0.5em] text-gold"
        >
          Zoro-Zipa — Plateforme d'art contemporain
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-4xl font-display text-4xl leading-tight text-ivory md:text-6xl lg:text-7xl"
        >
          Explorez l'art, découvrez les histoires derrière chaque œuvre.
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  )
}
