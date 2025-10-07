import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Woodora - Custom Wooden Furniture Price Estimator",
  description:
    "Get instant price estimates for custom wooden furniture with our AI-powered tool. Visualize, customize, and order your perfect pieces with confidence.",
  keywords: "wooden furniture, custom furniture, price estimator, 3D visualization, AR, VR",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f59e0b" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div id="root">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
