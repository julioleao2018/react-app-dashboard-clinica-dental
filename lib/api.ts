import { loadConfig } from "@/lib/config"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"

// Tipos
export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in?: number
}

export interface RegistroUsuarioRequest {
  nome: string
  email: string
  senha: string
}

export interface RegistroUsuarioResponse {
  usuario: {
    id: string
    nome: string
    email: string
  }
  access_token: string
  token_type: string
  expires_in: number
}

export interface RegistroClinicaRequest {
  nome: string
  telefone?: string
  documento: string // CNPJ
  numero_profissionais?: number
}

export interface RegistroClinicaResponse {
  clinica: {
    id: string
    nome: string
  }
  assinatura: {
    status: string
    data_fim: string
  }
  access_token: string
  token_type: string
  expires_in: number
}

class ApiClient {
  private baseUrl: string = ""
  private token: string | null = null

  async init() {
    const config = await loadConfig()
    this.baseUrl = config.API_BASE_URL || API_BASE_URL
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

    // Melhor tratamento de erro
    // if (!response.ok) {
    //   let errorMessage = `Erro API: ${response.status}`
    //   try {
    //     const data = await response.json()
    //     errorMessage = data?.mensagem || data?.detail || errorMessage
    //   } catch (_) { }
    //   throw new Error(errorMessage)
    // }

    if (!response.ok) {
      let errorMessage = `Erro API: ${response.status}`
      let body: any = null
      try {
        body = await response.json()
        errorMessage = body?.mensagem || body?.detail || errorMessage
      } catch (_) { }

      throw {
        status: response.status,
        mensagem: errorMessage,
        raw: body,
      }
    }

    return response.json()
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/v1/web/dental_clinic/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async registerUser(data: RegistroUsuarioRequest): Promise<RegistroUsuarioResponse> {
    return this.request<RegistroUsuarioResponse>("/v1/web/dental_clinic/registro/usuario", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async registerClinic(data: RegistroClinicaRequest): Promise<RegistroClinicaResponse> {
    return this.request<RegistroClinicaResponse>("/v1/web/dental_clinic/registro/clinica", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getProtectedData(): Promise<any> {
    return this.request("/v1/web/dental_clinic/privado")
  }

  async healthCheck(): Promise<any> {
    return this.request("/v1/web/dental_clinic/healthcheck")
  }
}

export const apiClient = new ApiClient()
