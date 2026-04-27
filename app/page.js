'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { PRODUCTS, CATEGORIES } from '@/lib/products'
import {
  ArrowRight, Zap, Shield, Truck, RotateCcw,
  Star, ChevronLeft, ChevronRight, TrendingUp,
  Award, Users, Package, Dumbbell, FlameIcon,
} from 'lucide-react'

const TESTIMONIALS = [
  { name: 'Ali Hassan', city: 'Lahore', rating: 5, text: 'Best whey protein at the best price! Delivery was super fast. Quality is genuinely top-notch. Will definitely order again.', product: 'Whey Protein Gold', avatar: 'R' },
  { name: 'Ayesha Khan',  city: 'Karachi', rating: 5, text: 'Started using their Creatine 3 months ago and my strength has gone through the roof. Genuine products, zero fillers.', product: 'Creatine Monohydrate', avatar: 'P' },
  { name: 'Usman Malik',  city: 'Islamabad', rating: 5, text: 'Pre-workout is insane! Huge pumps, great focus. Customer support was very helpful too. Highly recommended!', product: 'Pre-Workout Ignite', avatar: 'A' },
  { name: 'Sara Ahmed',   city: 'Faisalabad', rating: 5, text: 'Finally found a store with authentic products. BCAA recovery is amazing. No fake products here!', product: 'BCAA Energy Rush', avatar: 'N' },
]

const STATS = [
  { icon: Users,   value: '2,50,000+', label: 'Happy Customers' },
  { icon: Package, value: '500+',      label: 'Products' },
  { icon: Award,   value: '100%',      label: 'Authentic' },
  { icon: Truck,   value: '24hr',      label: 'Fast Delivery' },
]

const BENEFITS = [
  { icon: Shield, title: '100% Authentic',     desc: 'Every product is verified genuine. No fakes, no fillers.', color: 'text-green-400 bg-green-400/10' },
  { icon: Truck,  title: 'Free Delivery',       desc: 'Free shipping on all orders above Rs.3,499 across Pakistan.', color: 'text-blue-400 bg-blue-400/10' },
  { icon: Zap,    title: 'Best Prices',         desc: 'Lowest prices guaranteed. Beat any price, we\'ll match it.', color: 'text-yellow-400 bg-yellow-400/10' },
  { icon: RotateCcw, title: 'Easy Returns',    desc: '7-day hassle-free returns. No questions asked.', color: 'text-purple-400 bg-purple-400/10' },
]

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const featured = PRODUCTS.filter(p => p.badge).slice(0, 8)
  const filtered = selectedCategory === 'all'
    ? PRODUCTS.slice(0, 8)
    : PRODUCTS.filter(p => p.category === selectedCategory).slice(0, 8)

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 hero-pattern pt-20">
        {/* Background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-700/8 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/3 rounded-full blur-3xl" />
        </div>

        <div className="section relative z-10 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6">
              <FlameIcon size={14} className="animate-pulse" />
              Pakistan's #1 Supplement Store
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
              <span className="text-white">Fuel Your</span>
              <br />
              <span className="gradient-text">Beast Mode</span>
              <br />
              <span className="text-white">Journey</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-lg">
              Premium gym supplements at unbeatable prices. 100% authentic products, fast delivery across Pakistan, and the best selection of protein, creatine, and more.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/products" className="btn-primary text-base px-8 py-4 glow-orange">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/products?category=protein" className="btn-secondary text-base px-8 py-4">
                Explore Protein
              </Link>
            </div>
            {/* Mini stats */}
            <div className="flex flex-wrap gap-6">
              {STATS.map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <s.icon size={16} className="text-orange-400" />
                  <div>
                    <p className="text-white font-bold text-sm">{s.value}</p>
                    <p className="text-zinc-500 text-xs">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-[420px] h-[420px]">
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/20 animate-spin" style={{animationDuration:'30s'}} />
              <div className="absolute inset-8 rounded-full border border-orange-500/10" />

              {/* Center product showcase */}
              <div className="absolute inset-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 overflow-hidden shadow-2xl animate-float">
                <Image
                  src={PRODUCTS[0].image}
                  alt="Featured Product"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs text-orange-400 font-medium">Best Seller</p>
                  <p className="text-white font-bold text-sm">Whey Protein Gold</p>
                  <p className="text-zinc-300 text-xs">Rs.13,999 <span className="line-through text-zinc-500">Rs.19,499</span></p>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -left-8 top-1/3 glass px-3 py-2 animate-float" style={{animationDelay:'0.5s'}}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">+27% Strength</p>
                    <p className="text-zinc-500 text-[10px]">Avg user result</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 bottom-1/3 glass px-3 py-2 animate-float" style={{animationDelay:'1s'}}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {['R','P','A'].map(l => (
                      <div key={l} className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[9px] text-white font-bold">
                        {l}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">2.5L+ Users</p>
                    <div className="flex">
                      {[...Array(5)].map((_,i) => <Star key={i} size={8} className="text-yellow-400 fill-yellow-400" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-5 h-8 border-2 border-zinc-600 rounded-full flex items-start justify-center pt-1">
            <div className="w-1 h-2 bg-orange-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ BENEFITS BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-12 bg-zinc-900 border-y border-zinc-800">
        <div className="section grid grid-cols-2 md:grid-cols-4 gap-6">
          {BENEFITS.map(b => (
            <div key={b.title} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${b.color}`}>
                <b.icon size={20} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{b.title}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ FEATURED PRODUCTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-20 bg-zinc-950">
        <div className="section">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-orange-400 text-sm font-semibold mb-2 uppercase tracking-wider">ðŸ”¥ Top Picks</p>
              <h2 className="text-4xl font-black text-white">Featured Products</h2>
              <p className="text-zinc-400 mt-2">Handpicked best sellers loved by thousands</p>
            </div>
            <Link href="/products" className="btn-secondary hidden sm:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === c.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
                }`}
              >
                <span>{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((p, i) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/products" className="btn-primary px-10 py-4">
              Explore All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ PROMO BANNER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-8 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23fff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="section flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-white">First Order Special ðŸŽ‰</h3>
            <p className="text-orange-100 mt-1">Use code <strong className="text-white bg-orange-700/50 px-2 py-0.5 rounded">SOULFIRST</strong> and get 10% OFF on your first order!</p>
          </div>
          <Link href="/products" className="flex-shrink-0 px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 active:scale-95 transition-all shadow-xl">
            Shop Now
          </Link>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ TESTIMONIALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-20 bg-zinc-900">
        <div className="section">
          <div className="text-center mb-12">
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-2">â­ Customer Love</p>
            <h2 className="text-4xl font-black text-white">What Our Customers Say</h2>
            <p className="text-zinc-400 mt-2">2,50,000+ satisfied customers across Pakistan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`card p-6 transition-all duration-300 ${i === activeTestimonial ? 'border-orange-500/50 bg-orange-500/5' : ''}`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-zinc-500 text-xs">{t.city} â€¢ {t.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-20 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
        </div>
        <div className="section text-center relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/30">
            <Dumbbell size={28} className="text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Ready to Level Up?
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
            Join 2.5 lakh+ athletes who trust Gym Soul Nutritions for their nutrition needs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products" className="btn-primary text-base px-10 py-4 glow-orange">
              Start Shopping <ArrowRight size={18} />
            </Link>
            <Link href="/auth" className="btn-secondary text-base px-10 py-4">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
