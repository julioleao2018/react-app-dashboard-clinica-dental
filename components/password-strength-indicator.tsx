import { validatePasswordStrength } from "@/lib/password-validation"
import { Check, X } from "lucide-react"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = validatePasswordStrength(password)

  if (!password) return null

  return (
    <div className="space-y-3">
      {/* Barra de força da senha */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Força da senha:</span>
          <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              strength.score < 3 ? "bg-red-500" : strength.score < 5 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Requisitos:</p>
        <div className="space-y-1">
          <RequirementItem met={strength.requirements.length} text="Pelo menos 8 caracteres" />
          <RequirementItem met={strength.requirements.uppercase} text="Uma letra maiúscula" />
          <RequirementItem met={strength.requirements.lowercase} text="Uma letra minúscula" />
          <RequirementItem met={strength.requirements.number} text="Um número" />
          <RequirementItem met={strength.requirements.special} text="Um caractere especial (!@#$%^&*)" />
        </div>
      </div>
    </div>
  )
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
      <span className={met ? "text-green-700" : "text-gray-600"}>{text}</span>
    </div>
  )
}
