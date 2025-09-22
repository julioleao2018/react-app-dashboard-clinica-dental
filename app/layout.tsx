import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { InitApiClient } from "@/components/init-api-client"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Dental Dashboard",
  description: "Sistema de gestão odontológica",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${inter.variable}`}>
        <Suspense fallback={null}>
          <InitApiClient />
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
