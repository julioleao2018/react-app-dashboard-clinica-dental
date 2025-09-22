export interface BudgetItem {
  id: string
  treatment: string
  value: number
  toothNumber?: string
  toothFaces?: string[]
  observations?: string
}

export interface Budget {
  id: string
  patientId: string
  professional: string
  items: BudgetItem[]
  subtotal: number
  discountType: "percentage" | "fixed"
  discountValue: number
  total: number
  insurance?: string
  date: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface Treatment {
  id: string
  name: string
  category: string
}

export interface Insurance {
  id: string
  name: string
  type: string
}

export interface ToothFace {
  id: string
  name: string
  description: string
}
