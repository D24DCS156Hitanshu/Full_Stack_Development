"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Palette, Calculator, Zap, Star, Users, Award, Eye } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ErrorBoundary } from "@/components/error-boundary"

function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setIsVisible(true)
  }, [])

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Woodora</span>
          </div>
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-4 border-amber-600 border-t-transparent rounded-full"></div>
          <p className="text-slate-600">Loading your furniture experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Woodora</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
                How it Works
              </a>
              <a href="#gallery" className="text-slate-600 hover:text-slate-900 transition-colors">
                Gallery
              </a>
              <Link href="/listings" className="text-slate-600 hover:text-slate-900 transition-colors">
                Ready-Made
              </Link>
              <Button asChild>
                <Link href="/customize">Start Customizing</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Craft & Estimate
              <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Your Dream Furniture
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant price estimates for custom wooden furniture with our AI-powered tool. Visualize, customize,
              and order your perfect pieces with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                asChild
              >
                <Link href="/customize">
                  Start Customizing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <a href="#gallery">View Gallery</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Woodora?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of wooden furniture shopping with our innovative platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calculator className="h-8 w-8 text-amber-600" />}
              title="Instant Price Estimation"
              description="Get accurate pricing for custom wooden furniture in real-time based on materials, dimensions, and complexity."
              delay={0}
            />
            <FeatureCard
              icon={<Palette className="h-8 w-8 text-orange-600" />}
              title="3D Wood Visualization"
              description="Visualize your furniture with our interactive 3D customization tool. Change wood types, stains, and dimensions."
              delay={200}
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-green-600" />}
              title="Lightning Fast"
              description="Our optimized platform delivers instant results, so you can make decisions quickly and confidently."
              delay={400}
            />
            <FeatureCard
              icon={<Eye className="h-8 w-8 text-blue-600" />}
              title="Ready-Made Collection"
              description="Browse our curated collection of pre-designed furniture with AR/VR preview capabilities."
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <StatCard number="10,000+" label="Happy Customers" icon={<Users className="h-8 w-8" />} />
            <StatCard number="50,000+" label="Furniture Pieces" icon={<Award className="h-8 w-8" />} />
            <StatCard number="4.9/5" label="Customer Rating" icon={<Star className="h-8 w-8" />} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple steps to get your perfect wooden furniture estimate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step="01"
              title="Choose Your Furniture"
              description="Select from our wide range of wooden furniture categories including sofas, tables, chairs, and more."
            />
            <StepCard
              step="02"
              title="Customize & Visualize"
              description="Adjust dimensions, wood types, stains, and finishes. See your changes in real-time 3D preview."
            />
            <StepCard
              step="03"
              title="Get Instant Quote"
              description="Receive accurate pricing instantly and place your order with confidence."
            />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Wooden Furniture Gallery</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our collection of beautifully crafted wooden furniture pieces
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GalleryCard
              image="/placeholder.svg?height=400&width=600&text=Modern+Wooden+Sofa"
              title="Modern Wooden Sofa Collection"
              description="Comfortable and stylish wooden sofas for your living room"
              category="Sofas"
            />
            <GalleryCard
              image="/placeholder.svg?height=400&width=600&text=Wooden+Dining+Table"
              title="Wooden Dining Tables"
              description="Elegant wooden dining tables for family gatherings"
              category="Tables"
            />
            <GalleryCard
              image="/placeholder.svg?height=400&width=600&text=Wooden+Office+Chair"
              title="Wooden Office Chairs"
              description="Ergonomic wooden chairs for productivity and comfort"
              category="Chairs"
            />
            <GalleryCard
              image="/placeholder.svg?height=400&width=600&text=Wooden+Bedroom+Set"
              title="Wooden Bedroom Sets"
              description="Complete wooden bedroom furniture for restful nights"
              category="Beds"
            />
            <GalleryCard
              image="/placeholder.svg?height=400&width=600&text=Wooden+Storage"
              title="Wooden Storage Solutions"
              description="Wooden dressers and wardrobes for organized living"
              category="Storage"
            />
            <GalleryCard
              image="/placeholder.svg?height=400&width=600&text=Wooden+Bookshelf"
              title="Wooden Bookshelves"
              description="Display your books and decorative items on wooden shelves"
              category="Shelving"
            />
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent"
              asChild
            >
              <Link href="/customize">
                Customize Your Furniture <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Create Your Perfect Wooden Furniture?</h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of satisfied customers who trust Woodora for their custom wooden furniture needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              asChild
            >
              <Link href="/customize">
                Start Customizing <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/listings">Browse Ready-Made</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="text-xl font-bold">Woodora</span>
              </div>
              <p className="text-slate-400">The future of wooden furniture customization and pricing.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <Link href="/customize" className="hover:text-white transition-colors">
                    Customizer
                  </Link>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-white transition-colors">
                    Gallery
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Woodora. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* NoScript fallback */}
      <noscript>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">JavaScript Required</h2>
            <p className="text-slate-600 mb-4">
              This application requires JavaScript to function properly. Please enable JavaScript in your browser
              settings.
            </p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </div>
      </noscript>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Card
      className={`transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <CardContent className="p-8 text-center">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

function StatCard({ number, label, icon }: { number: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-xl opacity-90">{label}</div>
    </div>
  )
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">
        {step}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}

function GalleryCard({
  image,
  title,
  description,
  category,
}: {
  image: string
  title: string
  description: string
  category: string
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className={`w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true)
            setIsLoaded(true)
          }}
          loading="lazy"
        />
        {hasError && (
          <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
            <div className="text-slate-400 text-center">
              <div className="text-4xl mb-2">🪑</div>
              <div className="text-sm">{category}</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 hover:bg-white">{category}</Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 mb-4">{description}</p>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto font-medium text-amber-600 hover:text-amber-700"
          asChild
        >
          <Link href="/customize">
            Customize Now <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  return (
    <ErrorBoundary>
      <HomePage />
    </ErrorBoundary>
  )
}
