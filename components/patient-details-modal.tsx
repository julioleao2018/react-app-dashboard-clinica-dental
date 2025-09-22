"use client"

import { useState } from "react"
import type { Patient } from "@/types/patient"
import type { Budget } from "@/types/budget"
import { mockAnamnesisResponses } from "@/data/mock-anamnesis"
import { mockBudgets } from "@/data/mock-budgets"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Edit,
  Calendar,
  FileText,
  User,
  Phone,
  Mail,
  DollarSign,
  Trash2,
  AlertTriangle,
  Heart,
  MessageSquare,
  X,
} from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { AnamnesisFormModal } from "./anamnesis-form-modal"
import { BudgetFormModal } from "./budget-form-modal"

interface PatientDetailsModalProps {
  patient: Patient | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (patient: Patient) => void
}

export function PatientDetailsModal({ patient, isOpen, onClose, onUpdate }: PatientDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null)
  const [isAnamnesisModalOpen, setIsAnamnesisModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets)
  const { toast } = useToast()

  if (!patient) return null

  const patientAnamnesis = mockAnamnesisResponses.filter((a) => a.patientId === patient.id)
  const patientBudgets = budgets.filter((b) => b.patientId === patient.id)

  const getAnamnesisAlerts = () => {
    const alerts: Array<{ type: "warning" | "error"; message: string }> = []

    patientAnamnesis.forEach((anamnesis) => {
      Object.entries(anamnesis.responses).forEach(([key, response]) => {
        if (response.answer === "Sim") {
          if (key.includes("alergia") || key.includes("medicamento")) {
            alerts.push({
              type: "error",
              message: `Paciente possui alergia a medicamento${response.additionalInfo ? `: ${response.additionalInfo}` : ""}`,
            })
          }
          if (key.includes("pressao") || key.includes("hipertensao")) {
            alerts.push({
              type: "warning",
              message: "Paciente possui hipertensão",
            })
          }
          if (key.includes("diabetes")) {
            alerts.push({
              type: "warning",
              message: "Paciente possui diabetes",
            })
          }
          if (key.includes("gravidez") || key.includes("gravida")) {
            alerts.push({
              type: "warning",
              message: "Paciente está grávida",
            })
          }
        }
      })
    })

    return alerts
  }

  const alerts = getAnamnesisAlerts()

  const handleEdit = () => {
    setEditedPatient({ ...patient })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!editedPatient) return

    onUpdate(editedPatient)
    setIsEditing(false)
    setEditedPatient(null)
    toast({
      title: "Sucesso",
      description: "Dados do paciente atualizados com sucesso",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedPatient(null)
  }

  const handleBudgetSave = (budget: Budget) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.id === budget.id)
      if (existing) {
        return prev.map((b) => (b.id === budget.id ? budget : b))
      }
      return [...prev, budget]
    })
    setEditingBudget(null)
  }

  const handleBudgetEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setIsBudgetModalOpen(true)
  }

  const handleBudgetDelete = (budgetId: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== budgetId))
    toast({
      title: "Sucesso",
      description: "Orçamento excluído com sucesso",
    })
  }

  const currentPatient = editedPatient || patient

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-2xl font-bold">{patient.name}</DialogTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>40 anos • CPF: 123.456.789-01</span>
                    <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                      {patient.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{patient.email}</span>
                    </div>
                    <span>8 consultas</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Consulta
                </Button>
                <Button variant="outline" size="sm" className="bg-green-600 text-white hover:bg-green-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dados" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger value="anamnese" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Anamnese
              </TabsTrigger>
              <TabsTrigger value="historico" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Histórico de Consultas
              </TabsTrigger>
              <TabsTrigger value="orcamentos" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Orçamentos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Nome Completo</Label>
                      <p className="text-sm">{currentPatient.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">E-mail</Label>
                      <p className="text-sm">{currentPatient.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                      <p className="text-sm">{currentPatient.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Data de Nascimento</Label>
                      <p className="text-sm">14/03/1985(40 anos)</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">CPF</Label>
                      <p className="text-sm">123.456.789-01</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Endereço</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">Rua das Flores, 123, Apto 45</p>
                    <p className="text-sm">Centro - São Paulo/SP</p>
                    <p className="text-sm">CEP: 01234-567</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Convênio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Convênio</Label>
                      <p className="text-sm">Unimed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Paciente com histórico de bruxismo</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="anamnese" className="space-y-6 mt-6">
              {alerts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Alertas Importantes
                  </h3>
                  {alerts.map((alert, index) => (
                    <Alert
                      key={index}
                      variant={alert.type === "error" ? "destructive" : "default"}
                      className={alert.type === "error" ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className={alert.type === "error" ? "text-red-800" : "text-orange-800"}>
                        {alert.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Anamneses Registradas</h3>
                <Button onClick={() => setIsAnamnesisModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Anamnese
                </Button>
              </div>

              {patientAnamnesis.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma anamnese registrada</p>
                    <p className="text-sm text-gray-400 mt-2">Clique em "Nova Anamnese" para adicionar</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {patientAnamnesis.map((anamnesis) => (
                    <Card key={anamnesis.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{anamnesis.templateName}</CardTitle>
                            <p className="text-sm text-gray-600">Última atualização: 14/06/2023</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-4">
                              <Heart className="h-4 w-4" />
                              Histórico Médico Geral
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(anamnesis.responses)
                                .filter(([key]) => !key.includes("odontologico") && !key.includes("habito"))
                                .slice(0, 8)
                                .map(([key, response]) => (
                                  <div key={key} className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-700">
                                      {key === "queixa_principal"
                                        ? "Queixa principal"
                                        : key.includes("alergia")
                                          ? "Possui alguma alergia?"
                                          : key.includes("pressao")
                                            ? "Tem pressão alta?"
                                            : key.includes("diabetes")
                                              ? "Possui diabetes?"
                                              : key.includes("medicacao")
                                                ? "Está usando medicação?"
                                                : key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </span>
                                    <Badge
                                      variant={
                                        response.answer === "Sim"
                                          ? "destructive"
                                          : response.answer === "Não"
                                            ? "secondary"
                                            : "outline"
                                      }
                                      className={
                                        response.answer === "Sim"
                                          ? "bg-red-100 text-red-800"
                                          : response.answer === "Não"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                      }
                                    >
                                      {response.answer}
                                    </Badge>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {Object.entries(anamnesis.responses).some(
                            ([key, response]) =>
                              key.includes("alergia") && response.answer === "Sim" && response.additionalInfo,
                          ) && (
                            <Alert className="border-red-200 bg-red-50">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800">
                                <strong>Medicamento que causa alergia:</strong>
                                <br />
                                {Object.entries(anamnesis.responses)
                                  .filter(([key, response]) => key.includes("alergia") && response.additionalInfo)
                                  .map(([, response]) => response.additionalInfo)
                                  .join(", ")}
                              </AlertDescription>
                            </Alert>
                          )}

                          {Object.entries(anamnesis.responses).some(
                            ([key, response]) =>
                              key.includes("medicacao") && response.answer === "Sim" && response.additionalInfo,
                          ) && (
                            <Alert className="border-blue-200 bg-blue-50">
                              <AlertDescription className="text-blue-800">
                                <strong>Medicamentos em uso:</strong>
                                <br />
                                {Object.entries(anamnesis.responses)
                                  .filter(([key, response]) => key.includes("medicacao") && response.additionalInfo)
                                  .map(([, response]) => response.additionalInfo)
                                  .join(", ")}
                              </AlertDescription>
                            </Alert>
                          )}

                          <div>
                            <h4 className="font-semibold text-blue-600 flex items-center gap-2 mb-4">
                              <FileText className="h-4 w-4" />
                              Histórico Odontológico
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-blue-50 p-3 rounded">
                                <Label className="text-sm font-medium text-blue-700">
                                  Última consulta ao dentista:
                                </Label>
                                <p className="text-sm text-blue-600">Há 6 meses</p>
                              </div>
                              <div className="bg-blue-50 p-3 rounded">
                                <Label className="text-sm font-medium text-blue-700">Motivo da consulta:</Label>
                                <p className="text-sm text-blue-600">Limpeza e check-up</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                ["Dor de dente", "Não"],
                                ["Sangramento na gengiva", "Sim"],
                                ["Mau hálito", "Não"],
                                ["Boca seca", "Não"],
                                ["Bruxismo (range os dentes)", "Sim"],
                                ["Sensibilidade dental", "Não"],
                              ].map(([question, answer]) => (
                                <div key={question} className="flex justify-between items-center py-2">
                                  <span className="text-sm text-gray-700">{question}</span>
                                  <Badge
                                    variant={answer === "Sim" ? "destructive" : "secondary"}
                                    className={
                                      answer === "Sim" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                                    }
                                  >
                                    {answer}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700 mb-4">Hábitos</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                ["Fumante", "Não"],
                                ["Bebida alcoólica", "Não"],
                                ["Rói unhas", "Não"],
                                ["Mastiga caneta/lápis", "Não"],
                              ].map(([question, answer]) => (
                                <div key={question} className="flex justify-between items-center py-2">
                                  <span className="text-sm text-gray-700">{question}</span>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {answer}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-purple-600 flex items-center gap-2 mb-4">
                              <MessageSquare className="h-4 w-4" />
                              Observações Adicionais da Anamnese
                            </h4>
                            <div className="bg-purple-50 p-4 rounded">
                              <p className="text-sm text-purple-800">
                                Paciente apresenta ansiedade durante procedimentos odontológicos
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="historico" className="space-y-6 mt-6">
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Histórico de consultas em desenvolvimento</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orcamentos" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Orçamentos</h3>
                <Button
                  onClick={() => {
                    setEditingBudget(null)
                    setIsBudgetModalOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Orçamento
                </Button>
              </div>

              {patientBudgets.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum orçamento registrado</p>
                    <p className="text-sm text-gray-400 mt-2">Clique em "Novo Orçamento" para adicionar</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Profissional</TableHead>
                          <TableHead>Tratamento</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Dente</TableHead>
                          <TableHead>Face</TableHead>
                          <TableHead>Convênio</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientBudgets.map((budget) => (
                          <TableRow key={budget.id}>
                            <TableCell className="font-medium">{budget.professional}</TableCell>
                            <TableCell>{budget.treatment}</TableCell>
                            <TableCell>
                              {budget.value.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </TableCell>
                            <TableCell>{budget.toothNumber || "-"}</TableCell>
                            <TableCell>{budget.toothFaces?.join(", ") || "-"}</TableCell>
                            <TableCell>{budget.insurance || "Particular"}</TableCell>
                            <TableCell>{new Date(budget.date).toLocaleDateString("pt-BR")}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleBudgetEdit(budget)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleBudgetDelete(budget.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AnamnesisFormModal
        isOpen={isAnamnesisModalOpen}
        onClose={() => setIsAnamnesisModalOpen(false)}
        patientId={patient.id}
        patientName={patient.name}
      />

      <BudgetFormModal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false)
          setEditingBudget(null)
        }}
        patientId={patient.id}
        patientName={patient.name}
        budget={editingBudget}
        onSave={handleBudgetSave}
      />
    </>
  )
}
