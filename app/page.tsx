import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { AppointmentsCalendar } from "@/components/appointments-calendar"
import { PatientsList } from "@/components/patients-list"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
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
      </div>
    </DashboardLayout>
  )
}
