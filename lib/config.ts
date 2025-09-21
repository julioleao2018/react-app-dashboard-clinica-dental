let appConfig: any = null

export async function loadConfig() {
  if (!appConfig) {
    const res = await fetch("/config.json")
    if (!res.ok) {
      throw new Error("Falha ao carregar config.json")
    }
    appConfig = await res.json()
  }
  return appConfig
}