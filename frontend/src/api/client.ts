import axios from 'axios'

/**
 * Axios instance for the Zoro-Zipa Spring Boot API.
 * In development, Vite proxies /api to http://localhost:8080.
 * In production, the frontend should use a same-origin /api path.
 */
const rawApiUrl = import.meta.env.VITE_API_URL?.trim()
const baseURL = rawApiUrl
  ? rawApiUrl.replace(/^https?:\/\/backend:8080/i, '')
  : '/api'

export const api = axios.create({
  baseURL,
})

// Attach the JWT (if present) to every outgoing request.
// Also set Content-Type to JSON only for plain object bodies — leave FormData
// (file uploads) alone so the browser can add the correct multipart boundary.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zoro_jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

// If the token is rejected or expired, clear it and send the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('zoro_jwt')
      localStorage.removeItem('zoro_user')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin'
      }
    }
    return Promise.reject(error)
  }
)
