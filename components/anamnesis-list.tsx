"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AnamnesisForm } from "./anamnesis-form"
import { Plus, FileText, ArrowLeft } from "./icons"
import type { Anamnesis } from "@/types/patient"
import type { AnamnesisResponse } from "@/types/anamnesis"

interface AnamnesisListProps {
  anamnesis: Anamnesis[]
  patientId: string
  patientName: string
  onUpdate: () => void
}

export function AnamnesisList({ anamnesis, patientId, patientName, onUpdate }: AnamnesisListProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<Anamnesis | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleViewAnamnesis = (anamnesisItem: Anamnesis) => {
    setSelectedAnamnesis(anamnesisItem)
    setShowDetails(true)
  }

  const handleSaveAnamnesis = (anamnesisData: AnamnesisResponse) => {
    console.log("[v0] Salvando anamnese:", anamnesisData)
    setShowForm(false)
    onUpdate()
  }

  const generateSummary = (anamnesisItem: Anamnesis) => {
    const responsesArray = Object.entries(anamnesisItem.responses).map(([key, value]) => ({
      question: key,
      answer: value,
    }))
    const positiveResponses = responsesArray.filter((r) => r.answer.answer === "Sim")
    const importantInfo = positiveResponses
      .slice(0, 3)
      .map((r) => r.question)
      .join(", ")
    return importantInfo || "Nenhuma alteração significativa"
  }

  const getAnamnesisAlerts = (anamnesisItem: Anamnesis) => {
    const alerts = []
    const responsesArray = Object.entries(anamnesisItem.responses).map(([key, value]) => ({
      question: key,
      answer: value,
    }))

    const hasAllergy = responsesArray.some(
      (r) => r.question.toLowerCase().includes("alergia") && r.answer.answer === "Sim",
    )

    const hasHypertension = responsesArray.some(
      (r) => r.question.toLowerCase().includes("pressao_alta") && r.answer.answer === "Sim",
    )

    if (hasAllergy) alerts.push("Alergia")
    if (hasHypertension) alerts.push("Hipertensão")

    return alerts
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Nova Anamnese</h2>
        </div>
        <AnamnesisForm
          patientId={patientId}
          patientName={patientName}
          onSave={handleSaveAnamnesis}
          onCancel={() => setShowForm(false)}
        />
      </div>
    )
  }

  if (showDetails && selectedAnamnesis) {
    const alerts = getAnamnesisAlerts(selectedAnamnesis)

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ficha de {selectedAnamnesis.templateName}</h2>
            <p className="text-sm text-gray-600">
              Última atualização: {new Date(selectedAnamnesis.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Alertas importantes */}
          {alerts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">⚠️ Alertas Importantes</h3>
              {alerts.map((alert, index) => (
                <Alert key={index} className="mb-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">Paciente possui {alert.toLowerCase()}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Histórico Médico Geral */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">❤️ Histórico Médico Geral</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedAnamnesis.responses).map(([question, response], index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 text-sm">{question.replace(/_/g, " ")}</span>
                    <div className="flex flex-col items-end">
                      <Badge
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
                      {response.additionalInfo && (
                        <span className="text-xs text-gray-500 mt-1">{response.additionalInfo}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observações adicionais */}
          {selectedAnamnesis.notes && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-purple-600 mb-3 flex items-center">
                  📝 Observações Adicionais
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800">{selectedAnamnesis.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Anamneses</h2>
          <p className="text-gray-600">Histórico de anamneses do paciente</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Anamnese
        </Button>
      </div>

      {anamnesis.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma anamnese registrada</h3>
            <p className="text-gray-600 mb-4">Adicione a primeira anamnese para este paciente</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Anamnese
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {anamnesis.map((anamnesisItem) => {
            const alerts = getAnamnesisAlerts(anamnesisItem)

            return (
              <Card key={anamnesisItem.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{anamnesisItem.templateName}</h3>
                        <Badge variant="outline">{new Date(anamnesisItem.createdAt).toLocaleDateString("pt-BR")}</Badge>
                        {alerts.length > 0 && (
                          <div className="flex space-x-1">
                            {alerts.map((alert, index) => (
                              <Badge key={index} className="bg-red-100 text-red-800 border-red-200">
                                ⚠️ {alert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{generateSummary(anamnesisItem)}</p>

                      {anamnesisItem.notes && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Observações:</strong> {anamnesisItem.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => handleViewAnamnesis(anamnesisItem)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
