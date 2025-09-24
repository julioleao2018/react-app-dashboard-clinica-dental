"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient, type LoginRequest } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "dentist" | "receptionist"
  avatar?: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: "admin" | "dentist" | "receptionist"
}


interface ClinicRegisterData {
  nome: string
  telefone?: string
  documento: string // CNPJ
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

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      apiClient.setToken(token)
      apiClient
        .getProtectedData()
        .then(() => {
          // Token is valid, set mock user for now
          const mockUser: User = {
            id: "1",
            name: "Dr. Silva",
            email: "silva@clinica.com",
            role: "dentist",
            avatar: "/caring-doctor.png",
          }
          setUser(mockUser)
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem("auth_token")
          apiClient.clearToken()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const credentials: LoginRequest = { email, senha: password }
      const response = await apiClient.login(credentials)

      // Store JWT token
      apiClient.setToken(response.access_token)

      // Set user data (mock for now, should come from API)
      const mockUser: User = {
        id: "1",
        name: "Dr. Silva",
        email: email,
        role: "dentist",
        avatar: "/caring-doctor.png",
      }

      setUser(mockUser)
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
    setUser(null)
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await apiClient.registerUser({
        nome: data.name,
        email: data.email,
        senha: data.password,
      })

      if (!response?.access_token) {
        return { success: false, message: "Erro ao criar usuário" }
      }

      apiClient.setToken(response.access_token)
      localStorage.setItem("auth_token", response.access_token)

      setUser({
        id: response.usuario?.id ?? "1",
        name: response.usuario?.nome ?? data.name,
        email: response.usuario?.email ?? data.email,
        role: "admin",
        avatar: "/caring-doctor.png"
      })

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
      const response = await apiClient.registerClinic({
        nome: clinicaData.nome,
        telefone: clinicaData.telefone,
        documento: clinicaData.documento,
        numero_profissionais: clinicaData.numero_profissionais,
      })

      if (!response?.access_token) {
        return { success: false, message: "Erro ao criar clínica" }
      }

      // salva token definitivo
      apiClient.setToken(response.access_token)
      localStorage.setItem("auth_token", response.access_token)

      // atualiza user no contexto
      setUser({
        id: response.usuario?.id ?? "1", // se a API já devolver o usuário, use
        name: response.usuario?.nome ?? "Administrador",
        email: response.usuario?.email ?? "",
        role: "admin",
        avatar: "/caring-doctor.png"
      })

      return { success: true, message: "Clínica cadastrada com sucesso!" }
    } catch (error: any) {
      console.error("Register clinic error:", error)
      return {
        success: false,
        message: error?.mensagem || "Erro interno. Tente novamente."
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })

      // Mock success for demo
      return true
    } catch (error) {
      console.error("Reset password error:", error)
      return false
    }
  }

  const changePassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, newPassword })
      // })

      // Mock success for demo
      return true
    } catch (error) {
      console.error("Change password error:", error)
      return false
    }
  }

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
