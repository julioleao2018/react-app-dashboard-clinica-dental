import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { AppointmentsCalendar } from "@/components/appointments-calendar"
import { PatientsList } from "@/components/patients-list"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="p-4 lg:p-6 space-y-6">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AppointmentsCalendar />
              </div>
              <div className="space-y-6">
                <PatientsList />
                <RecentActivity />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
