'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { PRODUCTS } from '@/lib/products'
import {
  LayoutDashboard, Package, Users, ShoppingBag, TrendingUp,
  Search, Eye, Edit3, CheckCircle, Clock, DollarSign, ArrowUpRight,
  Loader2, Bell, LogOut, Shield, Star, Menu, X, UserPlus, Trash2,
  UserCheck, UserCog, EyeOff, Settings, KeyRound, Save, AlertCircle,
} from 'lucide-react'

const AdminCharts = dynamic(() => import('./AdminCharts'), { ssr: false, loading: () => (
  <div className="grid lg:grid-cols-3 gap-6">
    {[1,2,3,4,5].map(i => <div key={i} className="card h-64 animate-pulse bg-zinc-800/50" />)}
  </div>
) })

const ADMIN_EMAIL = 'admin@gymsoul.pk'
const ADMIN_PASS  = 'admin123'

const DEMO_ORDERS = [
  { order_id:'GS1714001', created_at:new Date(Date.now()-1*3600000).toISOString(),   customer_name:'Ali Hassan',    customer_phone:'03001234567', customer_email:'ali@gmail.com',    city:'Lahore',     total:13999, status:'confirmed',  payment_method:'cod',    items:JSON.stringify([{name:'Whey Protein Gold',qty:1,price:13999}]) },
  { order_id:'GS1714002', created_at:new Date(Date.now()-3*3600000).toISOString(),   customer_name:'Ayesha Khan',   customer_phone:'03121234567', customer_email:'ayesha@gmail.com', city:'Karachi',    total:4549,  status:'processing', payment_method:'online', items:JSON.stringify([{name:'BCAA Energy Rush',qty:1,price:4549}]) },
  { order_id:'GS1714003', created_at:new Date(Date.now()-6*3600000).toISOString(),   customer_name:'Usman Malik',   customer_phone:'03211234567', customer_email:'usman@gmail.com',  city:'Islamabad',  total:19249, status:'shipped',    payment_method:'online', items:JSON.stringify([{name:'Whey Isolate Zero',qty:1,price:19249}]) },
  { order_id:'GS1714004', created_at:new Date(Date.now()-24*3600000).toISOString(),  customer_name:'Sara Ahmed',    customer_phone:'03311234567', customer_email:'sara@gmail.com',   city:'Faisalabad', total:6649,  status:'delivered',  payment_method:'cod',    items:JSON.stringify([{name:'Pre-Workout Ignite',qty:1,price:6649}]) },
  { order_id:'GS1714005', created_at:new Date(Date.now()-36*3600000).toISOString(),  customer_name:'Bilal Chaudhry',customer_phone:'03411234567', customer_email:'bilal@gmail.com',  city:'Rawalpindi', total:10499, status:'confirmed',  payment_method:'cod',    items:JSON.stringify([{name:'Casein Night Protein',qty:1,price:10499}]) },
  { order_id:'GS1714006', created_at:new Date(Date.now()-2*86400000).toISOString(),  customer_name:'Zara Siddiqui', customer_phone:'03511234567', customer_email:'zara@gmail.com',   city:'Multan',     total:3149,  status:'delivered',  payment_method:'online', items:JSON.stringify([{name:'Creatine Monohydrate',qty:1,price:3149}]) },
  { order_id:'GS1714007', created_at:new Date(Date.now()-3*86400000).toISOString(),  customer_name:'Hassan Raza',   customer_phone:'03061234567', customer_email:'hassan@gmail.com', city:'Lahore',     total:8749,  status:'delivered',  payment_method:'cod',    items:JSON.stringify([{name:'Mass Gainer Xtreme',qty:1,price:8749}]) },
  { order_id:'GS1714008', created_at:new Date(Date.now()-4*86400000).toISOString(),  customer_name:'Nida Fatima',   customer_phone:'03171234567', customer_email:'nida@gmail.com',   city:'Peshawar',   total:4199,  status:'cancelled',  payment_method:'online', items:JSON.stringify([{name:'Omega-3 Fish Oil',qty:1,price:4199}]) },
  { order_id:'GS1714009', created_at:new Date(Date.now()-5*86400000).toISOString(),  customer_name:'Kamran Shah',   customer_phone:'03231234567', customer_email:'kamran@gmail.com', city:'Quetta',     total:5249,  status:'delivered',  payment_method:'cod',    items:JSON.stringify([{name:'Multivitamin Elite',qty:1,price:5249}]) },
  { order_id:'GS1714010', created_at:new Date(Date.now()-6*86400000).toISOString(),  customer_name:'Sana Butt',     customer_phone:'03451234567', customer_email:'sana@gmail.com',   city:'Sialkot',    total:12249, status:'delivered',  payment_method:'online', items:JSON.stringify([{name:'TestoMax Pro',qty:1,price:12249}]) },
]

const ROLES = [
  { id: 'admin',   label: 'Admin',   desc: 'Full access to all features',          color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  { id: 'manager', label: 'Manager', desc: 'Orders, products & customer access',   color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  { id: 'support', label: 'Support', desc: 'View orders & update status only',     color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
]

const DEMO_STAFF = [
  { id:1, name:'Owner',        email:'admin@gymsoul.pk',    role:'admin',   status:'active', created_at: new Date(Date.now()-30*86400000).toISOString() },
  { id:2, name:'Hamza Tariq',  email:'hamza@gymsoul.pk',    role:'manager', status:'active', created_at: new Date(Date.now()-10*86400000).toISOString() },
  { id:3, name:'Zainab Noor',  email:'zainab@gymsoul.pk',   role:'support', status:'active', created_at: new Date(Date.now()-5*86400000).toISOString()  },
]

const STATUS_OPTIONS = ['confirmed','processing','shipped','delivered','cancelled']
const STATUS_COLOR = {
  confirmed:  'text-blue-400 bg-blue-400/10 border-blue-400/20',
  processing: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  shipped:    'text-purple-400 bg-purple-400/10 border-purple-400/20',
  delivered:  'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled:  'text-red-400 bg-red-400/10 border-red-400/20',
}

export default function AdminPage() {
  const [authed, setAuthed]           = useState(false)
  const [loginForm, setLoginForm]     = useState({ email: '', pass: '' })
  const [loginErr, setLoginErr]       = useState('')
  const [tab, setTab]                 = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [orders, setOrders]           = useState(DEMO_ORDERS)
  const [realCustomers, setRealCustomers] = useState([])
  const [orderSearch, setOrderSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingOrder, setUpdatingOrder] = useState(null)
  const [productSearch, setProductSearch] = useState('')
  const [staffUsers, setStaffUsers]       = useState(DEMO_STAFF)
  const [showAddUser, setShowAddUser]     = useState(false)
  const [showPass, setShowPass]           = useState(false)
  const [userForm, setUserForm]           = useState({ name:'', email:'', password:'', role:'manager' })
  const [userFormErr, setUserFormErr]     = useState('')
  const [userSaving, setUserSaving]       = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [passForm, setPassForm]           = useState({ current: '', newPass: '', confirm: '' })
  const [passErr, setPassErr]             = useState('')
  const [passSuccess, setPassSuccess]     = useState(false)
  const [passSaving, setPassSaving]       = useState(false)
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass]         = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const getAdminPass = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gymSoul_adminPass') || ADMIN_PASS
    }
    return ADMIN_PASS
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const currentPass = getAdminPass()
    if (loginForm.email === ADMIN_EMAIL && loginForm.pass === currentPass) {
      setAuthed(true)
      sessionStorage.setItem('GymSoul_admin', '1')
    } else {
      setLoginErr('Invalid admin credentials')
    }
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    setPassErr('')
    setPassSuccess(false)
    const currentPass = getAdminPass()
    if (!passForm.current || !passForm.newPass || !passForm.confirm) {
      setPassErr('Tamam fields fill karo')
      return
    }
    if (passForm.current !== currentPass) {
      setPassErr('Current password galat hai')
      return
    }
    if (passForm.newPass.length < 6) {
      setPassErr('Naya password kam az kam 6 characters ka hona chahiye')
      return
    }
    if (passForm.newPass !== passForm.confirm) {
      setPassErr('Naya password aur confirm password match nahi karte')
      return
    }
    if (passForm.newPass === ADMIN_PASS && passForm.current === ADMIN_PASS) {
      // Allow setting same as default, but still save
    }
    setPassSaving(true)
    setTimeout(() => {
      localStorage.setItem('gymSoul_adminPass', passForm.newPass)
      setPassForm({ current: '', newPass: '', confirm: '' })
      setPassSuccess(true)
      setPassSaving(false)
    }, 600)
  }

  useEffect(() => {
    if (sessionStorage.getItem('GymSoul_admin')) setAuthed(true)
  }, [])

  useEffect(() => {
    if (!authed) return
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data?.length) {
        setOrders(data)
        // Build unique customers list from real orders
        const customerMap = {}
        data.forEach(o => {
          const key = o.customer_email || o.customer_phone
          if (!key) return
          if (!customerMap[key]) {
            customerMap[key] = {
              name:       o.customer_name,
              email:      o.customer_email,
              phone:      o.customer_phone,
              city:       o.city,
              orders:     0,
              totalSpent: 0,
              lastOrder:  o.created_at,
            }
          }
          customerMap[key].orders += 1
          if (o.status !== 'cancelled') customerMap[key].totalSpent += (o.total || 0)
          if (new Date(o.created_at) > new Date(customerMap[key].lastOrder)) {
            customerMap[key].lastOrder = o.created_at
          }
        })
        setRealCustomers(Object.values(customerMap))
      }
    })
  }, [authed])

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId)
    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o))
    try { await supabase.from('orders').update({ status: newStatus }).eq('order_id', orderId) } catch(_){}
    setTimeout(() => setUpdatingOrder(null), 500)
  }

  const filteredOrders = orders.filter(o => {
    const matchSearch = !orderSearch ||
      o.order_id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_phone?.includes(orderSearch)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = orders.reduce((s, o) => o.status !== 'cancelled' ? s + (o.total || 0) : s, 0)
  const todayOrders  = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length
  const deliveredCnt = orders.filter(o => o.status === 'delivered').length
  const pendingCnt   = orders.filter(o => ['confirmed','processing','shipped'].includes(o.status)).length

  const STATS = [
    { icon: DollarSign,  label: 'Total Revenue',  value: `Rs.${totalRevenue.toLocaleString()}`, trend: '+18%', color: 'from-orange-500 to-orange-700',  glow: 'shadow-orange-500/20' },
    { icon: ShoppingBag, label: "Today's Orders",  value: todayOrders,                          trend: '+5%',  color: 'from-blue-500 to-blue-700',      glow: 'shadow-blue-500/20' },
    { icon: CheckCircle, label: 'Delivered',        value: deliveredCnt,                         trend: '+12%', color: 'from-green-500 to-green-700',    glow: 'shadow-green-500/20' },
    { icon: Clock,       label: 'Pending',          value: pendingCnt,                           trend: '',     color: 'from-yellow-500 to-yellow-700',  glow: 'shadow-yellow-500/20' },
  ]

  const handleAddUser = async (e) => {
    e.preventDefault()
    setUserFormErr('')
    if (!userForm.name || !userForm.email || !userForm.password) { setUserFormErr('Tamam fields fill karo'); return }
    if (userForm.password.length < 6) { setUserFormErr('Password kam az kam 6 characters ka hona chahiye'); return }
    if (staffUsers.find(u => u.email === userForm.email)) { setUserFormErr('Ye email pehle se exist karta hai'); return }
    setUserSaving(true)
    try {
      await supabase.auth.admin?.createUser({ email: userForm.email, password: userForm.password, email_confirm: true })
    } catch(_) {}
    const newUser = { id: Date.now(), name: userForm.name, email: userForm.email, role: userForm.role, status: 'active', created_at: new Date().toISOString() }
    setStaffUsers(prev => [...prev, newUser])
    setUserForm({ name:'', email:'', password:'', role:'manager' })
    setShowAddUser(false)
    setUserSaving(false)
  }

  const handleDeleteUser = (id) => {
    setStaffUsers(prev => prev.filter(u => u.id !== id))
    setDeleteConfirm(null)
  }

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 hero-pattern flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/30">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-zinc-400 text-sm mt-1">Gym Soul Nutritions " Owner Access</p>
          </div>
          <div className="card p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Admin Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@gymsoul.pk"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={loginForm.pass}
                  onChange={e => setLoginForm(f => ({ ...f, pass: e.target.value }))}
                  placeholder="********"
                  className="input"
                  required
                />
              </div>
              {loginErr && <p className="text-red-400 text-sm">{loginErr}</p>}
              <button type="submit" className="btn-primary w-full py-3.5">
                Login to Admin Panel
              </button>
            </form>
            <p className="text-center text-xs text-zinc-600 mt-4">Default: admin@gymsoul.pk / admin123</p>
          </div>
        </div>
      </div>
    )
  }

  const TABS = [
    { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
    { id: 'orders',    label: 'Orders',     icon: ShoppingBag, badge: pendingCnt },
    { id: 'products',  label: 'Products',   icon: Package },
    { id: 'customers', label: 'Customers',  icon: Users },
    { id: 'staff',     label: 'Staff Users',icon: UserCog },
    { id: 'settings',  label: 'Settings',   icon: Settings },
  ]

  // Customers tab computed values
  const displayCustomers = realCustomers.length > 0
    ? realCustomers
    : DEMO_ORDERS.map((o, i) => ({
        name: o.customer_name, email: o.customer_email, phone: o.customer_phone,
        city: o.city, orders: (i % 4) + 1,
        totalSpent: o.total * ((i % 3) + 1), lastOrder: o.created_at,
      }))
  const totalRevReal = realCustomers.reduce((s, c) => s + c.totalSpent, 0)
  const totalOrdersReal = displayCustomers.reduce((s, c) => s + c.orders, 0)
  const avgOrder = totalOrdersReal > 0 ? Math.round(totalRevReal / totalOrdersReal) : 8340
  const newThisMonth = realCustomers.filter(c => new Date(c.lastOrder) > new Date(Date.now() - 30 * 86400000)).length
  const repeatBuyers = realCustomers.length > 0
    ? Math.round(realCustomers.filter(c => c.orders > 1).length / realCustomers.length * 100)
    : 68

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} flex-shrink-0 bg-zinc-900 border-r border-zinc-800 fixed inset-y-0 left-0 flex flex-col transition-all duration-300 z-40`}>
        <div className={`p-4 border-b border-zinc-800 flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={15} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">GymSoul</p>
              <p className="text-orange-400 text-xs">Admin Panel</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center px-2'} py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title={!sidebarOpen ? t.label : undefined}
            >
              <t.icon size={17} className="flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{t.label}</span>
                  {t.badge > 0 && (
                    <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px]">{t.badge}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-zinc-800">
          <button
            onClick={() => { sessionStorage.removeItem('GymSoul_admin'); setAuthed(false) }}
            className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center px-2'} py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all`}
            title={!sidebarOpen ? 'Sign Out' : undefined}
          >
            <LogOut size={17} className="flex-shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`${sidebarOpen ? 'ml-56' : 'ml-16'} flex-1 min-h-screen transition-all duration-300`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
            <h2 className="text-white font-bold capitalize">{tab}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
              <Bell size={17} />
            </button>
            <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </div>
        </div>

        <div className="p-6">

          {/* --------- DASHBOARD --------- */}
          {tab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map(s => (
                  <div key={s.label} className={`card p-5 shadow-lg ${s.glow}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                        <s.icon size={18} className="text-white" />
                      </div>
                      {s.trend && (
                        <span className="flex items-center gap-0.5 text-xs text-green-400 font-medium">
                          <ArrowUpRight size={12} />{s.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <AdminCharts orders={orders} />

              {/* Recent orders */}
              <div className="card">
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                  <h3 className="text-white font-bold">Recent Orders</h3>
                  <button onClick={() => setTab('orders')} className="text-orange-400 text-xs hover:text-orange-300 transition-colors">View all ->'</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                        {['Order ID','Customer','Amount','Status','Payment','Date'].map(h => (
                          <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.order_id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 text-orange-400 font-mono text-xs">{o.order_id}</td>
                          <td className="px-4 py-3">
                            <p className="text-white font-medium">{o.customer_name}</p>
                            <p className="text-zinc-500 text-xs">{o.city}</p>
                          </td>
                          <td className="px-4 py-3 text-white font-semibold">Rs.{o.total?.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`badge border text-xs font-medium ${STATUS_COLOR[o.status] || STATUS_COLOR.confirmed}`}>{o.status}</span>
                          </td>
                          <td className="px-4 py-3 text-zinc-400 capitalize">{o.payment_method}</td>
                          <td className="px-4 py-3 text-zinc-500 text-xs">
                            {new Date(o.created_at).toLocaleDateString('en-PK',{day:'numeric',month:'short'})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --------- ORDERS --------- */}
          {tab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    placeholder="Search by order ID, name, phone..."
                    className="input pl-9 text-sm"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['all','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                        statusFilter === s ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
                      }`}
                    >
                      {s === 'all' ? 'All Orders' : s}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-zinc-500 text-sm">{filteredOrders.length} orders</p>

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-zinc-500 bg-zinc-900 border-b border-zinc-800">
                        {['Order ID','Customer','Items','Amount','Status','Payment','Update Status','Date'].map(h => (
                          <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => {
                        const items = JSON.parse(o.items || '[]')
                        return (
                          <tr key={o.order_id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-orange-400 font-mono text-xs">{o.order_id}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-white font-medium whitespace-nowrap">{o.customer_name}</p>
                              <p className="text-zinc-500 text-xs">{o.customer_phone}</p>
                              <p className="text-zinc-600 text-xs">{o.city}</p>
                            </td>
                            <td className="px-4 py-3">
                              <div className="max-w-[140px]">
                                {items.slice(0, 2).map((it, i) => (
                                  <p key={i} className="text-zinc-300 text-xs truncate">{it.name} x{it.qty}</p>
                                ))}
                                {items.length > 2 && <p className="text-zinc-600 text-xs">+{items.length-2} more</p>}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-white font-bold whitespace-nowrap">Rs.{o.total?.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className={`badge border text-xs font-medium ${STATUS_COLOR[o.status] || STATUS_COLOR.confirmed}`}>{o.status}</span>
                            </td>
                            <td className="px-4 py-3 text-zinc-400 capitalize text-xs">{o.payment_method}</td>
                            <td className="px-4 py-3">
                              <div className="relative">
                                <select
                                  value={o.status}
                                  onChange={e => updateOrderStatus(o.order_id, e.target.value)}
                                  className="text-xs bg-zinc-800 border border-zinc-700 text-white rounded-lg px-2 py-1.5 pr-6 appearance-none cursor-pointer hover:border-zinc-600 focus:outline-none focus:border-orange-500"
                                  disabled={updatingOrder === o.order_id}
                                >
                                  {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                                </select>
                                {updatingOrder === o.order_id && (
                                  <Loader2 size={12} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-orange-400" />
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                              {new Date(o.created_at).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'2-digit'})}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-zinc-500">No orders found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --------- PRODUCTS --------- */}
          {tab === 'products' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-xs">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="input pl-9 text-sm"
                  />
                </div>
                <button className="btn-primary text-sm">+ Add Product</button>
              </div>

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-zinc-500 bg-zinc-900 border-b border-zinc-800">
                        {['Product','Category','Price','Discount','Rating','Stock','Actions'].map(h => (
                          <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCTS
                        .filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase()))
                        .map(p => (
                          <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                                </div>
                                <div>
                                  <p className="text-white font-medium text-xs leading-snug max-w-[140px] line-clamp-2">{p.name}</p>
                                  <p className="text-zinc-500 text-xs">{p.brand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="badge bg-zinc-800 text-zinc-300 capitalize text-xs">{p.category}</span>
                            </td>
                            <td className="px-4 py-3 text-white font-semibold">Rs.{p.price.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="badge bg-green-500/10 text-green-400 border border-green-500/20">{p.discount}% off</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-white text-xs">{p.rating}</span>
                                <span className="text-zinc-600 text-xs">({p.reviews.toLocaleString()})</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-medium ${p.stock > 50 ? 'text-green-400' : p.stock > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {p.stock} units
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                                  <Eye size={14} />
                                </button>
                                <button className="p-1.5 text-zinc-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors">
                                  <Edit3 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMERS */}
          {tab === 'customers' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label:'Total Customers', value: realCustomers.length > 0 ? realCustomers.length : '250,000+', icon:Users,       color:'text-blue-400' },
                  { label:'New This Month',  value: realCustomers.length > 0 ? newThisMonth : '1,247',            icon:TrendingUp,  color:'text-green-400' },
                  { label:'Repeat Buyers',   value: realCustomers.length > 0 ? `${repeatBuyers}%` : '68%',        icon:CheckCircle, color:'text-orange-400' },
                  { label:'Avg Order Value', value: `Rs.${avgOrder.toLocaleString()}`,                             icon:DollarSign,  color:'text-purple-400' },
                ].map(s => (
                  <div key={s.label} className="card p-4">
                    <s.icon size={20} className={`${s.color} mb-2`} />
                    <p className="text-xl font-black text-white">{s.value}</p>
                    <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="card overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="text-white font-bold">
                    {realCustomers.length > 0 ? `${realCustomers.length} Real Customers` : 'Recent Customers (Demo)'}
                  </h3>
                  {realCustomers.length > 0 && (
                    <span className="badge bg-green-500/10 text-green-400 border border-green-500/20 text-xs">Live Data</span>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-zinc-500 bg-zinc-900 border-b border-zinc-800">
                        {['Customer','Contact','City','Orders','Total Spent','Last Order'].map(h => (
                          <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayCustomers.map((c, i) => (
                        <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {c.name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <p className="text-white font-medium text-sm">{c.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-zinc-300 text-xs">{c.email}</p>
                            <p className="text-zinc-500 text-xs">{c.phone}</p>
                          </td>
                          <td className="px-4 py-3 text-zinc-300 text-xs">{c.city}</td>
                          <td className="px-4 py-3 text-white font-semibold">{c.orders}</td>
                          <td className="px-4 py-3 text-white font-semibold">Rs.{c.totalSpent.toLocaleString()}</td>
                          <td className="px-4 py-3 text-zinc-500 text-xs">
                            {new Date(c.lastOrder).toLocaleDateString('en-PK',{day:'numeric',month:'short'})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --------- STAFF USERS --------- */}
          {tab === 'staff' && (
            <div className="space-y-6 animate-fade-in">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-lg">Staff Users</h2>
                  <p className="text-zinc-500 text-sm mt-0.5">Website manage karne wale users</p>
                </div>
                <button
                  onClick={() => { setShowAddUser(true); setUserFormErr('') }}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <UserPlus size={16} /> Add New User
                </button>
              </div>

              {/* Role legend */}
              <div className="grid sm:grid-cols-3 gap-4">
                {ROLES.map(r => (
                  <div key={r.id} className="card p-4 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.id==='admin'?'bg-red-500/15':'bg-orange-500/15'}`}>
                      {r.id === 'admin' ? <Shield size={16} className="text-red-400" /> :
                       r.id === 'manager' ? <UserCheck size={16} className="text-orange-400" /> :
                       <UserCog size={16} className="text-blue-400" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{r.label}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Users table */}
              <div className="card overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="text-white font-bold">{staffUsers.length} Staff Members</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-zinc-500 bg-zinc-900 border-b border-zinc-800">
                      {['User','Email','Role','Status','Added On','Actions'].map(h => (
                        <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staffUsers.map(u => {
                      const role = ROLES.find(r => r.id === u.role)
                      return (
                        <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                {u.name[0].toUpperCase()}
                              </div>
                              <p className="text-white font-medium">{u.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-300 text-xs">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`badge border text-xs font-medium capitalize ${role?.color || 'text-zinc-400 bg-zinc-800 border-zinc-700'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="badge bg-green-500/10 text-green-400 border border-green-500/20 text-xs">Active</span>
                          </td>
                          <td className="px-4 py-3 text-zinc-500 text-xs">
                            {new Date(u.created_at).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})}
                          </td>
                          <td className="px-4 py-3">
                            {u.id === 1 ? (
                              <span className="text-zinc-600 text-xs italic">Owner (protected)</span>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(u.id)}
                                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div className="space-y-6 animate-fade-in max-w-2xl">

              {/* Change Password */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <KeyRound size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Password Change Karo</h3>
                    <p className="text-zinc-500 text-sm">Admin panel ka password update karo</p>
                  </div>
                </div>

                {passSuccess && (
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-5">
                    <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                    <p className="text-green-400 text-sm font-medium">Password successfully change ho gaya!</p>
                  </div>
                )}

                {passErr && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
                    <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{passErr}</p>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block font-medium">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={passForm.current}
                        onChange={e => { setPassForm(f => ({ ...f, current: e.target.value })); setPassErr(''); setPassSuccess(false) }}
                        placeholder="Purana password dalein"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block font-medium">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={passForm.newPass}
                        onChange={e => { setPassForm(f => ({ ...f, newPass: e.target.value })); setPassErr(''); setPassSuccess(false) }}
                        placeholder="Naya password (min. 6 characters)"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block font-medium">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={passForm.confirm}
                        onChange={e => { setPassForm(f => ({ ...f, confirm: e.target.value })); setPassErr(''); setPassSuccess(false) }}
                        placeholder="Naya password dobara likho"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passSaving}
                    className="btn-primary flex items-center gap-2 mt-2"
                  >
                    {passSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {passSaving ? 'Saving...' : 'Password Save Karo'}
                  </button>
                </form>
              </div>

              {/* Admin info card */}
              <div className="card p-5">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-orange-400" /> Admin Account Info
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">Email</span>
                    <span className="text-white text-sm font-medium">admin@gymsoul.pk</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">Role</span>
                    <span className="badge bg-red-400/10 text-red-400 border border-red-400/20 text-xs">Admin (Owner)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-zinc-400 text-sm">Password Status</span>
                    <span className={`badge text-xs border ${
                      typeof window !== 'undefined' && localStorage.getItem('gymSoul_adminPass')
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {typeof window !== 'undefined' && localStorage.getItem('gymSoul_adminPass')
                        ? 'Custom Password Set'
                        : 'Default Password'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowAddUser(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
                  <UserPlus size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">New Staff User</h3>
                  <p className="text-zinc-500 text-xs">Website manager add karo</p>
                </div>
              </div>
              <button onClick={() => setShowAddUser(false)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block font-medium">Full Name *</label>
                <input
                  value={userForm.name}
                  onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Staff member ka naam"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block font-medium">Email Address *</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="staff@gymsoul.pk"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block font-medium">Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={userForm.password}
                    onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Minimum 6 characters"
                    className="input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block font-medium">Role *</label>
                <div className="space-y-2">
                  {ROLES.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setUserForm(f => ({ ...f, role: r.id }))}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        userForm.role === r.id
                          ? 'border-orange-500 bg-orange-500/5'
                          : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/30'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${userForm.role === r.id ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`} />
                      <div>
                        <p className="text-white text-sm font-medium">{r.label}</p>
                        <p className="text-zinc-500 text-xs">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {userFormErr && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">{userFormErr}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAddUser(false)} className="btn-secondary flex-1 py-3">
                  Cancel
                </button>
                <button type="submit" disabled={userSaving} className="btn-primary flex-1 py-3">
                  {userSaving ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Confirm Modal --- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-center text-lg mb-1">User Delete Karo?</h3>
            <p className="text-zinc-400 text-sm text-center mb-6">Ye action undo nahi ho sakta.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 py-3">Cancel</button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
