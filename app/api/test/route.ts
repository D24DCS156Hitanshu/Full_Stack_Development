import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("🧪 Starting automated furniture system tests...")

  const results = {
    databaseConnection: false,
    furnitureTableExists: false,
    apiEndpoints: {
      get: false,
      post: false,
      delete: false,
    },
    dataFlow: false,
    errors: [] as string[],
  }

  try {
    // Test 1: Database Connection
    console.log("🔍 Test 1: Database Connection")
    const supabase = createRouteHandlerClient({ cookies })

    const { data: connectionTest, error: connectionError } = await supabase.from("furniture").select("count").limit(1)

    if (connectionError) {
      results.errors.push(`Database connection failed: ${connectionError.message}`)
      console.log("❌ Database connection failed:", connectionError.message)
    } else {
      results.databaseConnection = true
      results.furnitureTableExists = true
      console.log("✅ Database connection successful")
    }

    // Test 2: API GET Endpoint
    console.log("🔍 Test 2: API GET Endpoint")
    try {
      const getResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/furniture`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (getResponse.ok) {
        results.apiEndpoints.get = true
        console.log("✅ GET /api/furniture working")
      } else {
        results.errors.push(`GET /api/furniture failed: ${getResponse.status}`)
        console.log("❌ GET /api/furniture failed:", getResponse.status)
      }
    } catch (error) {
      results.errors.push(`GET /api/furniture error: ${error}`)
      console.log("❌ GET /api/furniture error:", error)
    }

    // Test 3: API POST Endpoint (Create Test Furniture)
    console.log("🔍 Test 3: API POST Endpoint")
    const testFurniture = {
      name: "Test Chair - Auto Generated",
      category: "Chair",
      material: "Oak Wood",
      dimensions: "2' x 2' x 3'",
      finish: "Natural Finish",
      color: "Brown",
      price: 15000,
      stock: 1,
      status: "Active",
      description: "Automated test furniture item",
      images: ["/placeholder.svg?height=300&width=300"],
      model3d: null,
    }

    try {
      const postResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/furniture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testFurniture),
      })

      if (postResponse.ok) {
        const createdFurniture = await postResponse.json()
        results.apiEndpoints.post = true
        console.log("✅ POST /api/furniture working, created ID:", createdFurniture.id)

        // Test 4: Data Persistence (Verify the created item exists)
        console.log("🔍 Test 4: Data Persistence")
        const { data: persistedData, error: persistError } = await supabase
          .from("furniture")
          .select("*")
          .eq("id", createdFurniture.id)
          .single()

        if (persistError) {
          results.errors.push(`Data persistence failed: ${persistError.message}`)
          console.log("❌ Data persistence failed:", persistError.message)
        } else if (persistedData) {
          results.dataFlow = true
          console.log("✅ Data persistence working - furniture saved and retrieved")
        }

        // Test 5: API DELETE Endpoint (Clean up test data)
        console.log("🔍 Test 5: API DELETE Endpoint")
        try {
          const deleteResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/furniture/${createdFurniture.id}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            },
          )

          if (deleteResponse.ok) {
            results.apiEndpoints.delete = true
            console.log("✅ DELETE /api/furniture working - test data cleaned up")
          } else {
            results.errors.push(`DELETE /api/furniture failed: ${deleteResponse.status}`)
            console.log("❌ DELETE /api/furniture failed:", deleteResponse.status)
          }
        } catch (error) {
          results.errors.push(`DELETE /api/furniture error: ${error}`)
          console.log("❌ DELETE /api/furniture error:", error)
        }
      } else {
        const errorText = await postResponse.text()
        results.errors.push(`POST /api/furniture failed: ${postResponse.status} - ${errorText}`)
        console.log("❌ POST /api/furniture failed:", postResponse.status, errorText)
      }
    } catch (error) {
      results.errors.push(`POST /api/furniture error: ${error}`)
      console.log("❌ POST /api/furniture error:", error)
    }
  } catch (error) {
    results.errors.push(`Test suite error: ${error}`)
    console.log("❌ Test suite error:", error)
  }

  // Generate Test Report
  const allTestsPassed =
    results.databaseConnection &&
    results.furnitureTableExists &&
    results.apiEndpoints.get &&
    results.apiEndpoints.post &&
    results.apiEndpoints.delete &&
    results.dataFlow

  const report = {
    timestamp: new Date().toISOString(),
    status: allTestsPassed ? "PASSED" : "FAILED",
    summary: {
      total: 6,
      passed: [
        results.databaseConnection,
        results.furnitureTableExists,
        results.apiEndpoints.get,
        results.apiEndpoints.post,
        results.apiEndpoints.delete,
        results.dataFlow,
      ].filter(Boolean).length,
      failed: results.errors.length,
    },
    details: results,
    recommendations: allTestsPassed
      ? ["✅ All tests passed! Furniture system is working correctly."]
      : [
          "❌ Some tests failed. Check the errors below:",
          ...results.errors,
          "",
          "🔧 Troubleshooting steps:",
          "1. Ensure Supabase integration is properly configured",
          "2. Check that the furniture table exists with correct permissions",
          "3. Verify API routes are accessible",
          "4. Check browser console for additional error details",
        ],
  }

  console.log("🧪 Test Results:", report)

  return NextResponse.json(report, {
    status: allTestsPassed ? 200 : 500,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  })
}
