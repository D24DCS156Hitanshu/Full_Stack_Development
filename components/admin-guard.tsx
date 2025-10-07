"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem("admin-token")
      const adminUser = localStorage.getItem("admin-user")

      if (adminToken === "admin-authenticated" && adminUser) {
        try {
          const user = JSON.parse(adminUser)
          // Check if login is not too old (24 hours)
          const loginTime = new Date(user.loginTime)
          const now = new Date()
          const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

          if (hoursDiff < 24) {
            setIsAuthenticated(true)
          } else {
            // Token expired
            localStorage.removeItem("admin-token")
            localStorage.removeItem("admin-user")
            router.push("/admin/login")
          }
        } catch {
          // Invalid user data
          localStorage.removeItem("admin-token")
          localStorage.removeItem("admin-user")
          router.push("/admin/login")
        }
      } else {
        router.push("/admin/login")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-slate-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
