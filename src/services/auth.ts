import login, { type LoginPayload } from './functions/auth/login'

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT

interface LoginResponse {
  access_token: string
  user: {
    id: string
    email: string
    username: string
    name: string
  }
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Login
    const payload: LoginPayload = { email, password }
    const response = await login(ENDPOINT, payload)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data: LoginResponse = await response.json()
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))

    return data
  },

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
