'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Package, Loader2, ChevronDown, ChevronUp, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'

const STATUS_CONFIG = {
  confirmed:  { label: 'Confirmed',   icon: CheckCircle, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  processing: { label: 'Processing',  icon: Clock,       color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  shipped:    { label: 'Shipped',     icon: Truck,       color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  delivered:  { label: 'Delivered',   icon: CheckCircle, color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  cancelled:  { label: 'Cancelled',   icon: XCircle,     color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

// Sample orders for demo
const DEMO_ORDERS = [
  {
    order_id: 'GS1714000001',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'shipped',
    total: 4098,
    payment_method: 'cod',
    city: 'Karachi',
    state: 'Maharashtra',
    items: JSON.stringify([
      { name: 'Whey Protein Gold', qty: 1, price: 3999, flavor: 'Chocolate', size: '1kg' },
      { name: 'Creatine Monohydrate', qty: 1, price: 99, flavor: 'Unflavored', size: '300g' },
    ]),
  },
  {
    order_id: 'GS1713000002',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    total: 1299,
    payment_method: 'online',
    city: 'Lahore',
    state: 'Lahore',
    items: JSON.stringify([{ name: 'BCAA Energy Rush', qty: 1, price: 1299, flavor: 'Watermelon', size: '500g' }]),
  },
]

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [fetching, setFetching] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading])

  useEffect(() => {
    if (!user) return
    const fetchOrders = async () => {
      try {
        // Fetch by user_id OR customer_email so guest orders also show up
        const { data: byId } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        const { data: byEmail } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', user.email)
          .order('created_at', { ascending: false })

        // Merge and deduplicate by order_id
        const merged = [...(byId || []), ...(byEmail || [])]
        const unique = merged.filter((o, idx, arr) => arr.findIndex(x => x.order_id === o.order_id) === idx)
        unique.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        setOrders(unique.length ? unique : DEMO_ORDERS)
      } catch {
        setOrders(DEMO_ORDERS)
      }
      setFetching(false)
    }
    fetchOrders()
  }, [user])

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-28 flex items-center justify-center">
        <Loader2 size={32} className="text-orange-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="section max-w-3xl">
        <h1 className="text-3xl font-black text-white mb-2">My Orders</h1>
        <p className="text-zinc-400 mb-8">{orders.length} orders total</p>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
            <p className="text-zinc-400 mb-6">Your orders will appear here after you shop</p>
            <Link href="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed
              const StatusIcon = status.icon
              const items = JSON.parse(order.items || '[]')
              const isOpen = expanded === i

              return (
                <div key={order.order_id} className="card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  {/* Header */}
                  <div
                    className="p-4 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpanded(isOpen ? null : i)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                        <Package size={18} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{order.order_id}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge border text-xs font-semibold ${status.color}`}>
                        <StatusIcon size={11} className="mr-1" />
                        {status.label}
                      </span>
                      <p className="text-white font-bold hidden sm:block">Rs.{order.total?.toLocaleString()}</p>
                      {isOpen ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="border-t border-zinc-800 p-4 animate-fade-in">
                      <div className="grid sm:grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">Order Total</p>
                          <p className="text-white font-bold">Rs.{order.total?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">Payment</p>
                          <p className="text-white">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">Delivery</p>
                          <p className="text-white">{order.city}, {order.state}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-zinc-400 text-xs mb-3 font-medium uppercase tracking-wider">Items</p>
                        <div className="space-y-2">
                          {items.map((item, j) => (
                            <div key={j} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                              <div>
                                <p className="text-white text-sm font-medium">{item.name}</p>
                                <p className="text-zinc-500 text-xs">
                                  Qty: {item.qty}
                                  {item.flavor && item.flavor !== 'Unflavored' && item.flavor !== 'N/A' && ` • ${item.flavor}`}
                                  {item.size && ` • ${item.size}`}
                                </p>
                              </div>
                              <p className="text-white font-semibold text-sm">Rs.{(item.price * item.qty).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status timeline */}
                      <div className="mt-4 flex items-center gap-2">
                        {['confirmed','processing','shipped','delivered'].map((s, si) => {
                          const statuses = ['confirmed','processing','shipped','delivered']
                          const currentIdx = statuses.indexOf(order.status)
                          const isDone = si <= currentIdx
                          return (
                            <div key={s} className="flex items-center flex-1">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isDone ? 'bg-orange-500' : 'bg-zinc-700'}`} />
                              {si < 3 && <div className={`flex-1 h-0.5 ${si < currentIdx ? 'bg-orange-500' : 'bg-zinc-700'}`} />}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between mt-1">
                        {['Confirmed','Processing','Shipped','Delivered'].map(s => (
                          <p key={s} className="text-[10px] text-zinc-600">{s}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
