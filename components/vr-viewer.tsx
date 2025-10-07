"use client"

import { useEffect, useState } from "react"
import { Headphones, Eye, AlertCircle } from "lucide-react"

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

interface VRViewerProps {
  furniture: FurnitureData
}

export function VRViewer({ furniture }: VRViewerProps) {
  const [modelError, setModelError] = useState(false)

  useEffect(() => {
    if (!document.querySelector('script[src*="aframe"]')) {
      const script = document.createElement("script")
      script.src = "https://aframe.io/releases/1.4.0/aframe.min.js"
      document.head.appendChild(script)
    }

    if (!document.querySelector('script[src*="environment-component"]')) {
      const envScript = document.createElement("script")
      envScript.src = "https://unpkg.com/aframe-environment-component@1.3.1/dist/aframe-environment-component.min.js"
      document.head.appendChild(envScript)
    }
  }, [])

  const hasValidModel =
    furniture.model3d?.glb &&
    typeof furniture.model3d.glb === "string" &&
    furniture.model3d.glb.trim() !== ""

  const modelSrc = hasValidModel ? furniture.model3d.glb : "https://modelviewer.dev/shared-assets/models/Astronaut.glb"

  console.log("[v0] VR Viewer - Has valid model:", hasValidModel)
  console.log("[v0] VR Viewer - Using model source:", modelSrc)

  if (!hasValidModel) {
    return (
      <div className="w-full h-full relative bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">3D Model Not Available</h3>
          <p className="text-sm text-slate-600 mb-4">
            This furniture item doesn't have a valid 3D model URL. The VR preview requires a publicly accessible GLB
            model file.
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
    <div className="w-full h-full relative">
      <div className="w-full h-full">
        <a-scene
          embedded
          style={{ width: "100%", height: "100%" }}
          vr-mode-ui="enabled: true"
          background="color: #87CEEB"
          environment="preset: forest; groundColor: #445; grid: 1x1"
        >
          <a-assets>
            <a-asset-item id="furniture-model" src={modelSrc}></a-asset-item>
          </a-assets>

          <a-light type="ambient" color="#404040" intensity="0.4"></a-light>
          <a-light type="directional" position="2 4 2" color="#ffffff" intensity="0.8"></a-light>

          <a-plane position="0 0 0" rotation="-90 0 0" width="20" height="20" color="#7BC8A4"></a-plane>

          <a-entity
            gltf-model="#furniture-model"
            position="0 0 -2"
            scale="1 1 1"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 20000"
          ></a-entity>

          <a-text
            value={`${furniture.category.toUpperCase()}\n${furniture.material} Wood\n₹${furniture.total_price.toLocaleString()}`}
            position="-3 3 -3"
            color="#000000"
            background="color: white; opacity: 0.8"
            align="center"
            width="8"
          ></a-text>

          <a-camera look-controls="enabled: true" wasd-controls="enabled: true" position="0 1.6 3"></a-camera>
        </a-scene>
      </div>

      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <Headphones className="h-4 w-4" />
          <span className="font-semibold">VR Controls</span>
        </div>
        <p>WASD to move • Mouse to look • Click VR icon for immersive mode</p>
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
          <Eye className="h-3 w-3" />
          <span>WASD to move • Mouse to look</span>
        </div>
      </div>
    </div>
  )
}
