import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  try {
    console.log("=== DATABASE CONNECTION TEST ===")
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Test 1: Check if furniture table exists
    console.log("Testing furniture table access...")
    const { data: tableTest, error: tableError } = await supabase
      .from("furniture")
      .select("count", { count: "exact", head: true })

    if (tableError) {
      console.error("Table access error:", tableError)
      return NextResponse.json({
        success: false,
        error: "Furniture table access failed",
        details: tableError,
        step: "table_access",
      })
    }

    console.log("✅ Furniture table accessible")

    // Test 2: Try to fetch all furniture
    const { data: allFurniture, error: fetchError } = await supabase.from("furniture").select("*")

    if (fetchError) {
      console.error("Fetch error:", fetchError)
      return NextResponse.json({
        success: false,
        error: "Failed to fetch furniture",
        details: fetchError,
        step: "fetch_data",
      })
    }

    console.log("✅ Furniture fetch successful")
    console.log("Current furniture count:", allFurniture?.length || 0)

    // Test 3: Try to insert a test record
    const testFurniture = {
      id: crypto.randomUUID(),
      name: "Test Chair",
      category: "Chair",
      material: "Oak",
      dimensions: { width: 24, height: 36, depth: 24 },
      finish: "Natural",
      color: "Brown",
      price: 15000,
      stock: 1,
      status: "Active",
      images: [],
      description: "Test furniture item",
      model3d: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: insertData, error: insertError } = await supabase
      .from("furniture")
      .insert([testFurniture])
      .select()
      .single()

    if (insertError) {
      console.error("Insert error:", insertError)
      return NextResponse.json({
        success: false,
        error: "Failed to insert test furniture",
        details: insertError,
        step: "insert_test",
        currentData: allFurniture,
      })
    }

    console.log("✅ Test furniture inserted successfully")

    // Test 4: Delete the test record
    const { error: deleteError } = await supabase.from("furniture").delete().eq("id", testFurniture.id)

    if (deleteError) {
      console.error("Delete error:", deleteError)
    } else {
      console.log("✅ Test furniture deleted successfully")
    }

    return NextResponse.json({
      success: true,
      message: "Database connection test passed",
      results: {
        tableAccessible: true,
        currentFurnitureCount: allFurniture?.length || 0,
        testInsertSuccessful: true,
        testDeleteSuccessful: !deleteError,
        sampleData: allFurniture?.slice(0, 2) || [],
      },
    })
  } catch (error) {
    console.error("Unexpected error in database test:", error)
    return NextResponse.json({
      success: false,
      error: "Unexpected error",
      details: error instanceof Error ? error.message : "Unknown error",
      step: "unexpected_error",
    })
  }
}
