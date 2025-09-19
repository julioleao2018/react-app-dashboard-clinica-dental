import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, Clock, AlertCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "appointment",
    message: "Consulta com Maria Silva finalizada",
    time: "10 min atrás",
    status: "completed",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "payment",
    message: "Pagamento de R$ 350 recebido",
    time: "25 min atrás",
    status: "success",
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "appointment",
    message: "Novo agendamento para amanhã",
    time: "1 hora atrás",
    status: "pending",
    icon: Clock,
  },
  {
    id: 4,
    type: "alert",
    message: "Estoque de anestésico baixo",
    time: "2 horas atrás",
    status: "warning",
    icon: AlertCircle,
  },
]

const statusColors = {
  completed: "text-green-600",
  success: "text-green-600",
  pending: "text-yellow-600",
  warning: "text-red-600",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Atividade Recente</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
              <activity.icon
                className={`h-5 w-5 mt-0.5 ${statusColors[activity.status as keyof typeof statusColors]}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
