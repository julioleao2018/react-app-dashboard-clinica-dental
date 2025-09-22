import ClientPage from "./ClientPage"
import { mockPatients } from "@/data/mock-patients"

export async function generateStaticParams() {
  // No ambiente local (dev) não precisamos disso
  if (process.env.NODE_ENV === "development") {
    return []
  }

  // Em produção/export, gera as páginas estáticas com base nos mocks
  return mockPatients.map((p) => ({ id: String(p.id) }))
}

// Quando for export, evita fallback dinâmico
export const dynamicParams = process.env.NODE_ENV === "development"

export default function Page({ params }: { params: { id: string } }) {
  return <ClientPage initialId={params.id} />
}