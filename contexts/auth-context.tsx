"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

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
      // TODO: Validate token with API
      // For now, simulate user from token
      const mockUser: User = {
        id: "1",
        name: "Dr. Silva",
        email: "silva@clinica.com",
        role: "dentist",
        avatar: "/caring-doctor.png",
      }
      setUser(mockUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })
      // const data = await response.json()

      // Mock authentication for demo
      if (email === "silva@clinica.com" && password === "demo123") {
        const mockUser: User = {
          id: "1",
          name: "Dr. Silva",
          email: "silva@clinica.com",
          role: "dentist",
          avatar: "/caring-doctor.png",
        }

        // Store JWT token (mock)
        localStorage.setItem("auth_token", "mock_jwt_token_here")
        setUser(mockUser)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
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
