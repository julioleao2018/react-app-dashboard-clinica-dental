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

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>
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

  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Simular verificação se email já existe
      const existingUsers = JSON.parse(localStorage.getItem("registered_users") || "[]")
      const emailExists = existingUsers.some((user: any) => user.email === data.email)

      if (emailExists) {
        return { success: false, message: "Este e-mail já está cadastrado" }
      }

      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: "/caring-doctor.png",
      }

      // Salvar usuário na lista de registrados
      existingUsers.push({ ...newUser, password: data.password })
      localStorage.setItem("registered_users", JSON.stringify(existingUsers))

      console.log("[v0] Registro mocado bem-sucedido para:", data.email)
      return { success: true, message: "Cadastro realizado com sucesso!" }
    } catch (error) {
      console.error("[v0] Erro no registro mocado:", error)
      return { success: false, message: "Erro interno. Tente novamente." }
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
