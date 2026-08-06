/** Shared access-gate keys and helpers (site + admin portals). */

export const ACCESS_KEY = 'zoro_site_access'
export const ADMIN_KEY = 'zoro_admin_access'

export const SITE_PASSWORD = 'zoro-zipa-urbain2026'
export const ADMIN_PASSWORD = 'zoro-zipa-urbain'

/** Clears the admin session and reloads so the AccessGate password screen shows again. */
export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY)
  window.location.href = '/admin'
}

/** Clears the public site session and reloads so the AccessGate password screen shows again. */
export function logoutSite() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(ADMIN_KEY)
  window.location.href = '/'
}
