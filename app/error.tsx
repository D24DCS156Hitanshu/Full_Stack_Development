"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)

    // Try to handle Service Worker errors gracefully
    if (error.message?.includes("ServiceWorker") || error.message?.includes("Service Worker")) {
      console.warn("Service Worker error detected, continuing without SW features")
      // Don't throw for SW errors, just log them
      return
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-slate-900">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-slate-600">
            We encountered an unexpected error. This might be due to browser restrictions or network issues.
          </p>

          <div className="space-y-2">
            <Button onClick={reset} className="w-full" variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>

            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go home
              </Link>
            </Button>
          </div>

          <div className="text-xs text-slate-500 text-center">
            <p>If the problem persists, try:</p>
            <ul className="mt-2 space-y-1">
              <li>• Refreshing the page</li>
              <li>• Clearing browser cache</li>
              <li>• Trying a different browser</li>
              <li>• Enabling JavaScript and cookies</li>
              <li>• Disabling ad blockers temporarily</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
