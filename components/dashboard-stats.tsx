import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Clock, TrendingUp } from "lucide-react"

const stats = [
  {
    name: "Total de Pacientes",
    value: "1,247",
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    name: "Consultas Hoje",
    value: "23",
    change: "+3",
    changeType: "positive",
    icon: Calendar,
  },
  {
    name: "Tempo Médio",
    value: "45min",
    change: "-5min",
    changeType: "positive",
    icon: Clock,
  },
  {
    name: "Receita Mensal",
    value: "R$ 45.2k",
    change: "+8.2%",
    changeType: "positive",
    icon: TrendingUp,
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
