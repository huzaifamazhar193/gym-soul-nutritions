'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('GymSoul_cart')
    const savedWish = localStorage.getItem('GymSoul_wishlist')
    if (saved) setCart(JSON.parse(saved))
    if (savedWish) setWishlist(JSON.parse(savedWish))
  }, [])

  useEffect(() => {
    localStorage.setItem('GymSoul_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('GymSoul_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToCart = (product, qty = 1, flavor = null, size = null) => {
    setCart(prev => {
      const key = `${product.id}-${flavor}-${size}`
      const existing = prev.find(i => `${i.id}-${i.selectedFlavor}-${i.selectedSize}` === key)
      if (existing) {
        toast.success('Cart updated!')
        return prev.map(i =>
          `${i.id}-${i.selectedFlavor}-${i.selectedSize}` === key
            ? { ...i, qty: i.qty + qty }
            : i
        )
      }
      toast.success(`${product.name} added to cart!`)
      return [...prev, { ...product, qty, selectedFlavor: flavor, selectedSize: size }]
    })
  }

  const removeFromCart = (id, flavor, size) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedFlavor === flavor && i.selectedSize === size)))
    toast.success('Removed from cart')
  }

  const updateQty = (id, flavor, size, qty) => {
    if (qty < 1) return
    setCart(prev => prev.map(i =>
      i.id === id && i.selectedFlavor === flavor && i.selectedSize === size
        ? { ...i, qty }
        : i
    ))
  }

  const clearCart = () => setCart([])

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        toast.success('Removed from wishlist')
        return prev.filter(i => i.id !== product.id)
      }
      toast.success('Added to wishlist!')
      return [...prev, product]
    })
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{
      cart, wishlist, cartTotal, cartCount,
      addToCart, removeFromCart, updateQty, clearCart, toggleWishlist,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
