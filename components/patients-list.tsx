import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Phone } from "lucide-react"

const recentPatients = [
  {
    id: 1,
    name: "Maria Silva",
    phone: "(11) 99999-9999",
    lastVisit: "2 dias atrás",
    avatar: "/diverse-woman-portrait.png",
    initials: "MS",
  },
  {
    id: 2,
    name: "João Santos",
    phone: "(11) 88888-8888",
    lastVisit: "1 semana atrás",
    avatar: "/thoughtful-man.png",
    initials: "JS",
  },
  {
    id: 3,
    name: "Ana Costa",
    phone: "(11) 77777-7777",
    lastVisit: "3 dias atrás",
    avatar: "/diverse-woman-portrait.png",
    initials: "AC",
  },
  {
    id: 4,
    name: "Pedro Lima",
    phone: "(11) 66666-6666",
    lastVisit: "Hoje",
    avatar: "/thoughtful-man.png",
    initials: "PL",
  },
]

export function PatientsList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Pacientes Recentes</span>
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Novo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                  <AvatarFallback>{patient.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{patient.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {patient.phone}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{patient.lastVisit}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
