export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  address: string
  notes: string
  lastVisit: string
  nextAppointment?: string
  status: "active" | "inactive"
  avatar?: string
  cpf?: string
  rg?: string
  profession?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

export interface AnamnesisQuestion {
  id: string
  question: string
  type: "yes_no_unknown" | "text" | "textarea"
  required?: boolean
  additionalInfo?: boolean
}

export interface AnamnesisTemplate {
  id: string
  name: string
  description: string
  questions: AnamnesisQuestion[]
}

export interface AnamnesisResponse {
  id: string
  patientId: string
  templateId: string
  templateName: string
  responses: Record<
    string,
    {
      answer: string
      additionalInfo?: string
    }
  >
  createdAt: string
  createdBy: string
}
