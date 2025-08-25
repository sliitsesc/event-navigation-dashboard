"use client"

import { useAuth } from "@/contexts/auth-context"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return fallback || null
  }

  return <>{children}</>
}
