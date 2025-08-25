"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { ProtectedRoute } from "@/components/protected-route"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard/zones")
    }
  }, [user, router])

  return (
    <ProtectedRoute fallback={<LoginForm />}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting to Dashboard...</h1>
        </div>
      </div>
    </ProtectedRoute>
  )
}
