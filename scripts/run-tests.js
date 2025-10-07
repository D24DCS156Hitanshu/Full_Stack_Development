// Node.js script to run automated tests
const https = require("https")
const http = require("http")

const runTests = async () => {
  console.log("🚀 Running automated furniture system tests...\n")

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const testUrl = `${baseUrl}/api/test`

  try {
    const response = await fetch(testUrl)
    const results = await response.json()

    console.log("📊 TEST RESULTS")
    console.log("================")
    console.log(`Status: ${results.status}`)
    console.log(`Timestamp: ${results.timestamp}`)
    console.log(`Tests Passed: ${results.summary.passed}/${results.summary.total}`)
    console.log(`Tests Failed: ${results.summary.failed}`)
    console.log("\n📋 RECOMMENDATIONS:")
    results.recommendations.forEach((rec) => console.log(rec))

    if (results.status === "FAILED") {
      console.log("\n❌ TESTS FAILED - Please fix the issues above")
      process.exit(1)
    } else {
      console.log("\n✅ ALL TESTS PASSED - Furniture system is working correctly!")
      process.exit(0)
    }
  } catch (error) {
    console.error("❌ Failed to run tests:", error.message)
    process.exit(1)
  }
}

runTests()
