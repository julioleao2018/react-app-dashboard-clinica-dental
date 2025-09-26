"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient, type LoginRequest } from "@/lib/api"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"

interface DecodedToken {
  sub: string
  clinica_id?: string
  perfil?: string
  exp: number,
  email?: string,
  nome?: string
}

interface User {
  id: string
  nome: string
  email: string
  role: "admin" | "dentist" | "receptionist"
  clinicaId: string | null
  avatar?: string
}

interface RegisterData {
  nome: string
  email: string
  password: string
  role: "admin" | "dentist" | "receptionist"
}

interface ClinicRegisterData {
  nome: string
  telefone?: string
  documento: string
  tipo_documento: string
  numero_profissionais?: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>
  registerClinic: (data: ClinicRegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  resetPassword: (email: string) => Promise<boolean>
  changePassword: (token: string, newPassword: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const decodeAndSetUser = (token: string, extra?: { nome?: string; email?: string }) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token)

      setUser({
        id: decoded.sub,
        nome: decoded?.nome ?? "Usuário",
        email: decoded?.email ?? "",
        role: (decoded.perfil as User["role"]) ?? "admin",
        clinicaId: decoded.clinica_id ?? null,
        avatar: "/caring-doctor.png",
      })
    } catch (e) {
      console.error("Erro ao decodificar token:", e)
      setUser(null)
    }
  }

  useEffect(() => {
    const token = Cookies.get("auth_token") || localStorage.getItem("auth_token")
    if (token) {
      apiClient.setToken(token)
      decodeAndSetUser(token)
    }
    setIsLoading(false)
  }, [])

  const saveToken = (token: string) => {
    apiClient.setToken(token)
    localStorage.setItem("auth_token", token)
    Cookies.set("auth_token", token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    })
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const credentials: LoginRequest = { email, senha: password }
      const response = await apiClient.login(credentials)

      saveToken(response.access_token)
      decodeAndSetUser(response.access_token, { email })

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    apiClient.clearToken()
    localStorage.removeItem("auth_token")
    Cookies.remove("auth_token")
    setUser(null)
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await apiClient.registerUser({
        nome: data.nome,
        email: data.email,
        senha: data.password,
      })

      if (!response?.access_token) {
        return { success: false, message: "Erro ao criar usuário" }
      }

      saveToken(response.access_token)
      decodeAndSetUser(response.access_token, { nome: data.nome, email: data.email })
      return { success: true, message: "Usuário criado, prossiga para configurar a clínica." }
    } catch (error: any) {
      console.error("Erro no Cadastro:", error)
      return {
        success: false,
        message: error?.mensagem || "Erro inesperado. Tente novamente.",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const registerClinic = async (clinicaData: ClinicRegisterData) => {
    setIsLoading(true)
    try {
      const response = await apiClient.registerClinic(clinicaData)

      if (!response?.access_token) {
        return { success: false, message: "Erro ao criar clínica" }
      }

      saveToken(response.access_token)
      decodeAndSetUser(response.access_token, {
        nome: response.usuario?.nome,
        email: response.usuario?.email,
      })

      return { success: true, message: "Clínica cadastrada com sucesso!" }
    } catch (error: any) {
      console.error("Register clinic error:", error)
      return {
        success: false,
        message: error?.mensagem || "Erro interno. Tente novamente.",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => true
  const changePassword = async (token: string, newPassword: string): Promise<boolean> => true

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        registerClinic,
        logout,
        resetPassword,
        changePassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
