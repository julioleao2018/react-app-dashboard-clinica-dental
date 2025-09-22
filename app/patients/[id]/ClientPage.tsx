"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnamnesisList } from "@/components/anamnesis-list"
import { BudgetList } from "@/components/budget-list"
import { Edit, Calendar, MessageSquare } from "@/components/icons"
import type { Patient } from "@/types/patient"
import { mockPatients } from "@/data/mock-patients"
import { mockAnamnesis } from "@/data/mock-anamnesis"
import { mockBudgets } from "@/data/mock-budgets"

const Odontogram = () => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Odontograma</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Permanentes
          </Button>
          <Button variant="outline" size="sm">
            Decíduos
          </Button>
        </div>
      </div>

      {/* Arcada Superior */}
      <div className="mb-8">
        <div className="flex justify-center gap-1 mb-2">
          {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map((tooth) => (
            <div key={tooth} className="flex flex-col items-center">
              <div className="w-8 h-10 border border-gray-300 rounded-t-lg bg-white hover:bg-blue-50 cursor-pointer flex items-center justify-center">
                <div className="w-6 h-8 border border-gray-400 rounded-t-md"></div>
              </div>
              <span className="text-xs text-gray-600 mt-1">{tooth}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Arcada Inferior */}
      <div>
        <div className="flex justify-center gap-1">
          {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map((tooth) => (
            <div key={tooth} className="flex flex-col items-center">
              <span className="text-xs text-gray-600 mb-1">{tooth}</span>
              <div className="w-8 h-10 border border-gray-300 rounded-b-lg bg-white hover:bg-blue-50 cursor-pointer flex items-center justify-center">
                <div className="w-6 h-8 border border-gray-400 rounded-b-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ClientPage({ initialId }: { initialId: string }) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const found = mockPatients.find((p) => String(p.id) === String(initialId))
    setPatient(found || null)
  }, [initialId])

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Paciente não encontrado</p>
        </div>
      </DashboardLayout>
    )
  }

  const patientAnamnesis = mockAnamnesis.filter((a) => a.patientId === patient.id)
  const patientBudgets = mockBudgets.filter((b) => b.patientId === patient.id)

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return ""
    const today = new Date()
    const birth = new Date(birthDate)
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return `${age - 1} anos`
    }
    return `${age} anos`
  }

  const generateAlerts = () => {
    const alerts = []

    // Verificar alergias
    const hasAllergy = patientAnamnesis.some((a) => {
      const responses = Object.entries(a.responses)
      return responses.some(
        ([key, response]) =>
          key.toLowerCase().includes("alergia") &&
          (response.answer === "Sim" || response.additionalInfo?.toLowerCase().includes("penicilina")),
      )
    })

    if (hasAllergy) {
      alerts.push({
        type: "error" as const,
        message: "Paciente possui alergia a medicamento",
      })
    }

    // Verificar hipertensão
    const hasHypertension = patientAnamnesis.some((a) => {
      const responses = Object.entries(a.responses)
      return responses.some(
        ([key, response]) => key.toLowerCase().includes("pressao_alta") && response.answer === "Sim",
      )
    })

    if (hasHypertension) {
      alerts.push({
        type: "warning" as const,
        message: "Paciente possui hipertensão",
      })
    }

    return alerts
  }

  const alerts = generateAlerts()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header do Paciente */}
        <div className="bg-white border-b">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/patients")} className="mr-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>

              <Avatar className="h-16 w-16">
                <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{calculateAge(patient.birthDate)}</span>
                  <span>•</span>
                  <span>CPF: {patient.cpf}</span>
                  <span>•</span>
                  <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                    {patient.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>📞 {patient.phone}</span>
                  <span>✉️ {patient.email}</span>
                  {patient.lastVisit && (
                    <>
                      <span>•</span>
                      <span>Última consulta: {new Date(patient.lastVisit).toLocaleDateString("pt-BR")}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Consulta
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>

        {/* Alertas Importantes */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-600 flex items-center">⚠️ Alertas Importantes</h3>
            {alerts.map((alert, index) => (
              <Alert
                key={index}
                className={alert.type === "error" ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}
              >
                <AlertDescription className={alert.type === "error" ? "text-red-800" : "text-orange-800"}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Abas */}
        <Tabs defaultValue="visao-geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="anamneses">Anamneses</TabsTrigger>
            <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
            <TabsTrigger value="tratamentos">Tratamentos</TabsTrigger>
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
            <TabsTrigger value="evolucoes">Evoluções</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Informações</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Código do paciente</label>
                      <p className="text-gray-900">{patient.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Preferência de lembretes</label>
                      <p className="text-gray-900">WhatsApp</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Celular</label>
                      <p className="text-gray-900">{patient.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Data de nascimento</label>
                      <p className="text-gray-900">
                        {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString("pt-BR") : "Não informado"}{" "}
                        - {calculateAge(patient.birthDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Gênero</label>
                      <p className="text-gray-900">Não informado</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Convênio</label>
                      <p className="text-gray-900">Particular</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Odontograma */}
              <Odontogram />
            </div>
          </TabsContent>

          <TabsContent value="anamneses">
            <AnamnesisList
              anamnesis={patientAnamnesis}
              patientId={patient.id}
              patientName={patient.name}
              onUpdate={() => {
                // Atualizar lista de anamneses
              }}
            />
          </TabsContent>

          <TabsContent value="orcamentos">
            <BudgetList
              budgets={patientBudgets}
              patientId={patient.id}
              patientName={patient.name}
              onUpdate={() => {
                // Atualizar lista de orçamentos
              }}
            />
          </TabsContent>

          <TabsContent value="tratamentos">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tratamentos</h3>
                <p className="text-gray-500">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pagamentos">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Pagamentos</h3>
                <p className="text-gray-500">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolucoes">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Evoluções</h3>
                <p className="text-gray-500">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentos">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Documentos</h3>
                <p className="text-gray-500">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="arquivos">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Arquivos</h3>
                <p className="text-gray-500">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
