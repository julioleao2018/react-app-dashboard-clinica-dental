import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  sub: string
  clinica_id?: string
  perfil?: string
  exp: number
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value

  // Se já estiver logado → não deixa ir para login/register
  if (token && ["/login", "/register"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Se não estiver logado → não deixa acessar dashboard nem clinic-setup
  if (!token && (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/clinic-setup"))) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Se estiver logado mas sem clinica_id → força ir para /clinic-setup
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token)

      if (!decoded.clinica_id && !req.nextUrl.pathname.startsWith("/clinic-setup")) {
        return NextResponse.redirect(new URL("/clinic-setup", req.url))
      }

      if (decoded.clinica_id && req.nextUrl.pathname.startsWith("/clinic-setup")) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    } catch (e) {
      console.error("Erro ao decodificar token no middleware:", e)
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/clinic-setup/:path*"],
}