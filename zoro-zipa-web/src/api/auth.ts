import { api } from './client'

export type Role = 'ADMIN' | 'CLIENT'

export interface AuthUser {
  name: string
  email: string
  role: Role
}

interface AuthResponse {
  token: string
  name: string
  email: string
  role: Role
}

const TOKEN_KEY = 'zoro_jwt'
const USER_KEY = 'zoro_user'

function storeSession(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify({ name: data.name, email: data.email, role: data.role }))
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  storeSession(data)
  return { name: data.name, email: data.email, role: data.role }
}

export async function register(name: string, email: string, password: string): Promise<AuthUser> {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
  storeSession(data)
  return { name: data.name, email: data.email, role: data.role }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

/** Decodes the JWT payload (no verification — the backend is the source of truth). */
function decodeToken(token: string): { exp: number; role: Role } | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export function isAuthenticated(requiredRole?: Role): boolean {
  const token = getToken()
  if (!token) return false

  const payload = decodeToken(token)
  if (!payload) return false

  const isExpired = payload.exp * 1000 < Date.now()
  if (isExpired) return false

  if (requiredRole && payload.role !== requiredRole) return false

  return true
}
