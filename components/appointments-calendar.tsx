import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus } from "lucide-react"

const appointments = [
  {
    id: 1,
    patient: "Maria Silva",
    time: "09:00",
    type: "Limpeza",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "João Santos",
    time: "10:30",
    type: "Consulta",
    status: "pending",
  },
  {
    id: 3,
    patient: "Ana Costa",
    time: "14:00",
    type: "Tratamento",
    status: "confirmed",
  },
  {
    id: 4,
    patient: "Pedro Lima",
    time: "15:30",
    type: "Emergência",
    status: "urgent",
  },
  {
    id: 5,
    patient: "Carla Oliveira",
    time: "16:00",
    type: "Retorno",
    status: "confirmed",
  },
]

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  urgent: "bg-red-100 text-red-800",
}

export function AppointmentsCalendar() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Agendamentos de Hoje</span>
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.time}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{appointment.patient}</p>
                  <p className="text-sm text-muted-foreground">{appointment.type}</p>
                </div>
              </div>
              <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                {appointment.status === "confirmed" && "Confirmado"}
                {appointment.status === "pending" && "Pendente"}
                {appointment.status === "urgent" && "Urgente"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
