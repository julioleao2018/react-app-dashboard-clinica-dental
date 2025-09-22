"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileText, Settings, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      {/* Header com mensagem de boas-vindas */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>
          </div>
          <p className="text-blue-100">
            Seu teste grátis de 7 dias já começou. Explore todas as funcionalidades do DentalCare!
          </p>
        </div>
      </div>

      {/* Cards de navegação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/appointments">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 desde ontem</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/patients">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">+5 este mês</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 pendentes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurações</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Personalizar sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de ações rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse as funcionalidades mais utilizadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/appointments">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Button>
            </Link>
            <Link href="/patients">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="mr-2 h-4 w-4" />
                Cadastrar Paciente
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="mr-2 h-4 w-4" />
              Criar Orçamento
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>Consultas marcadas para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Maria Silva</p>
                  <p className="text-sm text-muted-foreground">Limpeza - 09:00</p>
                </div>
                <Button size="sm" variant="outline">
                  Ver
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">João Santos</p>
                  <p className="text-sm text-muted-foreground">Consulta - 14:30</p>
                </div>
                <Button size="sm" variant="outline">
                  Ver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
