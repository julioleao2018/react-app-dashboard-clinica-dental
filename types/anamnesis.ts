export interface AnamnesisResponse {
  id: string
  patientId: string
  type?: string
  responses: Record<
    string,
    {
      answer: string
      additionalInfo?: string
    }
  >
  createdAt: string
  updatedAt: string
}
