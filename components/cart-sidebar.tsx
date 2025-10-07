"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Minus, Plus, Trash2, CreditCard } from "lucide-react"
import { getCart, removeFromCart, updateCartItemQuantity, type CartItem, type CartState } from "@/lib/cart"

interface CartSidebarProps {
  onCheckout: () => void
}

export function CartSidebar({ onCheckout }: CartSidebarProps) {
  const [cart, setCart] = useState<CartState>({ items: [], totalItems: 0, totalAmount: 0 })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setCart(getCart())

    // Listen for cart updates
    const handleStorageChange = () => {
      setCart(getCart())
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cart-updated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cart-updated", handleStorageChange)
    }
  }, [])

  const handleRemoveItem = (itemId: string) => {
    const updatedCart = removeFromCart(itemId)
    setCart(updatedCart)
    window.dispatchEvent(new Event("cart-updated"))
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
      return
    }

    const updatedCart = updateCartItemQuantity(itemId, newQuantity)
    setCart(updatedCart)
    window.dispatchEvent(new Event("cart-updated"))
  }

  const formatDimensions = (width: number, height: number, depth: number) => {
    const inchesToFeetAndInches = (inches: number) => {
      const feet = Math.floor(inches / 12)
      const remainingInches = inches % 12
      if (feet === 0) return `${remainingInches}"`
      if (remainingInches === 0) return `${feet}'`
      return `${feet}' ${remainingInches}"`
    }
    return `${inchesToFeetAndInches(width)} × ${inchesToFeetAndInches(height)} × ${inchesToFeetAndInches(depth)}`
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart
          {cart.totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({cart.totalItems} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600">Your cart is empty</p>
                <p className="text-sm text-slate-500 mt-2">Add some furniture to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    formatDimensions={formatDimensions}
                  />
                ))}
              </div>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{cart.totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (18% GST):</span>
                  <span>₹{(cart.totalAmount * 0.18).toLocaleString("en-IN")}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>₹{(cart.totalAmount * 1.18).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                size="lg"
                onClick={() => {
                  setIsOpen(false)
                  onCheckout()
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function CartItemCard({
  item,
  onRemove,
  onUpdateQuantity,
  formatDimensions,
}: {
  item: CartItem
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  formatDimensions: (width: number, height: number, depth: number) => string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold capitalize">{item.category}</h3>
            <p className="text-sm text-slate-600 capitalize">{item.material} Wood</p>
            <p className="text-xs text-slate-500">
              {formatDimensions(item.dimensions.width, item.dimensions.height, item.dimensions.depth)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-right">
            <p className="font-semibold">₹{item.totalPrice.toLocaleString("en-IN")}</p>
            <p className="text-xs text-slate-500">₹{item.unitPrice.toLocaleString("en-IN")} each</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {item.finish}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {item.color}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
