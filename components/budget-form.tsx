"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { mockInsurances, toothFaces, teethNumbers } from "@/data/mock-budgets"
import type { Budget, BudgetItem } from "@/types/budget"
import { ArrowLeft, MoreVertical } from "@/components/icons"

interface BudgetFormProps {
  patientId: string
  patientName: string
  budget?: Budget | null
  onSave: (budget: Budget) => void
  onCancel: () => void
}

export function BudgetForm({ patientId, patientName, budget = null, onSave, onCancel }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    professional: budget?.professional || "Aline Prado",
    insurance: budget?.insurance || "Particular",
    date: budget?.date || new Date().toISOString().split("T")[0],
    budgetName: budget?.budgetName || `Plano de tratamento de ${patientName}`,
    discountType: budget?.discountType || ("percentage" as const),
    discountValue: budget?.discountValue?.toString() || "",
    installments: budget?.installments || false,
    downPayment: budget?.downPayment?.toString() || "0",
    installmentCount: budget?.installmentCount?.toString() || "1",
    observations: budget?.observations || "",
    generateContract: budget?.generateContract || false,
  })

  const [currentTreatment, setCurrentTreatment] = useState({
    treatment: "",
    value: "",
    toothNumber: "",
    toothFaces: "",
    multiplyByTooth: false,
  })

  const [items, setItems] = useState<BudgetItem[]>(budget?.items || [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const addTreatmentToList = () => {
    if (!currentTreatment.treatment || !currentTreatment.value) {
      toast({
        title: "Erro",
        description: "Preencha o tratamento e valor",
        variant: "destructive",
      })
      return
    }

    const newItem: BudgetItem = {
      id: Date.now().toString(),
      treatment: currentTreatment.treatment,
      value: Number.parseFloat(currentTreatment.value.replace(/[^\d,]/g, "").replace(",", ".")) || 0,
      toothNumber: currentTreatment.toothNumber,
      toothFaces: currentTreatment.toothFaces ? [currentTreatment.toothFaces] : [],
      observations: "",
    }

    setItems([...items, newItem])

    setCurrentTreatment({
      treatment: "",
      value: "",
      toothNumber: "",
      toothFaces: "",
      multiplyByTooth: false,
    })
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const subtotal = items.reduce((sum, item) => sum + item.value, 0)
  const discountAmount = formData.discountValue
    ? formData.discountType === "percentage"
      ? (subtotal * Number.parseFloat(formData.discountValue)) / 100
      : Number.parseFloat(formData.discountValue)
    : 0
  const total = Math.max(0, subtotal - discountAmount)

  const handleNumericInput = (value: string, setter: (value: string) => void) => {
    const numericValue = value.replace(/[^0-9,.-]/g, "")
    if (numericValue.startsWith("-")) {
      return
    }
    setter(numericValue)
  }

  const formatCurrency = (value: string) => {
    if (!value) return ""
    const numericValue = value.replace(/[^0-9]/g, "")
    if (numericValue === "0" || numericValue === "00") return "0,00"
    if (!numericValue) return ""
    const formattedValue = (Number.parseInt(numericValue) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formattedValue
  }

  const handleValueChange = (value: string) => {
    const formatted = formatCurrency(value)
    setCurrentTreatment((prev) => ({ ...prev, value: formatted }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um tratamento",
        variant: "destructive",
      })
      return
    }

    const budgetData: Budget = {
      id: budget?.id || Date.now().toString(),
      patientId,
      professional: formData.professional,
      items,
      subtotal,
      discountType: formData.discountType,
      discountValue: Number.parseFloat(formData.discountValue || "0"),
      total,
      insurance: formData.insurance,
      date: formData.date,
      budgetName: formData.budgetName,
      installments: formData.installments,
      downPayment: Number.parseFloat(formData.downPayment || "0"),
      installmentCount: Number.parseInt(formData.installmentCount || "1"),
      observations: formData.observations,
      generateContract: formData.generateContract,
      status: budget?.status || "pending",
      createdAt: budget?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(budgetData)
    toast({
      title: "Sucesso",
      description: budget ? "Orçamento atualizado com sucesso" : "Orçamento criado com sucesso",
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-semibold">Criar orçamento</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="bg-white border-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label>Nome do orçamento</Label>
            <Input
              value={formData.budgetName}
              onChange={(e) => setFormData((prev) => ({ ...prev, budgetName: e.target.value }))}
              className="bg-white border-gray-200"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h2 className="text-lg font-medium">Adicionar tratamentos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>* Profissional</Label>
              <Select
                value={formData.professional}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, professional: value }))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aline Prado">Aline Prado</SelectItem>
                  <SelectItem value="Dr. Silva">Dr. Silva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>* Convênio</Label>
              <Select
                value={formData.insurance}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, insurance: value }))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Particular">Particular</SelectItem>
                  {mockInsurances.map((insurance) => (
                    <SelectItem key={insurance.id} value={insurance.name}>
                      {insurance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>* Tratamento</Label>
              <Input
                value={currentTreatment.treatment}
                onChange={(e) => setCurrentTreatment((prev) => ({ ...prev, treatment: e.target.value }))}
                placeholder="Digite o nome de um tratamento"
                className="bg-white border-gray-200"
              />
              <Button type="button" variant="link" className="p-0 h-auto text-blue-600">
                Cadastrar novo tratamento
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                <Input
                  value={currentTreatment.value}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder="0,00"
                  className="pl-10 bg-white border-gray-200"
                  onKeyDown={(e) => {
                    if (
                      !/[0-9,.-]/.test(e.key) &&
                      !["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key)
                    ) {
                      e.preventDefault()
                    }
                    if (e.key === "-") {
                      e.preventDefault()
                    }
                  }}
                />
              </div>
              <Button type="button" variant="link" className="p-0 h-auto text-blue-600">
                Vídeo procedimento
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dente(s)</Label>
              <Select
                value={currentTreatment.toothNumber}
                onValueChange={(value) => setCurrentTreatment((prev) => ({ ...prev, toothNumber: value }))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não se aplica</SelectItem>
                  {Object.entries(teethNumbers.adults).map(([quadrant, teeth]) => (
                    <div key={quadrant}>
                      {teeth.map((tooth) => (
                        <SelectItem key={tooth} value={tooth}>
                          {tooth}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Face(s)</Label>
              <Select
                value={currentTreatment.toothFaces}
                onValueChange={(value) => setCurrentTreatment((prev) => ({ ...prev, toothFaces: value }))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {toothFaces.map((face) => (
                    <SelectItem key={face.id} value={face.id}>
                      {face.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={currentTreatment.multiplyByTooth}
              onCheckedChange={(checked) => setCurrentTreatment((prev) => ({ ...prev, multiplyByTooth: checked }))}
            />
            <Label>Multiplicar valor por dente</Label>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={addTreatmentToList} className="bg-blue-600 hover:bg-blue-700">
              Adicionar ao orçamento
            </Button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h3 className="text-lg font-medium">Tratamentos adicionados ({items.length})</h3>

            {items.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border rounded"></div>
                  <div>
                    <div className="font-medium">{item.treatment}</div>
                    <div className="text-sm text-gray-500">
                      {formData.insurance} • {formData.professional}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">
                    R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span>R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Desconto</span>
            <Button type="button" variant="link" className="text-blue-600">
              + Adicionar
            </Button>
          </div>

          <div className="flex justify-between text-xl font-bold border-t pt-4">
            <span>TOTAL</span>
            <span>R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.installments}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, installments: checked }))}
            />
            <Label className="text-lg">Parcelar</Label>
          </div>

          {formData.installments && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entrada</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    value={formData.downPayment}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, (value) =>
                        setFormData((prev) => ({ ...prev, downPayment: value })),
                      )
                    }
                    className="pl-10 bg-gray-50 border-gray-200"
                    onKeyDown={(e) => {
                      if (
                        !/[0-9,.-]/.test(e.key) &&
                        !["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key)
                      ) {
                        e.preventDefault()
                      }
                      if (e.key === "-") {
                        e.preventDefault()
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Número de parcelas</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.installmentCount}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || (Number(value) > 0 && !value.includes("-"))) {
                      setFormData((prev) => ({ ...prev, installmentCount: value }))
                    }
                  }}
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            </div>
          )}

          {formData.installments && (
            <div className="text-sm text-gray-600">
              Você poderá definir a data de cada parcela ao aprovar o orçamento
            </div>
          )}

          {formData.installments && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Entrada</span>
                <span>
                  R${" "}
                  {Number.parseFloat(formData.downPayment || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Parcelas</span>
                <span>
                  {formData.installmentCount}x R${" "}
                  {(
                    (total - Number.parseFloat(formData.downPayment || "0")) /
                    Number.parseInt(formData.installmentCount || "1")
                  ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-2">
          <Label>Observação</Label>
          <Textarea
            value={formData.observations}
            onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
            placeholder="Escreva uma observação..."
            className="bg-gray-50 border-gray-200"
            rows={4}
          />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-2">
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.generateContract}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, generateContract: checked }))}
            />
            <Label>Gerar contrato</Label>
          </div>
          <div className="text-sm text-gray-600">
            Ao aprovar esse orçamento, um contrato será gerado. Você poderá modificá-lo conforme necessário.
          </div>
          <div className="text-xs text-gray-500">Contrato elaborado por Marjanna Pinsard • OAB/RJ 165.270</div>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <div className="space-x-2">
            <Button type="button" variant="outline">
              Aprovar orçamento
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar orçamento
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
