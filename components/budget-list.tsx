"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BudgetForm } from "./budget-form"
import { Plus, Edit, Trash2, ArrowLeft } from "./icons"
import type { Budget } from "@/types/budget"

interface BudgetListProps {
  budgets: Budget[]
  patientId: string
  patientName: string
  onUpdate: () => void
}

export function BudgetList({ budgets, patientId, patientName, onUpdate }: BudgetListProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget)
    setShowForm(true)
  }

  const handleNewBudget = () => {
    setSelectedBudget(null)
    setShowForm(true)
  }

  const handleSaveBudget = (budgetData: Budget) => {
    console.log("[v0] Salvando orçamento:", budgetData)
    setShowForm(false)
    setSelectedBudget(null)
    onUpdate()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Aprovado", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejeitado", className: "bg-red-100 text-red-800" },
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending

    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowForm(false)
              setSelectedBudget(null)
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">{selectedBudget ? "Editar Orçamento" : "Novo Orçamento"}</h2>
        </div>
        <BudgetForm
          patientId={patientId}
          patientName={patientName}
          budget={selectedBudget}
          onSave={handleSaveBudget}
          onCancel={() => {
            setShowForm(false)
            setSelectedBudget(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orçamentos</h2>
          <p className="text-gray-600">Gerencie os orçamentos do paciente</p>
        </div>
        <Button onClick={handleNewBudget} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum orçamento registrado</h3>
            <p className="text-gray-600 mb-4">Adicione o primeiro orçamento para este paciente</p>
            <Button onClick={handleNewBudget} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Orçamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Tratamento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Dente</TableHead>
                  <TableHead>Face</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.professional}</TableCell>
                    <TableCell>{budget.treatment}</TableCell>
                    <TableCell className="font-semibold text-green-600">{formatCurrency(budget.value)}</TableCell>
                    <TableCell>
                      {budget.toothNumber ? (
                        <Badge variant="outline">{budget.toothNumber}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {budget.toothFaces && budget.toothFaces.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {budget.toothFaces.map((face, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {face}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {budget.insurance ? (
                        <Badge variant="outline">{budget.insurance}</Badge>
                      ) : (
                        <span className="text-gray-400">Particular</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(budget.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{getStatusBadge(budget.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
