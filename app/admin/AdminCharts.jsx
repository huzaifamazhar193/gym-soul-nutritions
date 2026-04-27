'use client'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const REVENUE_DATA = [
  { day:'Mon', revenue:18500, orders:3 },
  { day:'Tue', revenue:24300, orders:5 },
  { day:'Wed', revenue:15800, orders:2 },
  { day:'Thu', revenue:31200, orders:6 },
  { day:'Fri', revenue:42700, orders:8 },
  { day:'Sat', revenue:38900, orders:7 },
  { day:'Sun', revenue:29400, orders:5 },
]

const CATEGORY_DATA = [
  { name:'Protein',     value:38, color:'#f97316' },
  { name:'Pre-Workout', value:22, color:'#3b82f6' },
  { name:'Health',      value:18, color:'#22c55e' },
  { name:'Mass Gainer', value:14, color:'#a855f7' },
  { name:'Others',      value:8,  color:'#eab308' },
]

const MONTHLY_DATA = [
  { month:'Nov', revenue:185000 },
  { month:'Dec', revenue:248000 },
  { month:'Jan', revenue:312000 },
  { month:'Feb', revenue:278000 },
  { month:'Mar', revenue:356000 },
  { month:'Apr', revenue:421000 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-zinc-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name === 'revenue' ? `Rs.${p.value.toLocaleString()}` : `${p.value} orders`}
        </p>
      ))}
    </div>
  )
}

export default function AdminCharts({ orders = [] }) {
  const deliveredCnt  = orders.filter(o => o.status === 'delivered').length
  const statusCounts  = {
    delivered:  deliveredCnt,
    confirmed:  orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped:    orders.filter(o => o.status === 'shipped').length,
    cancelled:  orders.filter(o => o.status === 'cancelled').length,
  }

  return (
    <>
      {/* Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Revenue area chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-bold">Weekly Revenue</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Last 7 days performance</p>
            </div>
            <span className="badge bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA} margin={{ top:5, right:10, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day"  tick={{ fill:'#71717a', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#71717a', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#f97316" strokeWidth={2} fill="url(#revenueGrad)"
                dot={{ fill:'#f97316', strokeWidth:0, r:3 }} activeDot={{ r:5, fill:'#f97316' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category donut */}
        <div className="card p-5">
          <div className="mb-5">
            <h3 className="text-white font-bold">Sales by Category</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Product category breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, '']} contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:'12px', fontSize:'12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CATEGORY_DATA.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-zinc-400">{c.name}</span>
                </div>
                <span className="text-white font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly bar chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-bold">Monthly Revenue</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Last 6 months</p>
            </div>
            <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MONTHLY_DATA} margin={{ top:5, right:10, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{ fill:'#71717a', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#71717a', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="revenue" fill="#f97316" radius={[6,6,0,0]}>
                {MONTHLY_DATA.map((_, i) => (
                  <Cell key={i} fill={i === MONTHLY_DATA.length - 1 ? '#f97316' : '#ea580c60'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order status breakdown */}
        <div className="card p-5">
          <div className="mb-5">
            <h3 className="text-white font-bold">Order Status</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Current breakdown</p>
          </div>
          {[
            { label:'Delivered',  count: statusCounts.delivered,  color:'bg-green-500',  textColor:'text-green-400' },
            { label:'Confirmed',  count: statusCounts.confirmed,  color:'bg-blue-500',   textColor:'text-blue-400' },
            { label:'Processing', count: statusCounts.processing, color:'bg-yellow-500', textColor:'text-yellow-400' },
            { label:'Shipped',    count: statusCounts.shipped,    color:'bg-purple-500', textColor:'text-purple-400' },
            { label:'Cancelled',  count: statusCounts.cancelled,  color:'bg-red-500',    textColor:'text-red-400' },
          ].map(s => (
            <div key={s.label} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${s.textColor}`}>{s.label}</span>
                <span className="text-white text-xs font-bold">{s.count}</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${s.color} rounded-full transition-all duration-700`}
                  style={{ width: orders.length ? `${(s.count / orders.length) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily orders bar */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-bold">Daily Orders This Week</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Order volume per day</p>
          </div>
          <span className="badge bg-green-500/10 text-green-400 border border-green-500/20 text-xs">Live Data</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={REVENUE_DATA} margin={{ top:5, right:10, left:0, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="day" tick={{ fill:'#71717a', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#71717a', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="orders" name="orders" fill="#3b82f6" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
