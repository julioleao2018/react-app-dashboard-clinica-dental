import Cookies from "js-cookie"
import { apiClient } from "@/lib/api"

const TOKEN_KEY = "auth_token"

export function saveToken(token: string) {
  apiClient.setToken(token)
  localStorage.setItem(TOKEN_KEY, token)
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  })
}

export function loadToken(): string | null {
  return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  apiClient.clearToken()
  localStorage.removeItem(TOKEN_KEY)
  Cookies.remove(TOKEN_KEY)
}