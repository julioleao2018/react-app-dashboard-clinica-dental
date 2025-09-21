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

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
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
