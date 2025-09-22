import type { Budget, Treatment, Insurance, ToothFace } from "@/types/budget"

export const mockTreatments: Treatment[] = [
  { id: "1", name: "Limpeza e Profilaxia", category: "Prevenção" },
  { id: "2", name: "Restauração em Resina", category: "Dentística" },
  { id: "3", name: "Restauração em Amálgama", category: "Dentística" },
  { id: "4", name: "Tratamento de Canal", category: "Endodontia" },
  { id: "5", name: "Extração Simples", category: "Cirurgia" },
  { id: "6", name: "Extração Complexa", category: "Cirurgia" },
  { id: "7", name: "Coroa Protética", category: "Prótese" },
  { id: "8", name: "Prótese Parcial", category: "Prótese" },
  { id: "9", name: "Implante Dentário", category: "Implantodontia" },
  { id: "10", name: "Aparelho Ortodôntico", category: "Ortodontia" },
  { id: "11", name: "Clareamento Dental", category: "Estética" },
  { id: "12", name: "Faceta de Porcelana", category: "Estética" },
]

export const mockInsurances: Insurance[] = [
  { id: "1", name: "Unimed", type: "Plano de Saúde" },
  { id: "2", name: "Bradesco Saúde", type: "Plano de Saúde" },
  { id: "3", name: "SulAmérica", type: "Plano de Saúde" },
  { id: "4", name: "Amil", type: "Plano de Saúde" },
  { id: "5", name: "NotreDame Intermédica", type: "Plano de Saúde" },
  { id: "6", name: "Particular", type: "Sem Convênio" },
]

export const toothFaces: ToothFace[] = [
  { id: "mesial", name: "Mesial", description: "Face voltada para o centro da arcada" },
  { id: "distal", name: "Distal", description: "Face voltada para fora da arcada" },
  { id: "oclusal", name: "Oclusal/Incisal", description: "Face de mastigação ou corte" },
  { id: "vestibular", name: "Vestibular (Buccal)", description: "Face voltada para o lábio/bochecha" },
  { id: "palatal", name: "Palatal/Lingual", description: "Face voltada para o palato/língua" },
  { id: "cervical", name: "Cervical", description: "Face próxima à gengiva" },
]

// Sistema FDI para numeração dentária
export const teethNumbers = {
  adults: {
    "Quadrante 1 (Superior Direito)": ["11", "12", "13", "14", "15", "16", "17", "18"],
    "Quadrante 2 (Superior Esquerdo)": ["21", "22", "23", "24", "25", "26", "27", "28"],
    "Quadrante 3 (Inferior Esquerdo)": ["31", "32", "33", "34", "35", "36", "37", "38"],
    "Quadrante 4 (Inferior Direito)": ["41", "42", "43", "44", "45", "46", "47", "48"],
  },
  deciduous: {
    "Quadrante 5 (Superior Direito - Decíduo)": ["51", "52", "53", "54", "55"],
    "Quadrante 6 (Superior Esquerdo - Decíduo)": ["61", "62", "63", "64", "65"],
    "Quadrante 7 (Inferior Esquerdo - Decíduo)": ["71", "72", "73", "74", "75"],
    "Quadrante 8 (Inferior Direito - Decíduo)": ["81", "82", "83", "84", "85"],
  },
}

export const mockBudgets: Budget[] = [
  {
    id: "1",
    patientId: "1",
    professional: "Dr. João Silva",
    treatment: "Limpeza e Profilaxia",
    value: 150.0,
    toothNumber: undefined,
    toothFaces: undefined,
    insurance: "Unimed",
    observations: "Paciente com gengivite leve",
    date: "2024-01-15",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    patientId: "1",
    professional: "Dra. Maria Santos",
    treatment: "Restauração em Resina",
    value: 280.0,
    toothNumber: "16",
    toothFaces: ["oclusal", "mesial"],
    insurance: "Particular",
    observations: "Cárie profunda, necessário isolamento absoluto",
    date: "2024-01-20",
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    patientId: "2",
    professional: "Dr. Pedro Lima",
    treatment: "Tratamento de Canal",
    value: 850.0,
    toothNumber: "36",
    toothFaces: undefined,
    insurance: "Bradesco Saúde",
    observations: "Necrose pulpar, necessário tratamento em 3 sessões",
    date: "2024-01-25",
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
  },
]
