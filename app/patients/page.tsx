"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Phone, Mail, Calendar, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { Patient } from "@/types/patient"
import { mockPatients } from "@/data/mock-patients"

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({})
  const { toast } = useToast()

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.email || !newPatient.phone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    const patient: Patient = {
      id: Date.now().toString(),
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      birthDate: newPatient.birthDate || "",
      address: newPatient.address || "",
      notes: newPatient.notes || "",
      lastVisit: "",
      status: "active",
      cpf: newPatient.cpf || "",
      profession: newPatient.profession || "",
    }

    setPatients([...patients, patient])
    setNewPatient({})
    setIsAddDialogOpen(false)

    toast({
      title: "Sucesso",
      description: "Paciente adicionado com sucesso",
    })
  }

  const handlePatientClick = (patient: Patient) => {
    router.push(`/patients/${patient.id}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
            <p className="text-gray-600">Gerencie os pacientes da clínica</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Paciente</DialogTitle>
                <DialogDescription>Preencha as informações do paciente</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* ... existing form fields ... */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={newPatient.name || ""}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={newPatient.birthDate || ""}
                      onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatient.email || ""}
                      onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={newPatient.phone || ""}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={newPatient.cpf || ""}
                      onChange={(e) => setNewPatient({ ...newPatient, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profissão</Label>
                    <Input
                      id="profession"
                      value={newPatient.profession || ""}
                      onChange={(e) => setNewPatient({ ...newPatient, profession: e.target.value })}
                      placeholder="Profissão"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={newPatient.address || ""}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    placeholder="Endereço completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={newPatient.notes || ""}
                    onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
                    placeholder="Observações médicas, alergias, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700">
                  Adicionar Paciente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3
                        className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handlePatientClick(patient)}
                      >
                        {patient.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {patient.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {patient.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                        {patient.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                      {patient.nextAppointment && (
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          Próxima consulta: {new Date(patient.nextAppointment).toLocaleDateString("pt-BR")}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handlePatientClick(patient)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
                {patient.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{patient.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum paciente encontrado</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
