"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, User, Stethoscope } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  dentistName: string
  dentistId: string
  date: string
  time: string
  duration: number
  type: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  notes?: string
}

interface Professional {
  id: string
  name: string
  specialty: string
}

const mockProfessionals: Professional[] = [
  { id: "1", name: "Dr. Silva", specialty: "Clínico Geral" },
  { id: "2", name: "Dra. Santos", specialty: "Ortodontia" },
  { id: "3", name: "Dr. Oliveira", specialty: "Endodontia" },
]

const mockPatients = [
  { id: "1", name: "Maria Silva" },
  { id: "2", name: "João Santos" },
  { id: "3", name: "Ana Costa" },
]

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Maria Silva",
    patientId: "1",
    dentistName: "Dr. Silva",
    dentistId: "1",
    date: "2024-02-20",
    time: "09:00",
    duration: 60,
    type: "Consulta",
    status: "scheduled",
    notes: "Limpeza e avaliação geral",
  },
  {
    id: "2",
    patientName: "João Santos",
    patientId: "2",
    dentistName: "Dra. Santos",
    dentistId: "2",
    date: "2024-02-20",
    time: "14:30",
    duration: 90,
    type: "Ortodontia",
    status: "confirmed",
  },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({})
  const { toast } = useToast()

  const filteredAppointments = appointments.filter((apt) => apt.date === selectedDate)

  const handleAddAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.dentistId || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    const patient = mockPatients.find((p) => p.id === newAppointment.patientId)
    const dentist = mockProfessionals.find((d) => d.id === newAppointment.dentistId)

    const appointment: Appointment = {
      id: Date.now().toString(),
      patientName: patient?.name || "",
      patientId: newAppointment.patientId,
      dentistName: dentist?.name || "",
      dentistId: newAppointment.dentistId,
      date: newAppointment.date,
      time: newAppointment.time,
      duration: newAppointment.duration || 60,
      type: newAppointment.type || "Consulta",
      status: "scheduled",
      notes: newAppointment.notes,
    }

    setAppointments([...appointments, appointment])
    setNewAppointment({})
    setIsAddDialogOpen(false)

    toast({
      title: "Sucesso",
      description: "Agendamento criado com sucesso",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendado"
      case "confirmed":
        return "Confirmado"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
            <p className="text-gray-600">Gerencie os agendamentos da clínica</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>Agende uma consulta para um paciente</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Paciente *</Label>
                    <Select
                      value={newAppointment.patientId}
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, patientId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dentist">Profissional *</Label>
                    <Select
                      value={newAppointment.dentistId}
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, dentistId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProfessionals.map((prof) => (
                          <SelectItem key={prof.id} value={prof.id}>
                            {prof.name} - {prof.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAppointment.date || ""}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.time || ""}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Consulta</Label>
                    <Select
                      value={newAppointment.type}
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de consulta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consulta">Consulta</SelectItem>
                        <SelectItem value="Limpeza">Limpeza</SelectItem>
                        <SelectItem value="Ortodontia">Ortodontia</SelectItem>
                        <SelectItem value="Endodontia">Endodontia</SelectItem>
                        <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newAppointment.duration || 60}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, duration: Number.parseInt(e.target.value) })
                      }
                      placeholder="60"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={newAppointment.notes || ""}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    placeholder="Observações sobre a consulta"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddAppointment} className="bg-blue-600 hover:bg-blue-700">
                  Agendar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Label htmlFor="date-filter">Data:</Label>
            <Input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3 min-w-[80px]">
                        <div className="text-lg font-bold text-blue-600">{appointment.time}</div>
                        <div className="text-xs text-blue-500">{appointment.duration}min</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{appointment.patientName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Stethoscope className="h-4 w-4 mr-1" />
                            {appointment.dentistName}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {appointment.type}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{appointment.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum agendamento para esta data</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
