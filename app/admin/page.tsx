"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, ShoppingCart, TrendingUp, Package, Plus, Settings, LogOut } from "lucide-react"
import { AdminGuard } from "@/components/admin-guard"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { SalesChart } from "@/components/admin/sales-chart"
import { OrdersTable } from "@/components/admin/orders-table"
import { CustomRequestsTable } from "@/components/admin/custom-requests-table"
import { FurnitureManagement } from "@/components/admin/furniture-management"
import { AddFurnitureModal } from "@/components/admin/add-furniture-modal"

interface FurnitureItem {
  id: string
  name: string
  category: string
  material: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  finish: string
  color: string
  price: number
  stock: number
  status: string
  images: string[]
  description: string
  model3d?: {
    glb?: string
    usdz?: string
  }
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddFurniture, setShowAddFurniture] = useState(false)
  const [furniture, setFurniture] = useState<FurnitureItem[]>([])

  useEffect(() => {
    // Load existing furniture data
    loadFurnitureData()
  }, [])

  const loadFurnitureData = () => {
    // In a real app, this would fetch from your database
    const mockFurniture: FurnitureItem[] = [
      {
        id: "FURN-001",
        name: "Modern Oak Dining Table",
        category: "table",
        material: "oak",
        dimensions: { width: 72, height: 30, depth: 36 },
        finish: "stained",
        color: "brown",
        price: 45000,
        stock: 5,
        status: "Active",
        images: ["/placeholder.svg?height=300&width=400&text=Oak+Table"],
        description: "Beautiful handcrafted oak dining table perfect for family gatherings.",
      },
      {
        id: "FURN-002",
        name: "Teak Wood Bookshelf",
        category: "bookshelf",
        material: "teak",
        dimensions: { width: 36, height: 72, depth: 12 },
        finish: "natural",
        color: "natural",
        price: 32000,
        stock: 8,
        status: "Active",
        images: ["/placeholder.svg?height=300&width=400&text=Teak+Bookshelf"],
        description: "Elegant teak bookshelf with multiple compartments for books and decor.",
      },
    ]
    setFurniture(mockFurniture)
  }

  const handleAddFurniture = (newFurniture: any) => {
    const furnitureWithId = {
      ...newFurniture,
      id: `FURN-${String(furniture.length + 1).padStart(3, "0")}`,
    }
    setFurniture((prev) => [...prev, furnitureWithId])
    setShowAddFurniture(false)
    alert("Furniture added successfully!")
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    window.location.href = "/admin/login"
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Woodora Admin</h1>
                  <p className="text-xs text-slate-600">Furniture Management Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Admin Panel
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Custom Requests
              </TabsTrigger>
              <TabsTrigger value="furniture" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Furniture
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
              <DashboardStats />
              <SalesChart />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
                <Badge variant="secondary">
                  {/* This would be dynamic in a real app */}
                  23 Active Orders
                </Badge>
              </div>
              <OrdersTable />
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Custom Requests</h2>
                <Badge variant="secondary">12 Pending Requests</Badge>
              </div>
              <CustomRequestsTable />
            </TabsContent>

            <TabsContent value="furniture" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Furniture Management</h2>
                <Button
                  onClick={() => setShowAddFurniture(true)}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Furniture
                </Button>
              </div>
              <FurnitureManagement furniture={furniture} onUpdate={setFurniture} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-slate-600">System configuration and admin settings will be available here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Furniture Modal */}
        <AddFurnitureModal
          isOpen={showAddFurniture}
          onClose={() => setShowAddFurniture(false)}
          onAdd={handleAddFurniture}
        />
      </div>
    </AdminGuard>
  )
}

export default AdminPage
