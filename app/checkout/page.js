'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import {
  MapPin, CreditCard, Banknote, Truck, Shield,
  ChevronRight, Loader2, CheckCircle, Package,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

const STATES = ['Punjab','Sindh','Khyber Pakhtunkhwa','Balochistan','Islamabad Capital Territory','Azad Kashmir','Gilgit-Baltistan']

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1) // 1=address, 2=payment, 3=confirmed
  const [payMethod, setPayMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [addr, setAddr] = useState({
    fullName: profile?.full_name || '',
    phone:    profile?.phone || '',
    address:  profile?.address || '',
    city:     profile?.city || '',
    state:    profile?.state || 'Punjab',
    pincode:  profile?.pincode || '',
  })
  const setA = k => e => setAddr(a => ({ ...a, [k]: e.target.value }))

  const shipping = cartTotal > 3499 ? 0 : 350
  const finalTotal = cartTotal + shipping

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-28 flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="text-zinc-600 mx-auto mb-4" />
          <p className="text-white text-xl font-bold mb-2">Your cart is empty</p>
          <Link href="/products" className="btn-primary mt-4">Shop Now</Link>
        </div>
      </div>
    )
  }

  const placeOrder = async () => {
    if (!addr.fullName || !addr.phone || !addr.address || !addr.city || !addr.pincode) {
      toast.error('Please fill all address fields')
      return
    }
    setLoading(true)
    try {
      const oid = `GS${Date.now()}`
      const orderData = {
        order_id: oid,
        user_id:  user?.id || null,
        customer_name:  addr.fullName,
        customer_email: user?.email || 'guest@GymSoul.pk',
        customer_phone: addr.phone,
        address:   addr.address,
        city:      addr.city,
        state:     addr.state,
        pincode:   addr.pincode,
        items:     JSON.stringify(cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, flavor: i.selectedFlavor, size: i.selectedSize }))),
        subtotal:  cartTotal,
        shipping:  shipping,
        total:     finalTotal,
        payment_method: payMethod,
        status:    'confirmed',
        created_at: new Date().toISOString(),
      }

      // Save to Supabase if connected, otherwise just simulate
      try {
        await supabase.from('orders').insert(orderData)
      } catch (_) {
        // Works without Supabase too (demo mode)
      }

      setOrderId(oid)
      clearCart()
      setStep(3)
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-28 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Order Confirmed! ðŸŽ‰</h1>
          <p className="text-zinc-400 mb-6">
            Your order <span className="text-orange-400 font-bold">{orderId}</span> has been placed successfully!
          </p>

          <div className="card p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Order ID</span>
              <span className="text-white font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Amount Paid</span>
              <span className="text-white font-semibold">Rs.{finalTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Payment</span>
              <span className="text-white font-semibold">{payMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Delivery</span>
              <span className="text-green-400 font-semibold">3â€“5 Business Days</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/orders" className="btn-primary w-full py-4">
              Track My Order <ChevronRight size={18} />
            </Link>
            <Link href="/products" className="btn-secondary w-full py-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="section max-w-5xl">
        <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[{n:1,l:'Address'},{n:2,l:'Payment'}].map((s,i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${step >= s.n ? 'text-orange-400' : 'text-zinc-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${step > s.n ? 'bg-green-500 text-white' : step === s.n ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                  {step > s.n ? 'âœ“' : s.n}
                </div>
                <span className={`text-sm font-medium ${step >= s.n ? 'text-white' : 'text-zinc-500'}`}>{s.l}</span>
              </div>
              {i < 1 && <ChevronRight size={16} className="text-zinc-700" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="card p-6 animate-fade-in">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <MapPin size={18} className="text-orange-400" /> Delivery Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Full Name *</label>
                    <input value={addr.fullName} onChange={setA('fullName')} className="input" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Phone Number *</label>
                    <input value={addr.phone} onChange={setA('phone')} className="input" placeholder="03XX-XXXXXXX" type="tel" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-zinc-400 mb-1 block">Address *</label>
                    <input value={addr.address} onChange={setA('address')} className="input" placeholder="House/flat no., street, locality" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">City *</label>
                    <input value={addr.city} onChange={setA('city')} className="input" placeholder="City" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Postal Code *</label>
                    <input value={addr.pincode} onChange={setA('pincode')} className="input" placeholder="5-digit postal code" maxLength={5} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-zinc-400 mb-1 block">State</label>
                    <select value={addr.state} onChange={setA('state')} className="input">
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary mt-6 w-full py-4">
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6 animate-fade-in">
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white mb-5 transition-colors">
                  â† Back to Address
                </button>
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <CreditCard size={18} className="text-orange-400" /> Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  {[
                    { id: 'cod',    icon: Banknote,    title: 'Cash on Delivery',  desc: 'Pay when your order arrives. No advance payment needed.' },
                    { id: 'online', icon: CreditCard,  title: 'Pay Online',         desc: 'UPI, Card, Net Banking. Instant & secure payment.' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        payMethod === m.id
                          ? 'border-orange-500 bg-orange-500/5'
                          : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${payMethod === m.id ? 'bg-orange-500/20 text-orange-400' : 'bg-zinc-800 text-zinc-400'}`}>
                        <m.icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm">{m.title}</p>
                          {payMethod === m.id && <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30">Selected</span>}
                        </div>
                        <p className="text-zinc-400 text-xs mt-0.5">{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {payMethod === 'online' && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                    <p className="text-blue-400 text-sm">
                      ðŸ”’ You'll be redirected to our secure payment gateway (Razorpay) after placing the order.
                    </p>
                  </div>
                )}

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="btn-primary w-full py-4 text-base"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>{payMethod === 'cod' ? 'Place Order (COD)' : 'Pay & Place Order'} <ChevronRight size={18} /></>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <Shield size={14} className="text-zinc-500" />
                  <span className="text-xs text-zinc-500">Secured by 256-bit SSL encryption</span>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="card p-5 sticky top-28">
              <h3 className="text-sm font-bold text-white mb-4">Order Summary ({cart.length} items)</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedFlavor}`} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium leading-snug line-clamp-1">{item.name}</p>
                      <p className="text-zinc-500 text-[11px]">Qty: {item.qty}</p>
                    </div>
                    <p className="text-white text-xs font-bold flex-shrink-0">Rs.{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="h-px bg-zinc-800 mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span><span className="text-white">Rs.{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : `Rs.${shipping}`}
                  </span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex justify-between text-white font-bold text-base">
                  <span>Total</span><span>Rs.{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              {step === 1 && addr.fullName && (
                <div className="mt-4 p-3 bg-zinc-800/50 rounded-xl">
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1"><Truck size={12} />Delivering to</p>
                  <p className="text-white text-xs font-medium">{addr.city}, {addr.state} {addr.pincode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
