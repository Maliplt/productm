export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  avatar?: string
  createdAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}
