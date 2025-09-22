"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bluetooth as Tooth, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao DentalCare!",
      })
      router.push("/dashboard")
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tooth className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DentalCare</span>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Fazer login</CardTitle>
          <CardDescription className="text-center">Entre com suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Cadastre-se aqui
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Credenciais de demonstração:</p>
            <p>Email: silva@clinica.com</p>
            <p>Senha: demo123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
