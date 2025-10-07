"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageCircle, CheckCircle, XCircle } from "lucide-react"

export function CustomRequestsTable() {
  const [requests] = useState([
    {
      id: "REQ-001",
      customer: "Alice Brown",
      furniture: "Custom L-shaped Sofa",
      dimensions: '120" x 80" x 36"',
      material: "Oak Wood",
      status: "Pending Review",
      date: "2024-01-15",
      budget: "₹75,000 - ₹90,000",
    },
    {
      id: "REQ-002",
      customer: "Bob Davis",
      furniture: "Executive Desk",
      dimensions: '72" x 36" x 30"',
      material: "Mahogany",
      status: "Quote Sent",
      date: "2024-01-14",
      budget: "₹55,000 - ₹65,000",
    },
    {
      id: "REQ-003",
      customer: "Carol White",
      furniture: "Built-in Wardrobe",
      dimensions: '96" x 24" x 84"',
      material: "Teak Wood",
      status: "In Discussion",
      date: "2024-01-13",
      budget: "₹1,20,000 - ₹1,50,000",
    },
    {
      id: "REQ-004",
      customer: "David Green",
      furniture: "Kitchen Island",
      dimensions: '84" x 42" x 36"',
      material: "Maple Wood",
      status: "Approved",
      date: "2024-01-12",
      budget: "₹85,000 - ₹95,000",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800"
      case "Quote Sent":
        return "bg-blue-100 text-blue-800"
      case "In Discussion":
        return "bg-purple-100 text-purple-800"
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Furniture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{request.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{request.furniture}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{request.dimensions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{request.material}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{request.budget}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-green-600 bg-transparent">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
