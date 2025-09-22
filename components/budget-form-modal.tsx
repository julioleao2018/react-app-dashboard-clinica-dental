"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { mockTreatments, mockInsurances, toothFaces, teethNumbers } from "@/data/mock-budgets"
import type { Budget } from "@/types/budget"

interface BudgetFormModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  budget?: Budget | null
  onSave: (budget: Budget) => void
}

export function BudgetFormModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  budget = null,
  onSave,
}: BudgetFormModalProps) {
  const [formData, setFormData] = useState({
    professional: budget?.professional || "",
    treatment: budget?.treatment || "",
    value: budget?.value?.toString() || "",
    toothNumber: budget?.toothNumber || "",
    toothFaces: budget?.toothFaces || [],
    insurance: budget?.insurance || "",
    observations: budget?.observations || "",
    date: budget?.date || new Date().toISOString().split("T")[0],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação
    const newErrors: Record<string, string> = {}
    if (!formData.professional.trim()) newErrors.professional = "Profissional é obrigatório"
    if (!formData.treatment) newErrors.treatment = "Tratamento é obrigatório"
    if (!formData.value || Number.parseFloat(formData.value) <= 0) newErrors.value = "Valor deve ser maior que zero"

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    const budgetData: Budget = {
      id: budget?.id || Date.now().toString(),
      patientId,
      professional: formData.professional,
      treatment: formData.treatment,
      value: Number.parseFloat(formData.value),
      toothNumber: formData.toothNumber || undefined,
      toothFaces: formData.toothFaces.length > 0 ? formData.toothFaces : undefined,
      insurance: formData.insurance || undefined,
      observations: formData.observations || undefined,
      date: formData.date,
      createdAt: budget?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(budgetData)
    onClose()

    toast({
      title: "Sucesso",
      description: budget ? "Orçamento atualizado com sucesso" : "Orçamento criado com sucesso",
    })
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "")
    const formattedValue = (Number.parseFloat(numericValue) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formattedValue
  }

  const handleValueChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "")
    const formattedValue = (Number.parseFloat(numericValue) / 100).toString()
    setFormData((prev) => ({ ...prev, value: formattedValue }))
  }

  const handleFaceToggle = (faceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      toothFaces: checked ? [...prev.toothFaces, faceId] : prev.toothFaces.filter((f) => f !== faceId),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {budget ? "Editar Orçamento" : "Novo Orçamento"} - {patientName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professional">Profissional *</Label>
              <Input
                id="professional"
                value={formData.professional}
                onChange={(e) => setFormData((prev) => ({ ...prev, professional: e.target.value }))}
                placeholder="Nome do profissional"
                className={errors.professional ? "border-red-500" : ""}
              />
              {errors.professional && <p className="text-sm text-red-500">{errors.professional}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Tratamento *</Label>
              <Select
                value={formData.treatment}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, treatment: value }))}
              >
                <SelectTrigger className={errors.treatment ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o tratamento" />
                </SelectTrigger>
                <SelectContent>
                  {mockTreatments.map((treatment) => (
                    <SelectItem key={treatment.id} value={treatment.name}>
                      {treatment.name} ({treatment.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.treatment && <p className="text-sm text-red-500">{errors.treatment}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Valor *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                <Input
                  id="value"
                  value={formatCurrency(formData.value)}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder="0,00"
                  className={`pl-10 ${errors.value ? "border-red-500" : ""}`}
                />
              </div>
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data do Orçamento</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="toothNumber">Número do Dente</Label>
              <Select
                value={formData.toothNumber}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, toothNumber: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não se aplica</SelectItem>
                  {Object.entries(teethNumbers.adults).map(([quadrant, teeth]) => (
                    <div key={quadrant}>
                      <div className="px-2 py-1 text-sm font-medium text-gray-500">{quadrant}</div>
                      {teeth.map((tooth) => (
                        <SelectItem key={tooth} value={tooth}>
                          Dente {tooth}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                  {Object.entries(teethNumbers.deciduous).map(([quadrant, teeth]) => (
                    <div key={quadrant}>
                      <div className="px-2 py-1 text-sm font-medium text-gray-500">{quadrant}</div>
                      {teeth.map((tooth) => (
                        <SelectItem key={tooth} value={tooth}>
                          Dente {tooth}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance">Convênio</Label>
              <Select
                value={formData.insurance}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, insurance: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o convênio" />
                </SelectTrigger>
                <SelectContent>
                  {mockInsurances.map((insurance) => (
                    <SelectItem key={insurance.id} value={insurance.name}>
                      {insurance.name} ({insurance.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.toothNumber && formData.toothNumber !== "none" && (
            <div className="space-y-2">
              <Label>Faces do Dente</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {toothFaces.map((face) => (
                  <div key={face.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={face.id}
                      checked={formData.toothFaces.includes(face.id)}
                      onCheckedChange={(checked) => handleFaceToggle(face.id, checked as boolean)}
                    />
                    <Label htmlFor={face.id} className="text-sm">
                      {face.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="observations">Observações/Notas</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
              placeholder="Observações sobre o tratamento..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{budget ? "Atualizar" : "Salvar"} Orçamento</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
