import type { AnamnesisResponse } from "@/types/patient"

export const mockAnamnesisResponses: AnamnesisResponse[] = [
  {
    id: "1",
    patientId: "1",
    templateId: "padrao",
    templateName: "Anamnese Padrão",
    responses: {
      queixa_principal: { answer: "Dor no dente do siso" },
      pressao_alta: { answer: "Não" },
      alergia: { answer: "Sim", additionalInfo: "Alérgica a penicilina" },
      diabetes: { answer: "Não" },
      gravida: { answer: "Não" },
    },
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "Dr. João Silva",
  },
  {
    id: "2",
    patientId: "1",
    templateId: "ortodontica",
    templateName: "Anamnese Ortodôntica",
    responses: {
      queixa_principal: { answer: "Dentes desalinhados" },
      pressao_alta: { answer: "Não" },
      alergia: { answer: "Sim", additionalInfo: "Alérgica a penicilina" },
      sobremordida: { answer: "Aumentada" },
      mordida_cruzada: { answer: "Não" },
    },
    createdAt: "2024-01-10T14:20:00Z",
    createdBy: "Dr. Maria Santos",
  },
  {
    id: "3",
    patientId: "2",
    templateId: "cirurgia_implante",
    templateName: "Anamnese de Cirurgia e Implante",
    responses: {
      queixa_principal: { answer: "Necessidade de implante" },
      pressao_alta: { answer: "Sim", additionalInfo: "Controlada com medicação" },
      diabetes: { answer: "Não" },
      habitos_nocivos: { answer: "Não" },
    },
    createdAt: "2024-01-08T09:15:00Z",
    createdBy: "Dr. Carlos Lima",
  },
]

export const mockAnamnesis = mockAnamnesisResponses
