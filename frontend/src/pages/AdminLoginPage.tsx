import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = 'qwertyuiop123456789'

export function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('zoro_admin_access', 'true')
      navigate('/admin')
    } else {
      setError('Mot de passe incorrect')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ink to-ink/90">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl text-gold mb-2">Zoro Zipa</h1>
          <p className="text-ivory/60 text-sm">Portail Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-ivory/80 mb-2">
              Mot de passe Admin
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
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
            Accéder au Panel
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-ivory/40 text-xs">
            Zone Réservée aux Administrateurs
          </p>
        </div>
      </div>
    </div>
  )
}
