"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react"
import { getCart, clearCart, type CartState } from "@/lib/cart"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [cart, setCart] = useState<CartState>({ items: [], totalItems: 0, totalAmount: 0 })

  // Add useEffect to load cart data when modal opens
  useEffect(() => {
    if (isOpen) {
      const currentCart = getCart()
      setCart(currentCart)
    }
  }, [isOpen])
  const [currentStep, setCurrentStep] = useState<"details" | "payment" | "success">("details")
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "wallet">("card")

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    upiId: "",
    bankName: "",
  })

  const subtotal = cart.totalAmount
  const tax = subtotal * 0.18
  const shipping = 0
  const total = subtotal + tax + shipping

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setLoading(false)
    setCurrentStep("success")

    // Clear cart after successful payment
    clearCart()
    setCart({ items: [], totalItems: 0, totalAmount: 0 })
    window.dispatchEvent(new Event("cart-updated"))
  }

  const handleClose = () => {
    if (currentStep === "success") {
      setCurrentStep("details")
      setCustomerDetails({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      })
      setPaymentDetails({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
        upiId: "",
        bankName: "",
      })
    }
    onClose()
  }

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", label: "UPI Payment", icon: Smartphone },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
    { id: "wallet", label: "Digital Wallet", icon: Wallet },
  ]

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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentStep === "details" && (
              <>
                <User className="h-5 w-5" />
                Customer Details
              </>
            )}
            {currentStep === "payment" && (
              <>
                <CreditCard className="h-5 w-5" />
                Payment Information
              </>
            )}
            {currentStep === "success" && (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Order Confirmed
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {currentStep === "details" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={customerDetails.address}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                      placeholder="Street address, apartment, suite, etc."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={customerDetails.city}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={customerDetails.state}
                        onValueChange={(value) => setCustomerDetails({ ...customerDetails, state: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                          <SelectItem value="west-bengal">West Bengal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={customerDetails.pincode}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, pincode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-slate-600">No items in cart</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium capitalize">{item.category}</h4>
                          <p className="text-sm text-slate-600 capitalize">{item.material} Wood</p>
                          <p className="text-xs text-slate-500">
                            {formatDimensions(item.dimensions.width, item.dimensions.height, item.dimensions.depth)}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {item.finish}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {item.color}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.totalPrice.toLocaleString("en-IN")}</p>
                          <p className="text-xs text-slate-500">₹{item.unitPrice.toLocaleString("en-IN")} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST):</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Badge className="w-full justify-center py-2">Estimated Delivery: 4-6 weeks</Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "payment" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <Button
                        key={method.id}
                        variant={paymentMethod === method.id ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => setPaymentMethod(method.id as any)}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-xs">{method.label}</span>
                      </Button>
                    )
                  })}
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {paymentMethod === "card" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name *</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={paymentDetails.cardName}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentDetails.expiryDate}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID *</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@paytm"
                        value={paymentDetails.upiId}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Select Bank *</Label>
                      <Select
                        value={paymentDetails.bankName}
                        onValueChange={(value) => setPaymentDetails({ ...paymentDetails, bankName: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sbi">State Bank of India</SelectItem>
                          <SelectItem value="hdfc">HDFC Bank</SelectItem>
                          <SelectItem value="icici">ICICI Bank</SelectItem>
                          <SelectItem value="axis">Axis Bank</SelectItem>
                          <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                          <SelectItem value="pnb">Punjab National Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {paymentMethod === "wallet" && (
                    <div className="space-y-2">
                      <Label>Select Wallet *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paytm">Paytm</SelectItem>
                          <SelectItem value="phonepe">PhonePe</SelectItem>
                          <SelectItem value="googlepay">Google Pay</SelectItem>
                          <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("details")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${total.toLocaleString("en-IN")}`
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-slate-500" />
                    <div>
                      <p className="font-medium">Shipping Address</p>
                      <p className="text-sm text-slate-600">
                        {customerDetails.name}
                        <br />
                        {customerDetails.address}
                        <br />
                        {customerDetails.city}, {customerDetails.state} {customerDetails.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <p className="text-sm">{customerDetails.phone}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <p className="text-sm">{customerDetails.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Items ({cart.totalItems})</h4>
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="capitalize">
                        {item.category} ({item.quantity}x)
                      </span>
                      <span>₹{item.totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST):</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "success" && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
            <p className="text-slate-600 mb-6">Thank you for your purchase. Your order has been successfully placed.</p>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono">#WD{Date.now().toString().slice(-6)}</span>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-left">Items Ordered:</h4>
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="text-left">
                          <p className="capitalize font-medium">{item.category}</p>
                          <p className="text-slate-600 capitalize">
                            {item.material} Wood - {item.finish} - {item.color}
                          </p>
                          <p className="text-slate-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">₹{item.totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount Paid:</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Delivery:</span>
                    <span>4-6 weeks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-slate-500 mt-4">
              You will receive an email confirmation shortly with tracking details.
            </p>

            <Button
              onClick={handleClose}
              className="mt-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
