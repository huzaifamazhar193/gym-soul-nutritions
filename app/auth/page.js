'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Dumbbell, Eye, EyeOff, ArrowRight, Loader2, Mail, Lock, User, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPass: '' })
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (mode === 'register') {
      if (form.password !== form.confirmPass) {
        toast.error('Passwords do not match!')
        setLoading(false)
        return
      }
      if (form.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        setLoading(false)
        return
      }
      const { error } = await signUp({ email: form.email, password: form.password, fullName: form.fullName, phone: form.phone })
      if (error) { toast.error(error.message); setLoading(false); return }
      toast.success('Account created! Please check your email.')
      setMode('login')
    } else {
      const { error } = await signIn({ email: form.email, password: form.password })
      if (error) { toast.error('Invalid email or password'); setLoading(false); return }
      toast.success('Welcome back!')
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 hero-pattern flex items-center justify-center px-4 pt-16">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-700/6 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Dumbbell size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black">
              <span className="text-white">Gym</span>
              <span className="gradient-text">Supps</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Welcome Back! ðŸ’ª' : 'Join Gym Soul Nutritions'}
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            {mode === 'login' ? 'Sign in to your account' : 'Create your free account today'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1 mb-6">
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
                mode === m
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={set('fullName')}
                  required
                  className="input pl-10"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={set('email')}
                required
                className="input pl-10"
              />
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={set('phone')}
                  className="input pl-10"
                />
              </div>
            )}

            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={set('password')}
                required
                className="input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(o => !o)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={form.confirmPass}
                  onChange={set('confirmPass')}
                  required
                  className="input pl-10"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {mode === 'register' && (
            <p className="text-xs text-zinc-500 text-center mt-4">
              By registering, you agree to our{' '}
              <span className="text-orange-400 cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-orange-400 cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          )}
        </div>

        {/* Switch mode */}
        <p className="text-center text-sm text-zinc-500 mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-orange-400 font-semibold hover:text-orange-300 transition-colors"
          >
            {mode === 'login' ? 'Register Free' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
