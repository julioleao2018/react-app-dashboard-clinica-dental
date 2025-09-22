"use client"

import { useState } from "react"
import { anamnesisTemplates } from "@/data/anamnesis-templates"
import type { AnamnesisTemplate, AnamnesisQuestion } from "@/types/patient"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AnamnesisFormModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
}

export function AnamnesisFormModal({ isOpen, onClose, patientId, patientName }: AnamnesisFormModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<AnamnesisTemplate | null>(null)
  const [responses, setResponses] = useState<Record<string, { answer: string; additionalInfo?: string }>>({})
  const { toast } = useToast()

  const handleTemplateSelect = (template: AnamnesisTemplate) => {
    setSelectedTemplate(template)
    setResponses({})
  }

  const handleBack = () => {
    setSelectedTemplate(null)
    setResponses({})
  }

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

  const handleSubmit = () => {
    if (!selectedTemplate) return

    const requiredQuestions = selectedTemplate.questions.filter((q) => q.required)
    const missingRequired = requiredQuestions.filter((q) => !responses[q.id]?.answer)

    if (missingRequired.length > 0) {
      toast({
        title: "Erro",
        description: "Preencha todas as perguntas obrigatórias",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Sucesso",
      description: "Anamnese salva com sucesso",
    })

    onClose()
    setSelectedTemplate(null)
    setResponses({})
  }

  const renderQuestion = (question: AnamnesisQuestion) => {
    const response = responses[question.id]

    return (
      <Card key={question.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {question.type === "yes_no_unknown" && (
              <RadioGroup
                value={response?.answer || ""}
                onValueChange={(value) => handleResponseChange(question.id, value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Sim" id={`${question.id}-sim`} />
                  <Label htmlFor={`${question.id}-sim`}>Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Não" id={`${question.id}-nao`} />
                  <Label htmlFor={`${question.id}-nao`}>Não</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Não sei" id={`${question.id}-nao-sei`} />
                  <Label htmlFor={`${question.id}-nao-sei`}>Não sei</Label>
                </div>
              </RadioGroup>
            )}

            {question.type === "text" && (
              <Input
                value={response?.answer || ""}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder="Digite aqui..."
              />
            )}

            {question.type === "textarea" && (
              <Textarea
                value={response?.answer || ""}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder="Digite aqui..."
                rows={3}
              />
            )}

            {question.additionalInfo && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Informações adicionais</Label>
                <Textarea
                  value={response?.additionalInfo || ""}
                  onChange={(e) => handleAdditionalInfoChange(question.id, e.target.value)}
                  placeholder="Digite aqui..."
                  rows={2}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {selectedTemplate && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h2 className="text-xl font-bold">{selectedTemplate ? selectedTemplate.name : "Nova Anamnese"}</h2>
              <p className="text-sm text-gray-600">Paciente: {patientName}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {!selectedTemplate ? (
          <div className="space-y-4">
            <p className="text-gray-600">Selecione um modelo de anamnese:</p>
            <div className="grid gap-4">
              {anamnesisTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      {template.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <p className="text-xs text-gray-500">{template.questions.length} perguntas</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar para paciente responder
                </Button>
                <Button onClick={handleSubmit} size="sm">
                  Salvar respostas
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[60vh]">
              <div className="space-y-4 pr-4">{selectedTemplate.questions.map(renderQuestion)}</div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
