import { z } from "zod"

export const clinicConfigSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  documento: z.string().regex(/^\d{11}$|^\d{14}$/, "Informe um CPF ou CNPJ válido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cep: z.string().regex(/^\d{8}$/, "CEP inválido"),
  logradouro: z.string().min(1, "Endereço obrigatório"),
  numero: z.string().min(1, "Número obrigatório"),
  bairro: z.string().min(1, "Bairro obrigatório"),
  cidade: z.string().min(1, "Cidade obrigatória"),
  estado: z.string().min(2, "Estado obrigatório"),
})

export type ClinicConfigFormData = z.infer<typeof clinicConfigSchema>