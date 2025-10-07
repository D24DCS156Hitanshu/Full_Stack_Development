"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Edit, Trash2, Plus, Smartphone, Headphones } from "lucide-react"
import { AddFurnitureModal } from "./add-furniture-modal"
import { ARViewer } from "@/components/ar-viewer"
import { VRViewer } from "@/components/vr-viewer"

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
  // If it's already an object with the right structure, return it
  if (dimensions && typeof dimensions === "object" && "width" in dimensions) {
    return {
      width: Number(dimensions.width) || 0,
      height: Number(dimensions.height) || 0,
      depth: Number(dimensions.depth) || 0,
    }
  }

  // If it's a string, try to parse it as JSON
  if (typeof dimensions === "string") {
    try {
      const parsed = JSON.parse(dimensions)
      return {
        width: Number(parsed.width) || 0,
        height: Number(parsed.height) || 0,
        depth: Number(parsed.depth) || 0,
      }
    } catch {
      console.error("[v0] Failed to parse dimensions string:", dimensions)
    }
  }

  // Fallback to default dimensions
  return { width: 0, height: 0, depth: 0 }
}

const parseModel3d = (model3d: any): { glb?: string; usdz?: string } | undefined => {
  // If it's already an object, return it
  if (model3d && typeof model3d === "object") {
    return model3d
  }

  // If it's a string, try to parse it as JSON
  if (typeof model3d === "string") {
    try {
      return JSON.parse(model3d)
    } catch {
      console.error("[v0] Failed to parse model3d string:", model3d)
    }
  }

  return undefined
}

export function FurnitureManagement() {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null)
  const [previewMode, setPreviewMode] = useState<"ar" | "vr">("ar")

  const fetchFurniture = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/furniture")
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Fetched furniture data:", data)

        const parsedData = data.map((item: any) => ({
          ...item,
          dimensions: parseDimensions(item.dimensions),
          model3d: parseModel3d(item.model3d),
        }))

        console.log("[v0] Parsed furniture data:", parsedData)
        setFurniture(parsedData)
      } else {
        console.error("Failed to fetch furniture")
      }
    } catch (error) {
      console.error("Error fetching furniture:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFurniture()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/furniture/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFurniture(furniture.filter((item) => item.id !== id))
      } else {
        console.error("Failed to delete furniture")
      }
    } catch (error) {
      console.error("Error deleting furniture:", error)
    }
  }

  const handleAddFurniture = async (newFurniture: any) => {
    try {
      console.log("=== ADMIN: Adding new furniture ===")
      console.log("New furniture data:", newFurniture)

      const furniturePayload = {
        ...newFurniture,
        status: "Active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("Sending payload to API:", furniturePayload)

      const response = await fetch("/api/furniture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(furniturePayload),
      })

      console.log("API Response status:", response.status)
      console.log("API Response ok:", response.ok)

      if (response.ok) {
        const savedFurniture = await response.json()
        console.log("Successfully saved furniture:", savedFurniture)

        const parsedFurniture = {
          ...savedFurniture,
          dimensions: parseDimensions(savedFurniture.dimensions),
          model3d: parseModel3d(savedFurniture.model3d),
        }

        setFurniture([...furniture, parsedFurniture])
        setShowAddModal(false)

        window.dispatchEvent(
          new CustomEvent("furniture-updated", {
            detail: { action: "added", furniture: parsedFurniture },
          }),
        )

        alert("Furniture added successfully!")
      } else {
        const errorData = await response.json()
        console.error("Failed to add furniture:", errorData)
        alert(`Failed to add furniture: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error("Error adding furniture:", error)
      alert(`Error adding furniture: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const formatDimensions = (width: number, height: number, depth: number) => {
    const inchesToFeetAndInches = (inches: number) => {
      if (!inches || isNaN(inches)) return '0"'

      const feet = Math.floor(inches / 12)
      const remainingInches = inches % 12
      if (feet === 0) return `${remainingInches}"`
      if (remainingInches === 0) return `${feet}'`
      return `${feet}' ${remainingInches}"`
    }
    return `${inchesToFeetAndInches(width)} × ${inchesToFeetAndInches(height)} × ${inchesToFeetAndInches(depth)}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading furniture...</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Furniture
        </Button>
      </div>

      {furniture.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No furniture items found</p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Furniture
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {furniture.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video bg-slate-100 relative">
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : "/placeholder.svg?height=300&width=400&text=No+Image"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    item.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-slate-600 capitalize">
                    {item.material} Wood • {item.finish} Finish
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDimensions(item.dimensions.width, item.dimensions.height, item.dimensions.depth)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹{item.price.toLocaleString()}</span>
                    <Badge variant="secondary">Stock: {item.stock}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("[v0] Opening preview for:", item)
                          console.log("[v0] Item model3d:", item.model3d)
                          console.log("[v0] Item dimensions:", item.dimensions)
                          setSelectedFurniture(item)
                          setPreviewMode("ar")
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[95vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Customer Preview - {selectedFurniture?.name}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedFurniture && (
                        <div className="space-y-4">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant={previewMode === "ar" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPreviewMode("ar")}
                            >
                              <Smartphone className="h-4 w-4 mr-1" />
                              AR View
                            </Button>
                            <Button
                              variant={previewMode === "vr" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPreviewMode("vr")}
                            >
                              <Headphones className="h-4 w-4 mr-1" />
                              VR View
                            </Button>
                          </div>
                          <div className="aspect-video rounded-lg overflow-hidden">
                            {previewMode === "ar" && (
                              <ARViewer
                                furniture={{
                                  id: selectedFurniture.id,
                                  category: selectedFurniture.category,
                                  material: selectedFurniture.material,
                                  dimensions: selectedFurniture.dimensions,
                                  finish: selectedFurniture.finish,
                                  color: selectedFurniture.color,
                                  total_price: selectedFurniture.price,
                                  model3d: selectedFurniture.model3d,
                                }}
                              />
                            )}
                            {previewMode === "vr" && (
                              <VRViewer
                                furniture={{
                                  id: selectedFurniture.id,
                                  category: selectedFurniture.category,
                                  material: selectedFurniture.material,
                                  dimensions: selectedFurniture.dimensions,
                                  finish: selectedFurniture.finish,
                                  color: selectedFurniture.color,
                                  total_price: selectedFurniture.price,
                                  model3d: selectedFurniture.model3d,
                                }}
                              />
                            )}
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">How customers will see this:</h4>
                            <p className="text-sm text-slate-600 mb-3">{selectedFurniture.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Material:</strong> {selectedFurniture.material}
                              </div>
                              <div>
                                <strong>Finish:</strong> {selectedFurniture.finish}
                              </div>
                              <div>
                                <strong>Color:</strong> {selectedFurniture.color}
                              </div>
                              <div>
                                <strong>Price:</strong> ₹{selectedFurniture.price.toLocaleString()}
                              </div>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {selectedFurniture.finish}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {selectedFurniture.color}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddFurnitureModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddFurniture} />
    </>
  )
}
