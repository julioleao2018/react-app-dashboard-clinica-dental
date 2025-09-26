import { apiClient, type LoginRequest } from "@/lib/api"
import { jwtDecode } from "jwt-decode"
import { saveToken, loadToken, clearToken } from "./token-service"

export interface DecodedToken {
  sub: string
  clinica_id?: string
  perfil?: string
  exp: number
}

export async function login(email: string, password: string) {
  const credentials: LoginRequest = { email, senha: password }
  const response = await apiClient.login(credentials)
  saveToken(response.access_token)
  return response.access_token
}

export async function registerUser(data: { nome: string; email: string; senha: string }) {
  const response = await apiClient.registerUser(data)
  saveToken(response.access_token)
  return response
}

export async function registerClinic(data: any) {
  const response = await apiClient.registerClinic(data)
  saveToken(response.access_token)
  return response
}

export function logout() {
  clearToken()
}

export function getStoredToken(): string | null {
  return loadToken()
}

export function decodeToken(token: string) {
  try {
    return jwtDecode<DecodedToken>(token)
  } catch {
    return null
  }
}