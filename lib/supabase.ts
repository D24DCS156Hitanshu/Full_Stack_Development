import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Use fallback values for development/preview environments
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key"

export function createClient() {
  // Check if we have valid Supabase credentials
  const hasValidCredentials = supabaseUrl !== "https://demo.supabase.co" && supabaseAnonKey !== "demo-key"

  if (!hasValidCredentials) {
    console.warn("Supabase credentials not found. Using demo mode.")
    // Return a mock client for demo purposes
    return createMockSupabaseClient()
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Simplify the mock Supabase client to always succeed
function createMockSupabaseClient() {
  return {
    auth: {
      signUp: async ({ email, password, options }: any) => {
        // Simple email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return {
            data: { user: null },
            error: { message: "Please enter a valid email address" },
          }
        }

        if (password.length < 6) {
          return {
            data: { user: null },
            error: { message: "Password must be at least 6 characters long" },
          }
        }

        // Simulate successful signup
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return {
          data: {
            user: {
              id: "demo-user-id",
              email,
              user_metadata: {
                ...options?.data,
                email_type: "verified",
              },
            },
          },
          error: null,
        }
      },
      signInWithPassword: async ({ email, password }: any) => {
        // Simple email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return {
            data: { user: null },
            error: { message: "Please enter a valid email address" },
          }
        }

        // Simulate successful signin
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return {
          data: {
            user: {
              id: "demo-user-id",
              email,
              user_metadata: {
                full_name: "Demo User",
                email_type: "verified",
              },
            },
          },
          error: null,
        }
      },
      signInWithOAuth: async ({ provider, options }: any) => {
        if (provider === "google") {
          // Simulate Google OAuth flow
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // Simulate successful Google login
          const mockGoogleUser = {
            id: "google-demo-user-id",
            email: "user@gmail.com",
            user_metadata: {
              full_name: "Google Demo User",
              email_type: "google",
              provider: "google",
              avatar_url: "https://lh3.googleusercontent.com/a/default-user",
            },
          }

          // Store in localStorage for demo
          localStorage.setItem("demo-user", JSON.stringify(mockGoogleUser))

          // Redirect to customize page
          window.location.href = options?.redirectTo || "/customize"

          return { data: { user: mockGoogleUser }, error: null }
        }

        return { error: new Error("OAuth provider not supported in demo mode") }
      },
      signOut: async () => {
        localStorage.removeItem("demo-user")
        return { error: null }
      },
      getUser: async () => {
        // Check if user is "logged in" in demo mode
        const demoUser = localStorage.getItem("demo-user")
        if (demoUser) {
          return {
            data: {
              user: JSON.parse(demoUser),
            },
          }
        }
        return { data: { user: null } }
      },
      onAuthStateChange: (callback: any) => {
        // Mock auth state change listener
        const demoUser = localStorage.getItem("demo-user")
        if (demoUser) {
          setTimeout(() => {
            callback("SIGNED_IN", { user: JSON.parse(demoUser) })
          }, 100)
        }

        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }
      },
    },
    from: (table: string) => ({
      insert: async (data: any) => {
        console.log("Mock insert to", table, data)
        return { data: [{ id: "demo-id", ...data[0] }], error: null }
      },
      select: async () => {
        console.log("Mock select from", table)
        return { data: [], error: null }
      },
    }),
  }
}
