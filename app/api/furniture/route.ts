import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("=== FURNITURE API GET REQUEST ===")

    const furniture = db.furniture.findAll().filter(item => item.status === "Active")
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    console.log("Database query completed")
    console.log("Data:", furniture)
    console.log("Data length:", furniture?.length || 0)

    if (furniture && furniture.length > 0) {
      console.log("[v0] First furniture item model3d:", furniture[0].model3d)
      console.log("[v0] First furniture item model3d type:", typeof furniture[0].model3d)
      console.log("[v0] First furniture item dimensions:", furniture[0].dimensions)
      console.log("[v0] First furniture item dimensions type:", typeof furniture[0].dimensions)
    }

    console.log("Returning furniture data:", furniture?.length || 0, "items")
    return NextResponse.json(furniture || [])
  } catch (error) {
    console.error("Unexpected error in furniture API:", error)
    return NextResponse.json(
      { error: "Failed to fetch furniture", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("=== FURNITURE API POST REQUEST ===")

    const furnitureData = await request.json()
    console.log("Received furniture data:", furnitureData)
    console.log("[v0] Received model3d:", furnitureData.model3d)
    console.log("[v0] Received model3d type:", typeof furnitureData.model3d)

    const furnitureRecord = {
      id: crypto.randomUUID(),
      name: furnitureData.name,
      category: furnitureData.category,
      material: furnitureData.material,
      dimensions: furnitureData.dimensions,
      finish: furnitureData.finish,
      color: furnitureData.color,
      price: Number.parseFloat(furnitureData.price),
      stock: Number.parseInt(furnitureData.stock),
      status: "Active",
      images: furnitureData.images || [],
      description: furnitureData.description || "",
      model3d: furnitureData.model3d || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Prepared furniture record:", furnitureRecord)
    console.log("[v0] Prepared model3d:", furnitureRecord.model3d)

    if (!furnitureRecord.name || !furnitureRecord.category) {
      return NextResponse.json({ error: "Missing required fields: name and category" }, { status: 400 })
    }

    const data = db.furniture.create(furnitureRecord)

    console.log("Insert result - Data:", data)
    console.log("[v0] Inserted model3d:", data.model3d)
    console.log("[v0] Inserted model3d type:", typeof data.model3d)

    console.log("Successfully created furniture:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error creating furniture:", error)
    return NextResponse.json(
      { error: "Failed to create furniture", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
