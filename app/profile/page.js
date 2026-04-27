'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { User, Package, Heart, MapPin, Lock, Save, Loader2, Edit3, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'profile',  label: 'My Profile',  icon: User },
  { id: 'wishlist', label: 'Wishlist',     icon: Heart },
]

export default function ProfilePage() {
  const { user, profile, loading, updateProfile, signOut } = useAuth()
  const { wishlist, toggleWishlist, addToCart } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'profile')
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
  })

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading])

  useEffect(() => {
    if (profile) setForm({
      full_name: profile.full_name || '',
      email:     profile.email || user?.email || '',
      phone:     profile.phone || '',
      address:   profile.address || '',
      city:      profile.city || '',
      state:     profile.state || '',
      pincode:   profile.pincode || '',
    })
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await updateProfile(form)
    if (error) toast.error('Failed to update profile')
    else { toast.success('Profile updated!'); setEditMode(false) }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-28 flex items-center justify-center">
        <Loader2 size={32} className="text-orange-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="section max-w-4xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-orange-500/30">
            {form.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{form.full_name || 'Welcome!'}</h1>
            <p className="text-zinc-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-6 w-fit">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <t.icon size={15} /> {t.label}
              {t.id === 'wishlist' && wishlist.length > 0 && (
                <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">{wishlist.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Personal Information</h2>
              <button
                onClick={() => setEditMode(e => !e)}
                className={`flex items-center gap-2 text-sm font-medium transition-all ${editMode ? 'text-zinc-400 hover:text-white' : 'text-orange-400 hover:text-orange-300'}`}
              >
                <Edit3 size={15} /> {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'full_name', label: 'Full Name',    placeholder: 'Your full name',        type: 'text' },
                { key: 'email',     label: 'Email',         placeholder: 'email@example.com',     type: 'email' },
                { key: 'phone',     label: 'Phone Number',  placeholder: '03XX-XXXXXXX',       type: 'tel' },
                { key: 'address',   label: 'Address',       placeholder: 'House, street, area',   type: 'text', full: true },
                { key: 'city',      label: 'City',          placeholder: 'City',                  type: 'text' },
                { key: 'pincode',   label: 'Postal Code',   placeholder: '5-digit postal code',   type: 'text' },
                { key: 'state',     label: 'Province',      placeholder: 'e.g. Punjab, Sindh',    type: 'text' },
              ].map(f => (
                <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                  <label className="text-xs text-zinc-400 mb-1.5 block font-medium">{f.label}</label>
                  {editMode ? (
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="input"
                    />
                  ) : (
                    <p className={`py-3 px-4 bg-zinc-800/50 border border-zinc-800 rounded-xl text-sm ${form[f.key] ? 'text-white' : 'text-zinc-600 italic'}`}>
                      {form[f.key] || 'Not provided'}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {editMode && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary mt-6"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {tab === 'wishlist' && (
          <div className="animate-fade-in">
            {wishlist.length === 0 ? (
              <div className="text-center py-16">
                <Heart size={48} className="text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
                <p className="text-zinc-400 mb-6">Save products you love to buy later</p>
                <Link href="/products" className="btn-primary">Browse Products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {wishlist.map(item => (
                  <div key={item.id} className="card overflow-hidden">
                    <div className="relative aspect-square bg-zinc-800">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-orange-400">{item.brand}</p>
                      <p className="text-white text-sm font-semibold mt-0.5 line-clamp-2">{item.name}</p>
                      <div className="flex items-center gap-1 my-1.5">
                        {[...Array(5)].map((_,i) => <Star key={i} size={10} className={i < Math.floor(item.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'} />)}
                      </div>
                      <p className="text-white font-bold text-sm mb-3">Rs.{item.price.toLocaleString()}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { addToCart(item, 1, item.flavors[0], item.sizes[0]); toggleWishlist(item) }}
                          className="flex-1 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-lg text-xs font-semibold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Heart size={14} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
