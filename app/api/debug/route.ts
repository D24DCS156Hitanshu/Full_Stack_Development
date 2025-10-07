import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Test basic connection
    console.log("Testing Supabase connection...")

    // Check if furniture table exists and get its structure
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "furniture")

    console.log("Furniture table exists:", tables)

    // Try to get all furniture without filters
    const { data: allFurniture, error: allError } = await supabase.from("furniture").select("*")

    console.log("All furniture query result:", { data: allFurniture, error: allError })

    // Try to get active furniture
    const { data: activeFurniture, error: activeError } = await supabase
      .from("furniture")
      .select("*")
      .eq("status", "Active")

    console.log("Active furniture query result:", { data: activeFurniture, error: activeError })

    return NextResponse.json({
      tableExists: tables && tables.length > 0,
      allFurniture: allFurniture || [],
      allFurnitureError: allError,
      activeFurniture: activeFurniture || [],
      activeFurnitureError: activeError,
      totalCount: allFurniture?.length || 0,
      activeCount: activeFurniture?.length || 0,
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      { error: "Debug failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
