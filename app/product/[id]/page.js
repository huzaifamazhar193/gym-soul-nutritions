'use client'
import { useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { PRODUCTS } from '@/lib/products'
import {
  Star, Heart, ShoppingCart, Zap, Shield, Truck,
  ChevronLeft, Plus, Minus, Check, Share2,
} from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function ProductPage({ params }) {
  const product = PRODUCTS.find(p => p.slug === params.id)
  if (!product) notFound()

  const { addToCart, toggleWishlist, wishlist } = useCart()
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const isWishlisted = wishlist.some(i => i.id === product.id)
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, qty, selectedFlavor, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="section">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <span className="text-zinc-300">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 badge text-white font-bold ${
                  product.badge === 'Best Seller' ? 'bg-orange-500' :
                  product.badge === 'Top Rated'  ? 'bg-yellow-500' :
                  product.badge === 'Hot'         ? 'bg-red-500' :
                  product.badge === 'Premium'     ? 'bg-purple-500' :
                  'bg-green-500'
                }`}>{product.badge}</span>
              )}
            </div>

            {/* Share */}
            <button className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors">
              <Share2 size={18} />
            </button>
          </div>

          {/* Details */}
          <div>
            <p className="text-orange-400 text-sm font-semibold mb-2">{product.brand}</p>
            <h1 className="text-3xl font-black text-white mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'} />
                ))}
              </div>
              <span className="text-white font-semibold">{product.rating}</span>
              <span className="text-zinc-500 text-sm">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="text-4xl font-black text-white">Rs.{product.price.toLocaleString()}</span>
              <div>
                <span className="text-zinc-500 line-through text-lg">Rs.{product.originalPrice.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">{product.discount}% OFF</span>
                  <span className="text-green-400 text-sm font-medium">You save Rs.{(product.originalPrice - product.price).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-zinc-400 leading-relaxed mb-6">{product.description}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {product.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <Check size={14} className="text-green-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {/* Flavor selector */}
            {product.flavors[0] !== 'N/A' && product.flavors[0] !== 'Unflavored' && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-white mb-2">Flavor: <span className="text-orange-400">{selectedFlavor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map(f => (
                    <button
                      key={f}
                      onClick={() => setSelectedFlavor(f)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        selectedFlavor === f
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white bg-zinc-800/50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-white mb-2">Size: <span className="text-orange-400">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedSize === s
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white bg-zinc-800/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Actions */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl p-1">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold text-white">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'btn-primary'
                }`}
              >
                {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-red-500/10 border-red-500/50 text-red-400'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 bg-zinc-800'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Buy now */}
            <Link href="/checkout" className="w-full btn-secondary flex items-center justify-center gap-2 py-3.5 mb-4">
              <Zap size={18} className="text-orange-400" /> Buy Now (COD Available)
            </Link>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Shield, text: '100% Authentic', sub: 'Verified genuine' },
                { icon: Truck,  text: 'Free Delivery',  sub: 'Above Rs.999' },
                { icon: Shield, text: 'Secure Payment', sub: 'Encrypted checkout' },
              ].map(b => (
                <div key={b.text} className="text-center p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <b.icon size={18} className="text-orange-400 mx-auto mb-1" />
                  <p className="text-white text-xs font-semibold">{b.text}</p>
                  <p className="text-zinc-500 text-[10px]">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
