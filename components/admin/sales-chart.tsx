"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export function SalesChart() {
  // Mock data for the chart
  const salesData = [
    { month: "Jan", sales: 45000 },
    { month: "Feb", sales: 52000 },
    { month: "Mar", sales: 48000 },
    { month: "Apr", sales: 61000 },
    { month: "May", sales: 55000 },
    { month: "Jun", sales: 67000 },
  ]

  const maxSales = Math.max(...salesData.map((d) => d.sales))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Sales Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {salesData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium">{data.month}</div>
              <div className="flex-1">
                <div className="bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full"
                    style={{ width: `${(data.sales / maxSales) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-20 text-sm text-right">₹{data.sales.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
