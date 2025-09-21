"use client"
import { useEffect } from "react"
import { apiClient } from "@/lib/api"

export function InitApiClient() {
  useEffect(() => {
    apiClient.init()
  }, [])

  return null
}