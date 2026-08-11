import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAuthenticated } from '../api/auth'

interface AccessGateProps {
  children: React.ReactNode
  adminMode?: boolean
}

export function AccessGate({ children, adminMode = false }: AccessGateProps) {
  const navigate = useNavigate()
  const [hasAccess, setHasAccess] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Admin area requires the ADMIN role specifically; the public site just
    // requires any authenticated account (admin or client).
    setHasAccess(adminMode ? isAuthenticated('ADMIN') : isAuthenticated())
    setLoading(false)
  }, [adminMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const user = await login(email, password)

      if (user.role === 'ADMIN') {
        // Admin accounts always land on the dashboard, whichever login form was used.
        navigate('/admin')
        return
      }

      if (adminMode) {
        // A non-admin account tried to log in on the /admin form — send them
        // straight to the public showcase site instead.
        window.location.href = '/'
        return
      }

      // Client account logging in from the site — stay on the showcase site.
      setHasAccess(true)
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 401) setError('Email ou mot de passe incorrect')
      else if (status === 409) setError('Cet email est déjà utilisé')
      else setError("Une erreur est survenue, réessaie")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ink to-ink/90">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl text-gold mb-2">Zoro Zipa</h1>
            <p className="text-ivory/60 text-sm">
              {adminMode ? 'Portail Administration' : 'Portfolio Privé'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm text-ivory/80 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 rounded-lg bg-ivory/10 border border-gold/30 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm text-ivory/80 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full px-4 py-3 rounded-lg bg-ivory/10 border border-gold/30 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-gold text-ink font-medium hover:bg-gold-soft transition-colors disabled:opacity-60"
            >
              {submitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>


          {!adminMode && (
            <div className="mt-8 text-center">
              <p className="text-ivory/40 text-xs">
                Portfolio Officiel de Zoro Zipa
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}