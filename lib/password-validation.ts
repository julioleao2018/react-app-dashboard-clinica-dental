export interface PasswordStrength {
  score: number
  label: "Fraca" | "Moderada" | "Forte"
  color: string
  requirements: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
    special: boolean
  }
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const score = Object.values(requirements).filter(Boolean).length

  let label: "Fraca" | "Moderada" | "Forte"
  let color: string

  if (score < 3) {
    label = "Fraca"
    color = "text-red-500"
  } else if (score < 5) {
    label = "Moderada"
    color = "text-yellow-500"
  } else {
    label = "Forte"
    color = "text-green-500"
  }

  return {
    score,
    label,
    color,
    requirements,
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
