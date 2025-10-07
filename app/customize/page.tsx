"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Share2, ShoppingCart, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import FurniturePreview from "@/components/FurniturePreview"
import { CartSidebar } from "@/components/cart-sidebar"
import { CheckoutModal } from "@/components/checkout-modal"
import { addToCart, type CartItem } from "@/lib/cart"
// Add these imports at the top
import { ARViewer } from "@/components/ar-viewer"
import { VRViewer } from "@/components/vr-viewer"
import { Smartphone, Headphones } from "lucide-react"

interface FurnitureSpec {
  category: string
  material: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  finish: string
  color: string
  quantity: number
}

interface PriceBreakdown {
  baseCost: number
  materialCost: number
  laborCost: number
  finishCost: number
  total: number
}

export default function CustomizePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [specs, setSpecs] = useState<FurnitureSpec>({
    category: "",
    material: "",
    dimensions: { width: 72, height: 36, depth: 30 }, // Default dimensions in inches
    finish: "",
    color: "",
    quantity: 1,
  })
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    baseCost: 0,
    materialCost: 0,
    laborCost: 0,
    finishCost: 0,
    total: 0,
  })
  // Add this state after the existing useState declarations
  const [viewMode, setViewMode] = useState<"3d" | "ar" | "vr">("3d")

  const furnitureCategories = [
    { value: "sofa", label: "Sofa", basePrice: 65000 },
    { value: "chair", label: "Chair", basePrice: 25000 },
    { value: "table", label: "Table", basePrice: 40000 },
    { value: "bed", label: "Bed", basePrice: 95000 },
    { value: "dresser", label: "Dresser", basePrice: 48000 },
    { value: "bookshelf", label: "Bookshelf", basePrice: 32000 },
  ]

  const materials = [
    { value: "oak", label: "Oak Wood", multiplier: 1.2 },
    { value: "pine", label: "Pine Wood", multiplier: 0.8 },
    { value: "mahogany", label: "Mahogany", multiplier: 1.8 },
    { value: "teak", label: "Teak Wood", multiplier: 2.2 },
    { value: "walnut", label: "Walnut Wood", multiplier: 1.9 },
    { value: "maple", label: "Maple Wood", multiplier: 1.4 },
  ]

  const finishes = [
    { value: "natural", label: "Natural", cost: 0 },
    { value: "stained", label: "Stained", cost: 4000 },
    { value: "painted", label: "Painted", cost: 6000 },
    { value: "lacquered", label: "Lacquered", cost: 8000 },
  ]

  const colors = [
    { value: "natural", label: "Natural Wood" },
    { value: "brown", label: "Rich Brown" },
    { value: "black", label: "Ebony Black" },
    { value: "white", label: "Antique White" },
    { value: "gray", label: "Weathered Gray" },
    { value: "cherry", label: "Cherry Red" },
  ]

  // Helper functions for dimension conversion and display
  const inchesToFeetAndInches = (inches: number) => {
    const feet = Math.floor(inches / 12)
    const remainingInches = inches % 12
    if (feet === 0) return `${remainingInches}"`
    if (remainingInches === 0) return `${feet}'`
    return `${feet}' ${remainingInches}"`
  }

  const formatDimensions = (width: number, height: number, depth: number) => {
    return `${inchesToFeetAndInches(width)} × ${inchesToFeetAndInches(height)} × ${inchesToFeetAndInches(depth)}`
  }

  useEffect(() => {
    if (specs.category && specs.material) {
      calculatePrice()
    }
  }, [specs])

  const calculatePrice = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const category = furnitureCategories.find((c) => c.value === specs.category)
      const material = materials.find((m) => m.value === specs.material)
      const finish = finishes.find((f) => f.value === specs.finish)

      if (!category || !material || !finish) {
        setIsLoading(false)
        return
      }

      const baseCost = category.basePrice
      // Convert inches to a volume multiplier (cubic inches / 1000 for scaling)
      const dimensionMultiplier = (specs.dimensions.width * specs.dimensions.height * specs.dimensions.depth) / 10000
      const materialCost = baseCost * material.multiplier * dimensionMultiplier * 0.01 // Scale down for reasonable pricing
      const laborCost = baseCost * 0.4
      const finishCost = finish.cost
      const subtotal = baseCost + materialCost + laborCost + finishCost
      const total = subtotal * specs.quantity

      setPriceBreakdown({
        baseCost,
        materialCost,
        laborCost,
        finishCost,
        total,
      })

      setIsLoading(false)
    }, 500)
  }

  const saveEstimate = async () => {
    setIsSaving(true)

    try {
      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Estimate saved successfully!")
    } catch (error) {
      console.error("Error saving estimate:", error)
      alert("Error saving estimate. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddToCart = async () => {
    if (!specs.category || !specs.material || !specs.finish || !specs.color) {
      alert("Please complete all furniture specifications before adding to cart.")
      return
    }

    setIsAddingToCart(true)

    try {
      // Simulate adding to cart delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const cartItem: Omit<CartItem, "id" | "addedAt"> = {
        category: specs.category,
        material: specs.material,
        dimensions: specs.dimensions,
        finish: specs.finish,
        color: specs.color,
        quantity: specs.quantity,
        priceBreakdown,
        unitPrice: priceBreakdown.total / specs.quantity,
        totalPrice: priceBreakdown.total,
      }

      addToCart(cartItem)
      window.dispatchEvent(new Event("cart-updated"))

      // Show success message
      alert("Item added to cart successfully!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Error adding item to cart. Please try again.")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!specs.category || !specs.material || !specs.finish || !specs.color) {
      alert("Please complete all furniture specifications before proceeding.")
      return
    }

    // Add current item to cart first
    const cartItem: Omit<CartItem, "id" | "addedAt"> = {
      category: specs.category,
      material: specs.material,
      dimensions: specs.dimensions,
      finish: specs.finish,
      color: specs.color,
      quantity: specs.quantity,
      priceBreakdown,
      unitPrice: priceBreakdown.total / specs.quantity,
      totalPrice: priceBreakdown.total,
    }

    addToCart(cartItem)
    window.dispatchEvent(new Event("cart-updated"))

    // Then open checkout
    setShowCheckout(true)
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
            <div className="flex items-center space-x-2">
              <CartSidebar onCheckout={() => setShowCheckout(true)} />
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" onClick={saveEstimate} disabled={isSaving || !specs.category}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customization Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  Wooden Furniture Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Furniture Category</Label>
                  <Select value={specs.category} onValueChange={(value) => setSpecs({ ...specs, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select furniture type" />
                    </SelectTrigger>
                    <SelectContent>
                      {furnitureCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Material Selection */}
                <div className="space-y-2">
                  <Label htmlFor="material">Wood Type</Label>
                  <Select value={specs.material} onValueChange={(value) => setSpecs({ ...specs, material: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem key={material.value} value={material.value}>
                          {material.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dimensions */}
                <div className="space-y-4">
                  <Label>Dimensions</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width" className="text-sm text-slate-600">
                        Width
                      </Label>
                      <div className="space-y-2">
                        <Slider
                          value={[specs.dimensions.width]}
                          onValueChange={(value) =>
                            setSpecs({
                              ...specs,
                              dimensions: { ...specs.dimensions, width: value[0] },
                            })
                          }
                          max={120} // 10 feet
                          min={12} // 1 foot
                          step={1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={specs.dimensions.width}
                          onChange={(e) =>
                            setSpecs({
                              ...specs,
                              dimensions: { ...specs.dimensions, width: Number.parseInt(e.target.value) || 0 },
                            })
                          }
                          className="text-center"
                          placeholder="inches"
                        />
                        <div className="text-xs text-center text-slate-500">
                          {inchesToFeetAndInches(specs.dimensions.width)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-sm text-slate-600">
                        Height
                      </Label>
                      <div className="space-y-2">
                        <Slider
                          value={[specs.dimensions.height]}
                          onValueChange={(value) =>
                            setSpecs({
                              ...specs,
                              dimensions: { ...specs.dimensions, height: value[0] },
                            })
                          }
                          max={96} // 8 feet
                          min={6} // 6 inches
                          step={1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={specs.dimensions.height}
                          onChange={(e) =>
                            setSpecs({
                              ...specs,
                              dimensions: { ...specs.dimensions, height: Number.parseInt(e.target.value) || 0 },
                            })
                          }
                          className="text-center"
                          placeholder="inches"
                        />
                        <div className="text-xs text-center text-slate-500">
                          {inchesToFeetAndInches(specs.dimensions.height)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depth" className="text-sm text-slate-600">
                        Depth
                      </Label>
                      <div className="space-y-2">
                        <Slider
                          value={[specs.dimensions.depth]}
                          onValueChange={(value) =>
                            setSpecs({
                              ...specs,
                              dimensions: { ...specs.dimensions, depth: value[0] },
                            })
                          }
                          max={60} // 5 feet
                          min={6} // 6 inches
                          step={1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={specs.dimensions.depth}
                          onChange={(e) =>
                            setSpecs({
                              ...specs,
                              dimensions: { ...specs.dimensions, depth: Number.parseInt(e.target.value) || 0 },
                            })
                          }
                          className="text-center"
                          placeholder="inches"
                        />
                        <div className="text-xs text-center text-slate-500">
                          {inchesToFeetAndInches(specs.dimensions.depth)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finish and Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="finish">Wood Finish</Label>
                    <Select value={specs.finish} onValueChange={(value) => setSpecs({ ...specs, finish: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select finish" />
                      </SelectTrigger>
                      <SelectContent>
                        {finishes.map((finish) => (
                          <SelectItem key={finish.value} value={finish.value}>
                            {finish.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Wood Color</Label>
                    <Select value={specs.color} onValueChange={(value) => setSpecs({ ...specs, color: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    type="number"
                    value={specs.quantity}
                    onChange={(e) => setSpecs({ ...specs, quantity: Number.parseInt(e.target.value) || 1 })}
                    min={1}
                    max={10}
                    className="w-24"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 3D Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  Interactive Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant={viewMode === "3d" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("3d")}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      3D View
                    </Button>
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
                    {viewMode === "3d" && <FurniturePreview specs={specs} />}
                    {viewMode === "ar" && specs.category && (
                      <ARViewer
                        furniture={{
                          id: "custom",
                          category: specs.category,
                          material: specs.material,
                          dimensions: specs.dimensions,
                          finish: specs.finish,
                          color: specs.color,
                          total_price: priceBreakdown.total,
                        }}
                      />
                    )}
                    {viewMode === "vr" && specs.category && (
                      <VRViewer
                        furniture={{
                          id: "custom",
                          category: specs.category,
                          material: specs.material,
                          dimensions: specs.dimensions,
                          finish: specs.finish,
                          color: specs.color,
                          total_price: priceBreakdown.total,
                        }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Estimation Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Price Estimation
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {specs.category && specs.material ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Base Cost</span>
                        <span>₹{priceBreakdown.baseCost.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Wood & Material Cost</span>
                        <span>₹{priceBreakdown.materialCost.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Craftsmanship Cost</span>
                        <span>₹{priceBreakdown.laborCost.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Finish Cost</span>
                        <span>₹{priceBreakdown.finishCost.toLocaleString("en-IN")}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-green-600">₹{priceBreakdown.total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-full justify-center py-2">
                        Estimated Delivery: 4-6 weeks
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || !specs.category || !specs.material || !specs.finish || !specs.color}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                        size="lg"
                      >
                        {isAddingToCart ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding to Cart...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={handleBuyNow}
                        disabled={!specs.category || !specs.material || !specs.finish || !specs.color}
                        variant="outline"
                        className="w-full bg-transparent"
                        size="lg"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg mx-auto mb-4"></div>
                    <p className="text-slate-600">Select furniture category and wood type to see pricing</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specifications Summary */}
            {specs.category && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Category:</span>
                    <span className="capitalize">{specs.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Wood Type:</span>
                    <span className="capitalize">{specs.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dimensions:</span>
                    <span>
                      {formatDimensions(specs.dimensions.width, specs.dimensions.height, specs.dimensions.depth)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Finish:</span>
                    <span className="capitalize">{specs.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Color:</span>
                    <span className="capitalize">{specs.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Quantity:</span>
                    <span>{specs.quantity}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </div>
  )
}
