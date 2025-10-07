"use client"

import { useEffect, useState } from "react"
import { Camera, RotateCcw, AlertCircle } from "lucide-react"

interface FurnitureData {
  id: string
  category: string
  material: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  finish: string
  color: string
  total_price: number
  model3d?: {
    glb?: string
    usdz?: string
  }
}

interface ARViewerProps {
  furniture: FurnitureData
}

export function ARViewer({ furniture }: ARViewerProps) {
  const [modelError, setModelError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AR Viewer - Furniture data received:", furniture)
    console.log("[v0] AR Viewer - model3d value:", furniture.model3d)
    console.log("[v0] AR Viewer - model3d type:", typeof furniture.model3d)
    console.log("[v0] AR Viewer - model3d.glb:", furniture.model3d?.glb)
  }, [furniture])

  useEffect(() => {
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      document.head.appendChild(script)
    }
  }, [])

  const hasValidModel =
    furniture.model3d?.glb &&
    typeof furniture.model3d.glb === "string" &&
    furniture.model3d.glb.trim() !== ""

  const modelSrc = hasValidModel ? furniture.model3d.glb : "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
  const iosSrc = furniture.model3d?.usdz

  console.log("[v0] AR Viewer - Has valid model:", hasValidModel)
  console.log("[v0] AR Viewer - Using model source:", modelSrc)
  console.log("[v0] AR Viewer - iOS source:", iosSrc)

  if (!hasValidModel || modelError) {
    return (
      <div className="w-full h-full relative bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto text-amber-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">3D Model Not Available</h3>
          <p className="text-sm text-slate-600 mb-4">
            {modelError
              ? "The 3D model failed to load. Please check the model URL and try again."
              : "This furniture item doesn't have a valid 3D model URL. The AR/VR preview requires a publicly accessible GLB model file."}
          </p>
          <div className="bg-white/80 rounded-lg p-4 text-left text-xs text-slate-600 space-y-3">
            <div>
              <p className="font-semibold mb-2">Why is this happening?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>No 3D model was uploaded for this item</li>
                <li>The model URL is invalid or expired</li>
                <li>Blob URLs are temporary and don't persist</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">For Admin - How to fix:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Upload GLB files to a cloud storage service</li>
                <li>Use publicly accessible URLs (https://...)</li>
                <li>Recommended: Vercel Blob, Cloudinary, or AWS S3</li>
                <li>Models should be optimized for web (under 10MB)</li>
              </ul>
            </div>
          </div>
          {furniture.model3d?.glb && (
            <div className="mt-4 text-xs text-slate-500 bg-slate-100 rounded p-2 break-all">
              <p className="font-semibold mb-1">Current model URL:</p>
              <p className="font-mono">{furniture.model3d.glb}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-100 to-slate-200">
      <model-viewer
        src={modelSrc}
        ios-src={iosSrc}
        alt={`AR model of ${furniture.category}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        environment-image="neutral"
        shadow-intensity="1"
        camera-orbit="45deg 75deg 1.5m"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
        onLoad={() => {
          console.log("[v0] Model loaded successfully")
          setIsLoading(false)
          setModelError(false)
        }}
        onError={(e: any) => {
          console.error("[v0] Model failed to load:", e)
          setIsLoading(false)
          setModelError(true)
        }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors"
        >
          <Camera className="h-4 w-4" />
          View in AR
        </button>
      </model-viewer>

      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs max-w-xs">
        <h4 className="font-semibold mb-1">AR Instructions</h4>
        <p>Tap "View in AR" → Point at flat surface → Tap to place</p>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
        <h4 className="font-semibold text-slate-900">
          {furniture.category.charAt(0).toUpperCase() + furniture.category.slice(1)}
        </h4>
        <p className="text-slate-600">
          {furniture.dimensions.width}" × {furniture.dimensions.height}" × {furniture.dimensions.depth}"
        </p>
        <p className="text-green-600 font-semibold">₹{furniture.total_price.toLocaleString()}</p>
      </div>

      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-3 w-3" />
          <span>Drag to rotate • Scroll to zoom</span>
        </div>
      </div>
    </div>
  )
}
