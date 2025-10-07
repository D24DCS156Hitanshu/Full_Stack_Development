"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Headphones, ExternalLink } from "lucide-react"

interface GoogleVRViewerProps {
  furniture: {
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
  }
}

export function GoogleVRViewer({ furniture }: GoogleVRViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Google VR View script
    const script = document.createElement("script")
    script.src = "https://storage.googleapis.com/vrview/2.0/build/vrview.min.js"
    script.async = true

    script.onload = () => {
      if (viewerRef.current && window.VRView) {
        // Initialize Google VR View
        new window.VRView.Player("#vr-viewer", {
          image: generateVRImage(furniture),
          width: "100%",
          height: "400px",
          is_stereo: false,
          is_autopan_off: false,
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [furniture])

  const generateVRImage = (furniture: any) => {
    // In a real implementation, this would generate or fetch a 360° image
    // For demo purposes, we'll use a placeholder
    return `/placeholder.svg?height=400&width=800&text=360°+VR+View+${furniture.category}`
  }

  const openInGoogleCardboard = () => {
    // Generate Google Cardboard compatible URL
    const cardboardUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(generateVRImage(furniture))}&mode=vr_only`
    window.open(cardboardUrl, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Google VR Experience</h3>
        <Button onClick={openInGoogleCardboard} variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Cardboard
        </Button>
      </div>

      <div id="vr-viewer" ref={viewerRef} className="w-full h-96 bg-black rounded-lg overflow-hidden">
        {/* Fallback content */}
        <div className="flex items-center justify-center h-full text-white">
          <div className="text-center">
            <Headphones className="h-16 w-16 mx-auto mb-4" />
            <p>Loading Google VR Experience...</p>
            <p className="text-sm text-gray-300 mt-2">
              {furniture.category} - {furniture.material} Wood
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">VR Experience Features:</h4>
        <ul className="text-sm space-y-1">
          <li>• 360° immersive view of your furniture</li>
          <li>• Compatible with Google Cardboard</li>
          <li>• Works with VR headsets</li>
          <li>• Interactive room placement</li>
        </ul>
      </div>
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    VRView: any
  }
}
