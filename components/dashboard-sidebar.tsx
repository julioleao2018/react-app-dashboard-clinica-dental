"use client"

import { useState } from "react"
import { Calendar, Users, FileText, BarChart3, Settings, Menu, X, Bluetooth as Tooth, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Pacientes", href: "/patients", icon: Users },
  { name: "Agendamentos", href: "/appointments", icon: Calendar },
  { name: "Tratamentos", href: "#", icon: Tooth },
  { name: "Histórico", href: "#", icon: FileText },
  { name: "Financeiro", href: "#", icon: CreditCard },
  { name: "Relatórios", href: "#", icon: BarChart3 },
]

export function DashboardSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
          <SidebarContent onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border px-6 pb-4">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tooth className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold text-sidebar-foreground">DentalCare</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isCurrent = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isCurrent
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium",
                      )}
                      onClick={onClose}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="/clinic-config"
              className="flex items-center justify-between font-extralight hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2"
            >
              <Settings className="h-5 w-5 shrink-0" />
              Configurações
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
