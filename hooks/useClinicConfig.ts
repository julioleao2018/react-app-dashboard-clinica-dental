import { useState } from "react"

export function useClinicConfig() {
  const [loadingCep, setLoadingCep] = useState(false)

  async function buscarCep(cep: string) {
    try {
      setLoadingCep(true)
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      if (data.erro) throw new Error("CEP não encontrado")
      return {
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err)
      return null
    } finally {
      setLoadingCep(false)
    }
  }

  return { buscarCep, loadingCep }
}
