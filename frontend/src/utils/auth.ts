/** Logout helpers — clear the JWT session and send the user back to the login screen. */
import { logout as clearSession } from '../api/auth'

/** Clears the session and reloads so AccessGate shows the admin login screen again. */
export function logoutAdmin() {
  clearSession()
  window.location.href = '/admin'
}

/** Clears the session and reloads so AccessGate shows the site login screen again. */
export function logoutSite() {
  clearSession()
  window.location.href = '/'
}
