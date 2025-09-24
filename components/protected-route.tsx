"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "dentist" | "receptionist"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    // Caso não esteja logado → login
    if (!user) {
      router.push("/login")
      return
    }

    // Role específica exigida
    if (requiredRole && user.role !== requiredRole) {
      router.push("/") // ou "/unauthorized"
      return
    }

    // Se for admin e ainda não tem clínica → força /clinic-setup
    if (user.role === "admin" && !user.clinicaId && pathname !== "/clinic-setup") {
      router.push("/clinic-setup")
    }
  }, [user, isLoading, router, requiredRole, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Acesso negado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
