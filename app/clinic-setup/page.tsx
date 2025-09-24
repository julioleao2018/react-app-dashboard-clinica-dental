"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Building2, Users, Phone, FileText } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"


export default function ClinicSetupPage() {
  const { registerClinic, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    clinicName: "",
    phone: "",
    document: "",
    documentType: "cnpj" as "cnpj" | "cpf",
    professionalCount: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clinicName.trim()) {
      newErrors.clinicName = "Nome da clínica é obrigatório"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    if (!formData.document.trim()) {
      newErrors.document = `${formData.documentType.toUpperCase()} é obrigatório`
    }

    if (!formData.professionalCount) {
      newErrors.professionalCount = "Número de profissionais é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const result = await registerClinic({
      nome: formData.clinicName,
      telefone: formData.phone,
      documento: formData.document,
      numero_profissionais: parseInt(formData.professionalCount) || 0,
    })

    if (result.success) {
      toast({
        title: "Configuração concluída!",
        description: "Bem-vindo! Seu teste grátis de 7 dias já começou.",
      })
      router.push("/dashboard")
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (formData.documentType === "cnpj") {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    } else {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Dados da Clínica</CardTitle>
          <CardDescription>
            Vamos configurar as informações básicas da sua clínica para personalizar sua experiência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome da Clínica */}
            <div className="space-y-2">
              <Label htmlFor="clinicName" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nome da Clínica
              </Label>
              <Input
                id="clinicName"
                type="text"
                placeholder="Digite o nome da sua clínica"
                value={formData.clinicName}
                onChange={(e) => handleInputChange("clinicName", e.target.value)}
                className={errors.clinicName ? "border-red-500" : ""}
              />
              {errors.clinicName && <p className="text-sm text-red-500">{errors.clinicName}</p>}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              <Input
                id="phone"
                type="text"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                className={errors.phone ? "border-red-500" : ""}
                maxLength={15}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Tipo de Documento */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tipo de Documento
              </Label>
              <Select value={formData.documentType} onValueChange={(value) => handleInputChange("documentType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cnpj">CNPJ</SelectItem>
                  <SelectItem value="cpf">CPF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Documento */}
            <div className="space-y-2">
              <Label htmlFor="document">{formData.documentType === "cnpj" ? "CNPJ" : "CPF"}</Label>
              <Input
                id="document"
                type="text"
                placeholder={formData.documentType === "cnpj" ? "00.000.000/0000-00" : "000.000.000-00"}
                value={formData.document}
                onChange={(e) => handleInputChange("document", formatDocument(e.target.value))}
                className={errors.document ? "border-red-500" : ""}
                maxLength={formData.documentType === "cnpj" ? 18 : 14}
              />
              {errors.document && <p className="text-sm text-red-500">{errors.document}</p>}
            </div>

            {/* Número de Profissionais */}
            <div className="space-y-2">
              <Label htmlFor="professionalCount" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Número de Profissionais
              </Label>
              <Select
                value={formData.professionalCount}
                onValueChange={(value) => handleInputChange("professionalCount", value)}
              >
                <SelectTrigger className={errors.professionalCount ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o número de profissionais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 profissional</SelectItem>
                  <SelectItem value="2-5">2 a 5 profissionais</SelectItem>
                  <SelectItem value="6-10">6 a 10 profissionais</SelectItem>
                  <SelectItem value="11-20">11 a 20 profissionais</SelectItem>
                  <SelectItem value="20+">Mais de 20 profissionais</SelectItem>
                </SelectContent>
              </Select>
              {errors.professionalCount && <p className="text-sm text-red-500">{errors.professionalCount}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Finalizar configuração"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500">
            Você poderá alterar essas informações a qualquer momento nas configurações
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
