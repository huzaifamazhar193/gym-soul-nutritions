'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react'
import { useState } from 'react'

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SOULFIRST') {
      setDiscount(Math.round(cartTotal * 0.10))
      setCouponMsg('10% discount applied!')
    } else if (coupon.toUpperCase() === 'SAVE15') {
      setDiscount(Math.round(cartTotal * 0.15))
      setCouponMsg('15% discount applied!')
    } else {
      setDiscount(0)
      setCouponMsg('Invalid coupon code')
    }
  }

  const shipping = cartTotal > 3499 ? 0 : 350
  const finalTotal = cartTotal - discount + shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} className="text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
          <p className="text-zinc-400 mb-8">Add some awesome supplements to your cart!</p>
          <Link href="/products" className="btn-primary px-8 py-4">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">My Cart</h1>
            <p className="text-zinc-400 mt-1">{cart.reduce((s,i) => s + i.qty, 0)} items</p>
          </div>
          <button onClick={clearCart} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            <Trash2 size={14} /> Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedFlavor}-${item.selectedSize}`} className="card p-4 flex gap-4 animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-orange-400 font-medium">{item.brand}</p>
                  <h3 className="text-white font-semibold text-sm leading-snug mt-0.5">{item.name}</h3>
                  {(item.selectedFlavor && item.selectedFlavor !== 'Unflavored' && item.selectedFlavor !== 'N/A') && (
                    <p className="text-zinc-500 text-xs mt-1">Flavor: {item.selectedFlavor}</p>
                  )}
                  {item.selectedSize && (
                    <p className="text-zinc-500 text-xs">Size: {item.selectedSize}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQty(item.id, item.selectedFlavor, item.selectedSize, item.qty - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-white text-sm font-semibold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.selectedFlavor, item.selectedSize, item.qty + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">Rs.{(item.price * item.qty).toLocaleString()}</p>
                      <p className="text-zinc-500 text-xs">Rs.{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.selectedFlavor, item.selectedSize)}
                  className="flex-shrink-0 p-2 text-zinc-600 hover:text-red-400 transition-colors self-start"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="card p-4">
              <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Tag size={15} className="text-orange-400" /> Apply Coupon
              </p>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="input text-sm py-2"
                />
                <button onClick={applyCoupon} className="btn-primary py-2 px-4 text-sm flex-shrink-0">
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-2 ${discount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {couponMsg}
                </p>
              )}
              <p className="text-xs text-zinc-500 mt-2">Try: SOULFIRST (10%) or SAVE15 (15%)</p>
            </div>

            {/* Summary */}
            <div className="card p-5">
              <h3 className="text-base font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({cart.reduce((s,i) => s + i.qty, 0)} items)</span>
                  <span className="text-white">Rs.{cartTotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-Rs.{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1.5"><Truck size={14} /> Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400 font-medium' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : `Rs.${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-zinc-500">Add Rs.{(999 - cartTotal + discount).toLocaleString()} more for free shipping</p>
                )}
                <div className="h-px bg-zinc-800" />
                <div className="flex justify-between text-white font-bold text-base">
                  <span>Total</span>
                  <span>Rs.{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary w-full mt-5 py-4">
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
              <Link href="/products" className="btn-ghost w-full mt-2 text-sm justify-center">
                Continue Shopping
              </Link>
            </div>

            {/* Free shipping banner */}
            {shipping === 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <Truck size={18} className="text-green-400" />
                <p className="text-green-400 text-sm font-medium">You qualify for FREE delivery!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
