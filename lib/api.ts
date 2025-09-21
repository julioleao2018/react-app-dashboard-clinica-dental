const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface UsuarioResposta {
  usuario_id: number
  nome: string
  email: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/v1/web/dental_clinic/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async createUser(userData: LoginRequest): Promise<UsuarioResposta> {
    return this.request<UsuarioResposta>("/v1/web/dental_clinic/usuarios", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getProtectedData(): Promise<any> {
    return this.request("/v1/web/dental_clinic/privado")
  }

  async healthCheck(): Promise<any> {
    return this.request("/v1/web/dental_clinic/healthcheck")
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
