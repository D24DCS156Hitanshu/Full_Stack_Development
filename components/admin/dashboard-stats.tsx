"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Package, IndianRupee } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹12,45,000",
      change: "+12.5%",
      icon: IndianRupee,
      color: "text-green-600",
    },
    {
      title: "Active Orders",
      value: "23",
      change: "+3",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: "1,234",
      change: "+8.2%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Growth Rate",
      value: "18.5%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
