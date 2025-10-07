import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  try {
    console.log("=== DEBUG FURNITURE TEST ===")

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Test 1: Check database connection
    console.log("1. Testing database connection...")
    const { data: connectionTest, error: connectionError } = await supabase.from("furniture").select("count").limit(1)

    if (connectionError) {
      return NextResponse.json({
        test: "FAILED",
        step: "Database Connection",
        error: connectionError,
        message: "Cannot connect to database",
      })
    }

    // Test 2: Get all furniture (including inactive)
    console.log("2. Fetching all furniture...")
    const { data: allFurniture, error: fetchError } = await supabase
      .from("furniture")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("All furniture in database:", allFurniture)

    // Test 3: Get only active furniture
    console.log("3. Fetching active furniture...")
    const { data: activeFurniture, error: activeError } = await supabase
      .from("furniture")
      .select("*")
      .eq("status", "Active")
      .order("created_at", { ascending: false })

    console.log("Active furniture in database:", activeFurniture)

    // Test 4: Create a test furniture item
    console.log("4. Creating test furniture...")
    const testFurniture = {
      id: crypto.randomUUID(),
      name: "Debug Test Chair",
      category: "Chair",
      material: "Oak",
      dimensions: { width: 24, height: 36, depth: 24 },
      finish: "Natural",
      color: "Brown",
      price: 15000,
      stock: 1,
      status: "Active",
      images: [],
      description: "Test furniture for debugging",
      model3d: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: createdFurniture, error: createError } = await supabase
      .from("furniture")
      .insert([testFurniture])
      .select()
      .single()

    return NextResponse.json({
      test: "SUCCESS",
      results: {
        connectionTest: "✅ Database connected",
        totalFurniture: allFurniture?.length || 0,
        activeFurniture: activeFurniture?.length || 0,
        allFurnitureData: allFurniture,
        activeFurnitureData: activeFurniture,
        testFurnitureCreated: createdFurniture ? "✅ Test furniture created" : "❌ Failed to create test furniture",
        createError: createError,
        testFurnitureData: createdFurniture,
      },
    })
  } catch (error) {
    console.error("Debug test failed:", error)
    return NextResponse.json({
      test: "FAILED",
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    })
  }
}
