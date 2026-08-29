const TOKEN_KEY = "auth.token"
const EMAIL_KEY = "auth.email"
const ROLE_KEY = "auth.role"

export function saveAuth(data) {
  if (!data) return
  
  // Handle both string token or object responses like { token, access_token, accessToken, data: { token } }
  const token = typeof data === "string" 
    ? data 
    : (data.token || data.access_token || data.accessToken || data.data?.token || data.data?.accessToken)
    
  const email = data.email || data.user?.email || data.data?.email
  const role = data.role || data.user?.role || data.data?.role

  if (token) localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem("token", token || (typeof data === "string" ? data : JSON.stringify(data)))
  if (email) localStorage.setItem(EMAIL_KEY, email)
  if (role) localStorage.setItem(ROLE_KEY, role)
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EMAIL_KEY)
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem("token")
  localStorage.clear()
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token")
}

export function getAuth() {
  return {
    token: getToken(),
    email: localStorage.getItem(EMAIL_KEY),
    role: localStorage.getItem(ROLE_KEY),
  }
}

export function isAuthenticated() {
  return Boolean(getToken())
}
