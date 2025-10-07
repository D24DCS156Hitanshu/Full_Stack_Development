"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Search, Filter, Eye, ShoppingCart, Smartphone, Headphones, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { ARViewer } from "@/components/ar-viewer"
import { VRViewer } from "@/components/vr-viewer"
import { addToCart } from "@/lib/cart"

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

const parseDimensions = (dimensions: any): { width: number; height: number; depth: number } => {
  if (dimensions && typeof dimensions === "object" && "width" in dimensions) {
    return {
      width: Number(dimensions.width) || 0,
      height: Number(dimensions.height) || 0,
      depth: Number(dimensions.depth) || 0,
    }
  }

  if (typeof dimensions === "string") {
    try {
      const parsed = JSON.parse(dimensions)
      return {
        width: Number(parsed.width) || 0,
        height: Number(parsed.height) || 0,
        depth: Number(parsed.depth) || 0,
      }
    } catch {
      console.error("[v0] Failed to parse dimensions:", dimensions)
    }
  }

  return { width: 0, height: 0, depth: 0 }
}

const parseModel3d = (model3d: any): { glb?: string; usdz?: string } | undefined => {
  if (model3d && typeof model3d === "object") {
    return model3d
  }

  if (typeof model3d === "string") {
    try {
      return JSON.parse(model3d)
    } catch {
      console.error("[v0] Failed to parse model3d:", model3d)
    }
  }

  return undefined
}

export default function ListingsPage() {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([])
  const [filteredFurniture, setFilteredFurniture] = useState<FurnitureItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [materialFilter, setMaterialFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"ar" | "vr">("ar")
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  useEffect(() => {
    fetchFurniture()

    const handleFurnitureUpdate = (event: CustomEvent) => {
      console.log("=== CLIENT: Received furniture update ===", event.detail)
      fetchFurniture() // Refresh the furniture list
    }

    window.addEventListener("furniture-updated", handleFurnitureUpdate as EventListener)

    return () => {
      window.removeEventListener("furniture-updated", handleFurnitureUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    filterFurniture()
  }, [furniture, searchTerm, categoryFilter, materialFilter])

  const fetchFurniture = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("=== CLIENT: Fetching furniture from API ===")
      const response = await fetch("/api/furniture", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      console.log("Client API Response status:", response.status)
      console.log("Client API Response ok:", response.ok)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Client API Error:", response.status, errorData)
        throw new Error(errorData.details || `HTTP ${response.status}: Failed to fetch furniture`)
      }

      const data = await response.json()
      console.log("Client fetched furniture data:", data)
      console.log("Client furniture count:", data?.length || 0)

      if (Array.isArray(data)) {
        const parsedData = data.map((item: any) => ({
          ...item,
          dimensions: parseDimensions(item.dimensions),
          model3d: parseModel3d(item.model3d),
        }))

        console.log("Client parsed furniture data:", parsedData)
        setFurniture(parsedData)
        console.log(`Client successfully loaded ${parsedData.length} furniture items`)

        if (parsedData.length > 0) {
          console.log("✅ Furniture loaded successfully on client side")
        }
      } else {
        console.error("Client received invalid data format:", data)
        throw new Error("Invalid data format received from server")
      }
    } catch (err) {
      console.error("Client error fetching furniture:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to load furniture: ${errorMessage}`)
      setFurniture([])
    } finally {
      setLoading(false)
    }
  }

  const filterFurniture = () => {
    let filtered = furniture.filter((item) => item.status === "Active")

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.material.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    if (materialFilter !== "all") {
      filtered = filtered.filter((item) => item.material === materialFilter)
    }

    setFilteredFurniture(filtered)
  }

  const handleAddToCart = async (item: FurnitureItem) => {
    setAddingToCart(item.id)

    try {
      const cartItem = {
        category: item.category,
        material: item.material,
        dimensions: item.dimensions,
        finish: item.finish,
        color: item.color,
        quantity: 1,
        priceBreakdown: {
          baseCost: item.price * 0.6,
          materialCost: item.price * 0.2,
          laborCost: item.price * 0.15,
          finishCost: item.price * 0.05,
          total: item.price,
        },
        unitPrice: item.price,
        totalPrice: item.price,
      }

      addToCart(cartItem)
      window.dispatchEvent(new Event("cart-updated"))
      alert("Item added to cart successfully!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Error adding item to cart. Please try again.")
    } finally {
      setAddingToCart(null)
    }
  }

  const categories = ["all", ...new Set(furniture.map((item) => item.category))]
  const materials = ["all", ...new Set(furniture.map((item) => item.material))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading furniture...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Woodora</span>
            </div>
            <Button asChild>
              <Link href="/customize">Create Custom</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Ready-Made Furniture</h1>
          <p className="text-xl text-slate-600">
            Browse our collection of handcrafted wooden furniture with AR/VR preview
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search furniture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={materialFilter} onValueChange={setMaterialFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All materials" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material} value={material} className="capitalize">
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-red-800 mb-1">Error Loading Furniture</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <details className="mt-2">
                  <summary className="text-xs text-red-500 cursor-pointer hover:text-red-700">
                    Troubleshooting Info
                  </summary>
                  <div className="mt-1 text-xs text-red-500 space-y-1">
                    <p>• Check if furniture has been added via admin panel</p>
                    <p>• Verify database connection is working</p>
                    <p>• Ensure furniture status is set to "Active"</p>
                  </div>
                </details>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent flex-shrink-0"
                onClick={fetchFurniture}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {filteredFurniture.length === 0 && !loading && !error ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No furniture found</h3>
            <p className="text-slate-600 mb-4">
              {furniture.length === 0
                ? "No furniture has been added yet. Contact admin to add furniture items."
                : "No furniture matches your current filters."}
            </p>
            {furniture.length > 0 && (
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setMaterialFilter("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFurniture.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video bg-slate-100 relative">
                  <img
                    src={item.images?.[0] || "/placeholder.svg?height=300&width=400&text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">Stock: {item.stock}</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-slate-600 capitalize">
                        {item.material} Wood • {item.finish}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.dimensions.width}" × {item.dimensions.height}" × {item.dimensions.depth}"
                      </p>
                    </div>

                    <p className="text-sm text-slate-600">{item.description}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600">₹{item.price.toLocaleString()}</span>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.color}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {item.finish}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh]">
                          <DialogHeader>
                            <DialogTitle>{selectedItem?.name}</DialogTitle>
                          </DialogHeader>
                          {selectedItem && (
                            <div className="space-y-4">
                              <div className="flex gap-2 justify-center">
                                <Button
                                  variant={viewMode === "ar" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setViewMode("ar")}
                                >
                                  <Smartphone className="h-4 w-4 mr-1" />
                                  AR View
                                </Button>
                                <Button
                                  variant={viewMode === "vr" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setViewMode("vr")}
                                >
                                  <Headphones className="h-4 w-4 mr-1" />
                                  VR View
                                </Button>
                              </div>
                              <div className="aspect-video rounded-lg overflow-hidden">
                                {viewMode === "ar" && (
                                  <ARViewer
                                    furniture={{
                                      id: selectedItem.id,
                                      category: selectedItem.category,
                                      material: selectedItem.material,
                                      dimensions: selectedItem.dimensions,
                                      finish: selectedItem.finish,
                                      color: selectedItem.color,
                                      total_price: selectedItem.price,
                                      model3d: selectedItem.model3d,
                                    }}
                                  />
                                )}
                                {viewMode === "vr" && (
                                  <VRViewer
                                    furniture={{
                                      id: selectedItem.id,
                                      category: selectedItem.category,
                                      material: selectedItem.material,
                                      dimensions: selectedItem.dimensions,
                                      finish: selectedItem.finish,
                                      color: selectedItem.color,
                                      total_price: selectedItem.price,
                                      model3d: selectedItem.model3d,
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
                        disabled={addingToCart === item.id}
                      >
                        {addingToCart === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <ShoppingCart className="h-4 w-4 mr-1" />
                        )}
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
