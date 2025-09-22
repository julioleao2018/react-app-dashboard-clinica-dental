"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { AnamnesisResponse } from "@/types/anamnesis"

interface AnamnesisFormProps {
  patientId: string
  patientName: string
  onSave: (anamnesis: AnamnesisResponse) => void
  onCancel: () => void
}

const anamnesisTypes = [
  { id: "inicial", name: "Anamnese Inicial" },
  { id: "retorno", name: "Anamnese de Retorno" },
  { id: "emergencia", name: "Anamnese de Emergência" },
  { id: "cirurgica", name: "Anamnese Pré-Cirúrgica" },
  { id: "ortodontica", name: "Anamnese Ortodôntica" },
]

const anamnesisQuestions = [
  {
    id: "alergia_medicamento",
    question: "Possui alergia a algum medicamento?",
    type: "radio" as const,
    options: ["Sim", "Não"],
    hasAdditionalInfo: true,
    additionalInfoLabel: "Qual medicamento?",
  },
  {
    id: "pressao_alta",
    question: "Possui pressão alta?",
    type: "radio" as const,
    options: ["Sim", "Não"],
  },
  {
    id: "diabetes",
    question: "Possui diabetes?",
    type: "radio" as const,
    options: ["Sim", "Não"],
  },
  {
    id: "problema_cardiaco",
    question: "Possui algum problema cardíaco?",
    type: "radio" as const,
    options: ["Sim", "Não"],
    hasAdditionalInfo: true,
    additionalInfoLabel: "Qual problema?",
  },
  {
    id: "medicamento_uso",
    question: "Faz uso de algum medicamento?",
    type: "radio" as const,
    options: ["Sim", "Não", "Ex-fumante"],
    hasAdditionalInfo: true,
    additionalInfoLabel: "Quais medicamentos?",
  },
  {
    id: "gravidez",
    question: "Está grávida ou amamentando?",
    type: "radio" as const,
    options: ["Sim", "Não", "Não se aplica"],
  },
  {
    id: "fumante",
    question: "É fumante?",
    type: "radio" as const,
    options: ["Sim", "Não", "Ex-fumante"],
  },
  {
    id: "observacoes",
    question: "Observações gerais",
    type: "textarea" as const,
  },
]

export function AnamnesisForm({ patientId, patientName, onSave, onCancel }: AnamnesisFormProps) {
  const [responses, setResponses] = useState<Record<string, { answer: string; additionalInfo?: string }>>({})
  const [anamnesisType, setAnamnesisType] = useState("")
  const { toast } = useToast()

  const handleResponseChange = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer,
      },
    }))
  }

  const handleAdditionalInfoChange = (questionId: string, additionalInfo: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        additionalInfo,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!anamnesisType) {
      toast({
        title: "Erro de validação",
        description: "Por favor, selecione o tipo de anamnese",
        variant: "destructive",
      })
      return
    }

    const anamnesisData: AnamnesisResponse = {
      id: Date.now().toString(),
      patientId,
      type: anamnesisType,
      responses,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(anamnesisData)

    toast({
      title: "Sucesso",
      description: "Anamnese salva com sucesso",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Anamnese - {patientName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="anamnesisType">Tipo de Anamnese *</Label>
            <Select value={anamnesisType} onValueChange={setAnamnesisType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de anamnese" />
              </SelectTrigger>
              <SelectContent>
                {anamnesisTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {anamnesisQuestions.map((question) => (
            <div key={question.id} className="space-y-3">
              <Label className="text-base font-medium">{question.question}</Label>

              {question.type === "radio" && (
                <RadioGroup
                  value={responses[question.id]?.answer || ""}
                  onValueChange={(value) => handleResponseChange(question.id, value)}
                >
                  {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === "textarea" && (
                <Textarea
                  value={responses[question.id]?.answer || ""}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  placeholder="Digite suas observações..."
                  rows={3}
                />
              )}

              {question.hasAdditionalInfo && responses[question.id]?.answer === "Sim" && (
                <div className="ml-6 space-y-2">
                  <Label className="text-sm text-gray-600">{question.additionalInfoLabel}</Label>
                  <Input
                    value={responses[question.id]?.additionalInfo || ""}
                    onChange={(e) => handleAdditionalInfoChange(question.id, e.target.value)}
                    placeholder="Especifique..."
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Anamnese
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
