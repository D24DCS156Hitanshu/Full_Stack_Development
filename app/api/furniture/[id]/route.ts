import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("=== FURNITURE DELETE REQUEST ===")
    console.log("Deleting furniture ID:", params.id)

    const deleted = db.furniture.delete(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Furniture not found" }, { status: 404 })
    }

    console.log("Successfully deleted furniture:", params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting furniture:", error)
    return NextResponse.json(
      {
        error: "Failed to delete furniture",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
