"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="text-xl font-bold text-slate-900">Woodora</span>
        </div>
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
        <p className="text-slate-600">Loading your furniture experience...</p>
      </div>
    </div>
  )
}
