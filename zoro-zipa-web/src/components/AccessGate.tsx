import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ACCESS_KEY, ADMIN_KEY, SITE_PASSWORD, ADMIN_PASSWORD } from '../utils/auth'

interface AccessGateProps {
  children: React.ReactNode
  adminMode?: boolean
}

export function AccessGate({ children, adminMode = false }: AccessGateProps) {
  const navigate = useNavigate()
  const [hasAccess, setHasAccess] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = adminMode ? ADMIN_KEY : ACCESS_KEY
    const stored = localStorage.getItem(key)
    if (stored) {
      setHasAccess(true)
    }
    setLoading(false)
  }, [adminMode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Check if it's admin password
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, 'true')
      localStorage.setItem(ACCESS_KEY, 'true')
      navigate('/admin')
      setHasAccess(true)
      return
    }

    // Check if it's client password
    if (password === SITE_PASSWORD) {
      localStorage.setItem(ACCESS_KEY, 'true')
      setHasAccess(true)
      return
    }

    // Wrong password
    setError('Mot de passe incorrect')
    setPassword('')
  }

  if (loading) return null

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ink to-ink/90">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl text-gold mb-2">Zoro Zipa</h1>
            <p className="text-ivory/60 text-sm">
              Accès Sécurisé
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-ivory/80 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-3 rounded-lg bg-ivory/10 border border-gold/30 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gold text-ink font-medium hover:bg-gold-soft transition-colors"
            >
              Accéder
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-ivory/40 text-xs">
              Portfolio Officiel de Zoro Zipa - Accès Privé
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
