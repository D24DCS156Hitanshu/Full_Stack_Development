"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, ContactShadows, Text } from "@react-three/drei"
import { Suspense, useRef } from "react"
import type * as THREE from "three"

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

interface FurniturePreviewProps {
  specs: FurnitureSpec
}

export default function FurniturePreview({ specs }: FurniturePreviewProps) {
  if (!specs.category) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center text-slate-600">
          <p className="text-lg mb-2">Select furniture category</p>
          <p className="text-sm">to see 3D preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 relative">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} shadows gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <Scene specs={specs} />
        </Suspense>
      </Canvas>

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
        <p>🖱️ Drag to rotate • 🔍 Scroll to zoom</p>
      </div>
    </div>
  )
}

function Scene({ specs }: { specs: FurnitureSpec }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>

      {/* Contact Shadows */}
      <ContactShadows opacity={0.4} scale={10} blur={1} far={10} resolution={256} color="#000000" />

      {/* Furniture Model */}
      {specs.category ? <FurnitureModel specs={specs} /> : <EmptyState />}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

function FurnitureModel({ specs }: { specs: FurnitureSpec }) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Convert dimensions from inches to 3D units
  const width = specs.dimensions.width / 50
  const height = specs.dimensions.height / 50
  const depth = specs.dimensions.depth / 50

  // Get material color based on wood type and color
  const getMaterialColor = () => {
    const colorMap: { [key: string]: string } = {
      natural: "#d4a574",
      brown: "#8b4513",
      black: "#2d3748",
      white: "#f7fafc",
      gray: "#718096",
      cherry: "#8b2635",
    }
    return colorMap[specs.color] || "#d4a574"
  }

  // Render different furniture types
  const renderFurniture = () => {
    switch (specs.category) {
      case "sofa":
        return <SofaModel width={width} height={height} depth={depth} color={getMaterialColor()} />
      case "chair":
        return <ChairModel width={width} height={height} depth={depth} color={getMaterialColor()} />
      case "table":
        return <TableModel width={width} height={height} depth={depth} color={getMaterialColor()} />
      case "bed":
        return <BedModel width={width} height={height} depth={depth} color={getMaterialColor()} />
      case "dresser":
        return <DresserModel width={width} height={height} depth={depth} color={getMaterialColor()} />
      case "bookshelf":
        return <BookshelfModel width={width} height={height} depth={depth} color={getMaterialColor()} />
      default:
        return <DefaultModel width={width} height={height} depth={depth} color={getMaterialColor()} />
    }
  }

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {renderFurniture()}
    </group>
  )
}

// Simple Sofa Model
function SofaModel({ width, height, depth, color }: any) {
  return (
    <group>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, height * 0.3, 0]}>
        <boxGeometry args={[width, height * 0.4, depth]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Backrest */}
      <mesh castShadow receiveShadow position={[0, height * 0.7, -depth * 0.3]}>
        <boxGeometry args={[width * 0.9, height * 0.5, depth * 0.2]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Armrests */}
      <mesh castShadow receiveShadow position={[-width * 0.4, height * 0.5, 0]}>
        <boxGeometry args={[width * 0.2, height * 0.6, depth * 0.8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[width * 0.4, height * 0.5, 0]}>
        <boxGeometry args={[width * 0.2, height * 0.6, depth * 0.8]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Legs */}
      {[-0.3, 0.3].map((x) =>
        [-0.3, 0.3].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x * width, height * 0.05, z * depth]}>
            <cylinderGeometry args={[0.02, 0.02, height * 0.1]} />
            <meshLambertMaterial color="#654321" />
          </mesh>
        )),
      )}
    </group>
  )
}

// Simple Chair Model
function ChairModel({ width, height, depth, color }: any) {
  return (
    <group>
      {/* Seat */}
      <mesh castShadow receiveShadow position={[0, height * 0.4, 0]}>
        <boxGeometry args={[width, height * 0.05, depth]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Backrest */}
      <mesh castShadow receiveShadow position={[0, height * 0.7, -depth * 0.4]}>
        <boxGeometry args={[width, height * 0.5, depth * 0.1]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Legs */}
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x * width * 0.4, height * 0.2, z * depth * 0.4]}>
            <cylinderGeometry args={[0.015, 0.015, height * 0.4]} />
            <meshLambertMaterial color={color} />
          </mesh>
        )),
      )}
    </group>
  )
}

// Simple Table Model
function TableModel({ width, height, depth, color }: any) {
  return (
    <group>
      {/* Table top */}
      <mesh castShadow receiveShadow position={[0, height, 0]}>
        <boxGeometry args={[width, height * 0.05, depth]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Legs */}
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x * width * 0.4, height * 0.5, z * depth * 0.4]}>
            <cylinderGeometry args={[0.02, 0.02, height]} />
            <meshLambertMaterial color={color} />
          </mesh>
        )),
      )}
    </group>
  )
}

// Simple Bed Model
function BedModel({ width, height, depth, color }: any) {
  return (
    <group>
      {/* Mattress */}
      <mesh castShadow receiveShadow position={[0, height * 0.2, 0]}>
        <boxGeometry args={[width, height * 0.15, depth]} />
        <meshLambertMaterial color="#f8f9fa" />
      </mesh>

      {/* Bed frame */}
      <mesh castShadow receiveShadow position={[0, height * 0.1, 0]}>
        <boxGeometry args={[width * 1.1, height * 0.05, depth * 1.1]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Headboard */}
      <mesh castShadow receiveShadow position={[0, height * 0.5, -depth * 0.5]}>
        <boxGeometry args={[width, height * 0.6, depth * 0.1]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  )
}

// Simple Dresser Model
function DresserModel({ width, height, depth, color }: any) {
  return (
    <group>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Drawer handles */}
      {[0.7, 0.3, -0.1, -0.5].map((y, index) => (
        <mesh key={index} castShadow position={[width * 0.3, height * y, depth * 0.51]}>
          <cylinderGeometry args={[0.01, 0.01, 0.03]} />
          <meshLambertMaterial color="#444" />
        </mesh>
      ))}
    </group>
  )
}

// Simple Bookshelf Model
function BookshelfModel({ width, height, depth, color }: any) {
  return (
    <group>
      {/* Main frame */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Shelves */}
      {[0.6, 0.2, -0.2].map((y, index) => (
        <mesh key={index} castShadow receiveShadow position={[0, height * y, 0]}>
          <boxGeometry args={[width * 0.9, 0.02, depth * 0.9]} />
          <meshLambertMaterial color={color} />
        </mesh>
      ))}

      {/* Books */}
      {[0.7, 0.3, -0.1].map((shelfY, shelfIndex) =>
        Array.from({ length: 8 }, (_, bookIndex) => (
          <mesh
            key={`${shelfIndex}-${bookIndex}`}
            castShadow
            position={[(bookIndex - 4) * (width * 0.1), height * shelfY, depth * 0.2]}
          >
            <boxGeometry args={[0.02, 0.1, 0.06]} />
            <meshLambertMaterial color={`hsl(${bookIndex * 45}, 70%, 50%)`} />
          </mesh>
        )),
      )}
    </group>
  )
}

// Default Model
function DefaultModel({ width, height, depth, color }: any) {
  return (
    <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
      <boxGeometry args={[width, height, depth]} />
      <meshLambertMaterial color={color} />
    </mesh>
  )
}

// Empty State
function EmptyState() {
  return (
    <group>
      <Text position={[0, 1, 0]} fontSize={0.5} color="#64748b" anchorX="center" anchorY="middle">
        Select furniture category
        {"\n"}to see 3D preview
      </Text>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color="#e2e8f0" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

// Loading Fallback
function LoadingFallback() {
  return (
    <group>
      <Text position={[0, 0, 0]} fontSize={0.3} color="#64748b" anchorX="center" anchorY="middle">
        Loading 3D Preview...
      </Text>
    </group>
  )
}
