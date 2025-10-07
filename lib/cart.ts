import { safeLocalStorage } from "./safe-utils"

export interface CartItem {
  id: string
  category: string
  material: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  finish: string
  color: string
  quantity: number
  priceBreakdown: {
    baseCost: number
    materialCost: number
    laborCost: number
    finishCost: number
    total: number
  }
  unitPrice: number
  totalPrice: number
  addedAt: Date
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

const storage = safeLocalStorage()
const CART_KEY = "woodora-cart"

// Cart management functions
export const getCart = (): CartState => {
  if (!storage.isAvailable) {
    return { items: [], totalItems: 0, totalAmount: 0 }
  }

  const cartData = storage.getItem(CART_KEY)
  if (!cartData) {
    return { items: [], totalItems: 0, totalAmount: 0 }
  }

  try {
    const cart = JSON.parse(cartData)
    return {
      items: cart.items || [],
      totalItems: cart.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0,
      totalAmount: cart.items?.reduce((sum: number, item: CartItem) => sum + item.totalPrice, 0) || 0,
    }
  } catch {
    return { items: [], totalItems: 0, totalAmount: 0 }
  }
}

export const addToCart = (item: Omit<CartItem, "id" | "addedAt">): CartState => {
  const cart = getCart()
  const newItem: CartItem = {
    ...item,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    addedAt: new Date(),
  }

  const updatedCart = {
    items: [...cart.items, newItem],
    totalItems: cart.totalItems + item.quantity,
    totalAmount: cart.totalAmount + item.totalPrice,
  }

  storage.setItem(CART_KEY, JSON.stringify(updatedCart))
  return updatedCart
}

export const removeFromCart = (itemId: string): CartState => {
  const cart = getCart()
  const itemToRemove = cart.items.find((item) => item.id === itemId)

  if (!itemToRemove) return cart

  const updatedCart = {
    items: cart.items.filter((item) => item.id !== itemId),
    totalItems: cart.totalItems - itemToRemove.quantity,
    totalAmount: cart.totalAmount - itemToRemove.totalPrice,
  }

  storage.setItem(CART_KEY, JSON.stringify(updatedCart))
  return updatedCart
}

export const updateCartItemQuantity = (itemId: string, newQuantity: number): CartState => {
  const cart = getCart()
  const itemIndex = cart.items.findIndex((item) => item.id === itemId)

  if (itemIndex === -1 || newQuantity <= 0) return cart

  const item = cart.items[itemIndex]
  const quantityDiff = newQuantity - item.quantity
  const unitPrice = item.totalPrice / item.quantity

  const updatedItem = {
    ...item,
    quantity: newQuantity,
    totalPrice: unitPrice * newQuantity,
  }

  const updatedItems = [...cart.items]
  updatedItems[itemIndex] = updatedItem

  const updatedCart = {
    items: updatedItems,
    totalItems: cart.totalItems + quantityDiff,
    totalAmount: cart.totalAmount + unitPrice * quantityDiff,
  }

  storage.setItem(CART_KEY, JSON.stringify(updatedCart))
  return updatedCart
}

export const clearCart = (): CartState => {
  const emptyCart = { items: [], totalItems: 0, totalAmount: 0 }
  storage.setItem(CART_KEY, JSON.stringify(emptyCart))
  return emptyCart
}
