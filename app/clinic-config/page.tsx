"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient, type ClinicaConfig, type ClinicaConfigRequest } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

type ReceiptType = "dentist" | "clinic"

const brazilianStates = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão",
  "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro",
  "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
]

const timezones = ["Brasília", "Manaus", "Rio Branco", "Boa Vista", "Cuiabá"]

export default function ClinicConfigPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState<ClinicaConfigRequest>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Carrega config inicial
  useEffect(() => {
    if (authLoading || !user?.clinicaId) return

    setIsLoading(true)
    apiClient.getClinicConfig()
      .then((data: ClinicaConfig) => {
        setFormData(data)
        if (data.logo_url) setLogoPreview(data.logo_url)
      })
      .catch((err) => {
        toast({ title: "Erro", description: err.mensagem, variant: "destructive" })
      })
      .finally(() => setIsLoading(false))
  }, [authLoading, user?.clinicaId, toast])

  const updateField = (field: keyof ClinicaConfigRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" })) // limpa erro ao digitar
    }
  }

  // Upload da logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  // Validações básicas
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome?.trim()) newErrors.nome = "Nome é obrigatório"
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"
    if (!formData.documento || !/^\d{11}$|^\d{14}$/.test(formData.documento)) newErrors.documento = "CPF ou CNPJ inválido"
    if (!formData.telefone || formData.telefone.replace(/\D/g, "").length < 10) newErrors.telefone = "Telefone inválido"
    if (!formData.cep || !/^\d{8}$/.test(formData.cep)) newErrors.cep = "CEP inválido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Buscar CEP automaticamente
  const handleCepBlur = async () => {
    const cep = formData.cep?.replace(/\D/g, "")
    if (cep && cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        if (!data.erro) {
          updateField("endereco", data.logradouro || "")
          updateField("bairro", data.bairro || "")
          updateField("cidade", data.localidade || "")
          updateField("estado", data.uf || "")
        } else {
          toast({ title: "CEP inválido", description: "Não encontrado", variant: "destructive" })
        }
      } catch {
        toast({ title: "Erro", description: "Falha ao buscar CEP", variant: "destructive" })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await apiClient.updateClinicConfig(formData)

      if (logoFile) {
        const result = await apiClient.uploadClinicLogo(logoFile)
        setLogoPreview(result.logo_url)
      }

      toast({ title: "Configurações salvas!", description: "Atualizadas com sucesso." })
      router.push("/dashboard")
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.mensagem || "Erro ao salvar configurações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Configurações da clínica</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados da clínica */}
            <Card>
              <CardHeader>
                <CardTitle>Dados da clínica</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.nome ?? ""}
                      onChange={(e) => updateField("nome", e.target.value)}
                      className={errors.nome ? "border-red-500" : ""}
                    />
                    {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ex: contato@minhaclinica.com"
                      value={formData.email ?? ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="document">CNPJ ou CPF</Label>
                    <Input
                      id="document"
                      value={formData.documento ?? ""}
                      onChange={(e) => updateField("documento", e.target.value)}
                      className={errors.documento ? "border-red-500" : ""}
                    />
                    {errors.documento && <p className="text-sm text-red-500">{errors.documento}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.telefone ?? ""}
                      onChange={(e) => updateField("telefone", e.target.value)}
                      className={errors.telefone ? "border-red-500" : ""}
                    />
                    {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Fuso horário</Label>
                    <Select value={formData.fuso_horario ?? ""} onValueChange={(v) => updateField("fuso_horario", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Logo da clínica</Label>
                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <div className="relative">
                          <img src={logoPreview} alt="Logo" className="w-16 h-16 rounded-md border object-cover" />
                          <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={removeLogo}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 border-2 border-dashed rounded-md flex items-center justify-center">
                          <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      <Label htmlFor="logo-upload">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>Upload logo</span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader><CardTitle>Endereço</CardTitle></CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep ?? ""}
                      onChange={(e) => updateField("cep", e.target.value)}
                      onBlur={handleCepBlur}
                      className={errors.cep ? "border-red-500" : ""}
                    />
                    {errors.cep && <p className="text-sm text-red-500">{errors.cep}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={formData.endereco ?? ""}
                      onChange={(e) => updateField("endereco", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  <Input id="number" value={formData.numero ?? ""} onChange={(e) => updateField("numero", e.target.value)} placeholder="Número" />
                  <Input id="complement" value={formData.complemento ?? ""} onChange={(e) => updateField("complemento", e.target.value)} placeholder="Complemento" />
                  <Input id="neighborhood" value={formData.bairro ?? ""} onChange={(e) => updateField("bairro", e.target.value)} placeholder="Bairro" />
                  <Input id="city" value={formData.cidade ?? ""} onChange={(e) => updateField("cidade", e.target.value)} placeholder="Cidade" />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select value={formData.estado ?? ""} onValueChange={(v) => updateField("estado", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {brazilianStates.map((st) => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Recursos & Contabilidade */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Recursos</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Switch checked={formData.chat_interno ?? false} onCheckedChange={(v) => updateField("chat_interno", v)} />
                    <Label>Chat interno</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={formData.lista_espera ?? false} onCheckedChange={(v) => updateField("lista_espera", v)} />
                    <Label>Listar pacientes aguardando</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={formData.pesquisa_satisfacao ?? false} onCheckedChange={(v) => updateField("pesquisa_satisfacao", v)} />
                    <Label>Pesquisa de satisfação</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Contabilidade</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={formData.recebimento_tipo ?? "clinic"} onValueChange={(v: ReceiptType) => updateField("recebimento_tipo", v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dentist" id="dentist" />
                      <Label htmlFor="dentist">Em nome do dentista</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="clinic" id="clinic" />
                      <Label htmlFor="clinic">Em nome da clínica</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
