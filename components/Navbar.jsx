'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import {
  ShoppingCart, Heart, User, Menu, X, Search,
  Dumbbell, ChevronDown, Bell, Package, LogOut,
} from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const { cartCount, wishlist } = useCart()
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const navLinks = [
    { href: '/products', label: 'Shop' },
    { href: '/products?category=protein', label: 'Protein' },
    { href: '/products?category=pre-workout', label: 'Pre-Workout' },
    { href: '/products?category=health', label: 'Health' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-zinc-950/95 backdrop-blur-xl shadow-2xl shadow-black/50 border-b border-zinc-800/50' : 'bg-transparent'
    }`}>
      {/* Top banner */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-1.5 text-center text-xs font-medium text-white">
        Free Delivery on Orders Above Rs.3,499 | Use code <span className="font-bold">SOULFIRST</span> for 10% OFF
      </div>

      <div className="section">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <Dumbbell size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-white">Gym </span>
              <span className="gradient-text">Soul</span>
              <span className="text-zinc-500 text-sm font-normal ml-1">Nutritions</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === l.href
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <input
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && query.trim()) {
                        window.location.href = `/products?search=${encodeURIComponent(query)}`
                        setSearchOpen(false)
                      }
                      if (e.key === 'Escape') setSearchOpen(false)
                    }}
                    placeholder="Search supplements..."
                    className="w-48 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                  <button onClick={() => setSearchOpen(false)} className="p-1.5 text-zinc-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="btn-ghost p-2">
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/profile?tab=wishlist" className="btn-ghost p-2 relative">
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="btn-ghost p-2 relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-once">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl hover:border-zinc-600 transition-all"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {profile?.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-zinc-300 hidden sm:block max-w-[80px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={14} className={`text-zinc-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                      <User size={15} /> My Profile
                    </Link>
                    <Link href="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                      <Package size={15} /> My Orders
                    </Link>
                    <button
                      onClick={() => { signOut(); setProfileOpen(false) }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" className="btn-primary py-2 px-4 text-sm">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden btn-ghost p-2 ml-1"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 animate-slide-up">
          <div className="section py-4 flex flex-col gap-1">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium transition-all"
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link href="/auth" className="btn-primary mt-2">
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
