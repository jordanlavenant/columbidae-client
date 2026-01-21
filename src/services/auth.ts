interface LoginResponse {
  access_token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`http://localhost:3000/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

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
