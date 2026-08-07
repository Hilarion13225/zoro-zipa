// Authentication keys
export const ACCESS_KEY = 'zoro_site_access'
export const ADMIN_KEY = 'zoro_admin_access'

// Passwords
export const SITE_PASSWORD = 'zoro-zipa-urbain2026'
export const ADMIN_PASSWORD = 'qwertyuiop123456789'

// Logout functions
export const logoutSite = () => {
  localStorage.removeItem(ACCESS_KEY)
  window.location.reload()
}

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_KEY)
  window.location.href = '/admin-login'
}
