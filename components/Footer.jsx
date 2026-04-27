import Link from 'next/link'
import { Dumbbell, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const LINKS = {
  'Quick Links': [
    { href: '/products', label: 'All Products' },
    { href: '/products?category=protein', label: 'Protein' },
    { href: '/products?category=pre-workout', label: 'Pre-Workout' },
    { href: '/products?category=health', label: 'Health' },
  ],
  'My Account': [
    { href: '/auth', label: 'Login / Register' },
    { href: '/orders', label: 'Track Order' },
    { href: '/profile', label: 'My Profile' },
    { href: '/cart', label: 'Shopping Cart' },
  ],
  'Help': [
    { href: '#', label: 'FAQs' },
    { href: '#', label: 'Shipping Policy' },
    { href: '#', label: 'Return Policy' },
    { href: '#', label: 'Privacy Policy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800">
      {/* Main footer */}
      <div className="section py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Dumbbell size={18} className="text-white" />
              </div>
              <span className="text-xl font-black">
                <span className="text-white">Gym </span>
                <span className="gradient-text">Soul</span>
                <span className="text-zinc-500 font-normal text-sm ml-1">Nutritions</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5 max-w-xs">
              Pakistan's most trusted supplement store. Premium quality, guaranteed authentic products at the best prices.
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-5">
              <a href="mailto:support@gymsoul.pk" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-400 transition-colors">
                <Mail size={14} /> support@gymsoul.pk
              </a>
              <a href="tel:+923001234567" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-400 transition-colors">
                <Phone size={14} /> +92 300 1234567
              </a>
              <p className="flex items-center gap-2 text-sm text-zinc-500">
                <MapPin size={14} /> Lahore, Punjab, Pakistan
              </p>
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter,   href: '#' },
                { icon: Youtube,   href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center text-zinc-400 hover:text-orange-400 hover:border-orange-500/50 transition-all">
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-zinc-400 text-sm hover:text-orange-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800">
        <div className="section py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-500 text-xs">
            &copy; 2025 Gym Soul Nutritions. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-zinc-600 text-xs">We accept</p>
            {['EasyPaisa','JazzCash','Visa','MasterCard','COD'].map(p => (
              <span key={p} className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-400 font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
