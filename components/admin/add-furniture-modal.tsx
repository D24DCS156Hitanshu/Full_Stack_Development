"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Upload, Smartphone, Headphones, X, FileUp, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { ARViewer } from "@/components/ar-viewer"
import { VRViewer } from "@/components/vr-viewer"
import { uploadFile, uploadMultipleFiles } from "@/lib/storage"

interface AddFurnitureModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (furniture: any) => void
}

interface UploadedFile {
  file: File
  url: string
  storagePath?: string
  type: "glb" | "usdz" | "image"
}

export function AddFurnitureModal({ isOpen, onClose, onAdd }: AddFurnitureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    material: "",
    dimensions: { width: 72, height: 36, depth: 30 },
    finish: "",
    color: "",
    price: "",
    stock: "",
    description: "",
    images: [] as string[],
    model3d: {
      glb: null as UploadedFile | null,
      usdz: null as UploadedFile | null,
    },
  })
  const [previewMode, setPreviewMode] = useState<"ar" | "vr">("ar")
  const [uploadingModel, setUploadingModel] = useState<"glb" | "usdz" | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)

  const categories = [
    { value: "sofa", label: "Sofa" },
    { value: "chair", label: "Chair" },
    { value: "table", label: "Table" },
    { value: "bed", label: "Bed" },
    { value: "dresser", label: "Dresser" },
    { value: "bookshelf", label: "Bookshelf" },
  ]

  const materials = [
    { value: "oak", label: "Oak Wood" },
    { value: "pine", label: "Pine Wood" },
    { value: "mahogany", label: "Mahogany" },
    { value: "teak", label: "Teak Wood" },
    { value: "walnut", label: "Walnut Wood" },
    { value: "maple", label: "Maple Wood" },
  ]

  const finishes = [
    { value: "natural", label: "Natural" },
    { value: "stained", label: "Stained" },
    { value: "painted", label: "Painted" },
    { value: "lacquered", label: "Lacquered" },
  ]

  const colors = [
    { value: "natural", label: "Natural Wood" },
    { value: "brown", label: "Rich Brown" },
    { value: "black", label: "Ebony Black" },
    { value: "white", label: "Antique White" },
    { value: "gray", label: "Weathered Gray" },
    { value: "cherry", label: "Cherry Red" },
  ]

  useEffect(() => {
    if (isOpen) {
      setStorageError(null)
    }
  }, [isOpen])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "glb" | "usdz" | "image") => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (type === "glb" && !file.name.toLowerCase().endsWith(".glb")) {
      alert("Please upload a GLB file")
      return
    }
    if (type === "usdz" && !file.name.toLowerCase().endsWith(".usdz")) {
      alert("Please upload a USDZ file")
      return
    }
    if (type === "image" && !file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    setUploadingModel(type === "image" ? null : type)
    if (type === "image") setUploadingImages(true)

    try {
      console.log("[v0] ===== STARTING FILE UPLOAD =====")
      console.log("[v0] File:", file.name, `(${(file.size / 1024 / 1024).toFixed(2)} MB)`)
      console.log("[v0] Type:", type)

      const uploadType = type === "image" ? "image" : "model"
      const result = await uploadFile(file, uploadType)

      console.log("[v0] Upload result:", result)

      if (result.error) {
        console.error("[v0] ===== UPLOAD ERROR =====")
        console.error("[v0] Error:", result.error)
        throw new Error(result.error)
      }

      if (!result.url || result.url === "") {
        console.error("[v0] ===== UPLOAD FAILED - NO URL =====")
        throw new Error("Upload succeeded but no URL was returned")
      }

      console.log("[v0] ===== UPLOAD SUCCESS =====")
      console.log("[v0] Public URL:", result.url)

      // Create uploaded file object
      const uploadedFile: UploadedFile = {
        file,
        url: result.url,
        type,
      }

      if (type === "glb") {
        setFormData((prev) => ({
          ...prev,
          model3d: { ...prev.model3d, glb: uploadedFile },
        }))
        console.log("[v0] GLB model added to form data")
      } else if (type === "usdz") {
        setFormData((prev) => ({
          ...prev,
          model3d: { ...prev.model3d, usdz: uploadedFile },
        }))
        console.log("[v0] USDZ model added to form data")
      } else if (type === "image") {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result.url],
        }))
        console.log("[v0] Image added to form data")
      }

      console.log("[v0] Form data updated with permanent Supabase Storage URL")
    } catch (error) {
      console.error("[v0] ===== FILE UPLOAD EXCEPTION =====")
      console.error("[v0] Error:", error)
      alert(
        `Error uploading file: ${error instanceof Error ? error.message : "Unknown error"}\n\nPlease check the console for details.`,
      )
    } finally {
      setUploadingModel(null)
      if (type === "image") setUploadingImages(false)
    }
  }

  const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setUploadingImages(true)

    try {
      console.log("[v0] Uploading multiple images to local storage")

      const results = await uploadMultipleFiles(files, "image")

      const successfulUploads = results.filter((r) => !r.error)
      const failedUploads = results.filter((r) => r.error)

      if (failedUploads.length > 0) {
        console.error("[v0] Some uploads failed:", failedUploads)
        alert(`${failedUploads.length} image(s) failed to upload`)
      }

      if (successfulUploads.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...successfulUploads.map((r) => r.url)],
        }))
        console.log("[v0] Successfully uploaded images:", successfulUploads)
      }
    } catch (error) {
      console.error("[v0] Error uploading images:", error)
      alert("Error uploading images. Please try again.")
    } finally {
      setUploadingImages(false)
    }
  }

  const removeFile = (type: "glb" | "usdz") => {
    if (type === "glb") {
      setFormData((prev) => ({
        ...prev,
        model3d: { ...prev.model3d, glb: null },
      }))
    } else if (type === "usdz") {
      setFormData((prev) => ({
        ...prev,
        model3d: { ...prev.model3d, usdz: null },
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.model3d.glb) {
      alert("Please upload a GLB model file for AR/VR preview")
      return
    }

    console.log("[v0] Submitting furniture with local storage URLs")

    const newFurniture = {
      ...formData,
      price: Number.parseInt(formData.price),
      stock: Number.parseInt(formData.stock),
      status: "Active",
      images:
        formData.images.length > 0 ? formData.images : ["/placeholder.svg?height=300&width=400&text=New+Furniture"],
      model3d: {
        glb: formData.model3d.glb?.url,
        usdz: formData.model3d.usdz?.url,
      },
    }

    console.log("[v0] New furniture object with local URLs:", newFurniture)
    console.log("[v0] Model3d structure:", newFurniture.model3d)

    onAdd(newFurniture)

    // Reset form
    setFormData({
      name: "",
      category: "",
      material: "",
      dimensions: { width: 72, height: 36, depth: 30 },
      finish: "",
      color: "",
      price: "",
      stock: "",
      description: "",
      images: [],
      model3d: { glb: null, usdz: null },
    })
  }

  const inchesToFeetAndInches = (inches: number) => {
    const feet = Math.floor(inches / 12)
    const remainingInches = inches % 12
    if (feet === 0) return `${remainingInches}"`
    if (remainingInches === 0) return `${feet}'`
    return `${feet}' ${remainingInches}"`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Furniture</DialogTitle>
        </DialogHeader>

        {storageError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Storage Not Configured</h4>
                <p className="text-sm text-red-700 mb-2">{storageError}</p>
                <p className="text-xs text-red-600">
                  Please ensure the uploads directory exists in the public folder.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Furniture Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Modern Oak Dining Table"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) => setFormData({ ...formData, material: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
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
              </div>

              {/* 3D Model Upload Section */}
              <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                <Label className="text-base font-semibold">3D Model Files</Label>
                <p className="text-sm text-slate-600">Upload 3D model files for AR/VR experience</p>

                {/* GLB Upload */}
                <div className="space-y-2">
                  <Label className="text-sm">GLB Model (Required for AR/VR)</Label>
                  {formData.model3d.glb ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">{formData.model3d.glb.file.name}</span>
                        <span className="text-xs text-slate-500">
                          ({(formData.model3d.glb.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("glb")}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".glb"
                        onChange={(e) => handleFileUpload(e, "glb")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingModel === "glb"}
                      />
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition-colors">
                        {uploadingModel === "glb" ? (
                          <>
                            <Loader2 className="h-8 w-8 mx-auto text-blue-500 mb-2 animate-spin" />
                            <p className="text-sm text-slate-600">Uploading to Supabase Storage...</p>
                          </>
                        ) : (
                          <>
                            <FileUp className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-sm text-slate-600">Click to upload GLB file</p>
                            <p className="text-xs text-slate-500">Max 50MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* USDZ Upload */}
                <div className="space-y-2">
                  <Label className="text-sm">USDZ Model (Required for iOS AR)</Label>
                  {formData.model3d.usdz ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">{formData.model3d.usdz.file.name}</span>
                        <span className="text-xs text-slate-500">
                          ({(formData.model3d.usdz.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("usdz")}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".usdz"
                        onChange={(e) => handleFileUpload(e, "usdz")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingModel === "usdz"}
                      />
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition-colors">
                        {uploadingModel === "usdz" ? (
                          <>
                            <Loader2 className="h-8 w-8 mx-auto text-blue-500 mb-2 animate-spin" />
                            <p className="text-sm text-slate-600">Uploading to Supabase Storage...</p>
                          </>
                        ) : (
                          <>
                            <FileUp className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-sm text-slate-600">Click to upload USDZ file</p>
                            <p className="text-xs text-slate-500">Max 50MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-4">
                <Label>Dimensions</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Width</Label>
                    <Slider
                      value={[formData.dimensions.width]}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, width: value[0] },
                        })
                      }
                      max={120}
                      min={12}
                      step={1}
                    />
                    <div className="text-xs text-center text-slate-500">
                      {inchesToFeetAndInches(formData.dimensions.width)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Height</Label>
                    <Slider
                      value={[formData.dimensions.height]}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, height: value[0] },
                        })
                      }
                      max={96}
                      min={6}
                      step={1}
                    />
                    <div className="text-xs text-center text-slate-500">
                      {inchesToFeetAndInches(formData.dimensions.height)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Depth</Label>
                    <Slider
                      value={[formData.dimensions.depth]}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, depth: value[0] },
                        })
                      }
                      max={60}
                      min={6}
                      step={1}
                    />
                    <div className="text-xs text-center text-slate-500">
                      {inchesToFeetAndInches(formData.dimensions.depth)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="finish">Finish</Label>
                  <Select
                    value={formData.finish}
                    onValueChange={(value) => setFormData({ ...formData, finish: value })}
                  >
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
                  <Label htmlFor="color">Color</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="45000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the furniture piece..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImages}
                  />
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition-colors">
                    {uploadingImages ? (
                      <>
                        <Loader2 className="h-8 w-8 mx-auto text-blue-500 mb-2 animate-spin" />
                        <p className="text-sm text-slate-600">Uploading to Supabase Storage...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600">Upload product images</p>
                        <p className="text-xs text-slate-500">PNG, JPG up to 10MB each</p>
                      </>
                    )}
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Live Preview</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={previewMode === "ar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("ar")}
                  >
                    <Smartphone className="h-4 w-4 mr-1" />
                    AR
                  </Button>
                  <Button
                    type="button"
                    variant={previewMode === "vr" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("vr")}
                  >
                    <Headphones className="h-4 w-4 mr-1" />
                    VR
                  </Button>
                </div>
              </div>

              <div className="aspect-video rounded-lg overflow-hidden border">
                {formData.model3d.glb ? (
                  <>
                    {previewMode === "ar" && (
                      <ARViewer
                        furniture={{
                          id: "preview",
                          category: formData.category,
                          material: formData.material,
                          dimensions: formData.dimensions,
                          finish: formData.finish || "natural",
                          color: formData.color || "natural",
                          total_price: Number.parseInt(formData.price) || 0,
                          model3d: {
                            glb: formData.model3d.glb.url,
                            usdz: formData.model3d.usdz?.url,
                          },
                        }}
                      />
                    )}
                    {previewMode === "vr" && (
                      <VRViewer
                        furniture={{
                          id: "preview",
                          category: formData.category,
                          material: formData.material,
                          dimensions: formData.dimensions,
                          finish: formData.finish || "natural",
                          color: formData.color || "natural",
                          total_price: Number.parseInt(formData.price) || 0,
                          model3d: {
                            glb: formData.model3d.glb.url,
                            usdz: formData.model3d.usdz?.url,
                          },
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-100">
                    <div className="text-center">
                      <FileUp className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                      <p className="text-slate-500">Upload GLB model to see preview</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Customer View Preview:</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {formData.name || "Furniture Name"}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{formData.price ? Number.parseInt(formData.price).toLocaleString() : "0"}
                  </p>
                  <p>
                    <strong>Material:</strong> {formData.material || "Not selected"}
                  </p>
                  <p>
                    <strong>Dimensions:</strong>{" "}
                    {`${inchesToFeetAndInches(formData.dimensions.width)} × ${inchesToFeetAndInches(formData.dimensions.height)} × ${inchesToFeetAndInches(formData.dimensions.depth)}`}
                  </p>
                  <p>
                    <strong>AR Model:</strong> {formData.model3d.glb ? "✅ GLB Ready" : "❌ GLB Required"}
                  </p>
                  <p>
                    <strong>iOS AR:</strong> {formData.model3d.usdz ? "✅ USDZ Ready" : "⚠️ USDZ Recommended"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              disabled={
                !formData.name ||
                !formData.category ||
                !formData.material ||
                !formData.price ||
                !formData.model3d.glb ||
                uploadingModel !== null ||
                uploadingImages
              }
            >
              Add Furniture
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
