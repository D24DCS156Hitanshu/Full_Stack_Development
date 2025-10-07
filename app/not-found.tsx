"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl font-bold text-slate-300">404</div>
          <CardTitle className="text-xl font-semibold text-slate-900">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-slate-600">The page you're looking for doesn't exist or has been moved.</p>

          <div className="space-y-2">
            <Button asChild className="w-full" variant="default">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go home
              </Link>
            </Button>

            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/listings">
                <Search className="mr-2 h-4 w-4" />
                Browse furniture
              </Link>
            </Button>

            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/customize">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Create custom furniture
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
