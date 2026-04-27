'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Heart, Star, ShoppingCart, Zap } from 'lucide-react'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart()
  const [hovered, setHovered] = useState(false)
  const isWishlisted = wishlist.some(i => i.id === product.id)

  const savings = product.originalPrice - product.price

  return (
    <div
      className="card-hover product-shine group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-zinc-800 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Overlay actions */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            href={`/product/${product.slug}`}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
          >
            View Details
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`badge text-white text-xs font-bold ${
              product.badge === 'Best Seller' ? 'bg-orange-500' :
              product.badge === 'Top Rated'  ? 'bg-yellow-500' :
              product.badge === 'New'         ? 'bg-green-500' :
              product.badge === 'Hot'         ? 'bg-red-500' :
              product.badge === 'Premium'     ? 'bg-purple-500' :
              'bg-blue-500'
            }`}>
              {product.badge}
            </span>
          )}
          {product.discount > 0 && (
            <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
          className={`absolute top-3 right-3 p-2 rounded-xl transition-all duration-200 ${
            isWishlisted
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/40'
              : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-red-400'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-orange-400 font-medium mb-1">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-white leading-snug mb-2 hover:text-orange-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-400">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-white">Rs.{product.price.toLocaleString()}</span>
          <span className="text-sm text-zinc-500 line-through">Rs.{product.originalPrice.toLocaleString()}</span>
          {savings > 0 && (
            <span className="text-xs text-green-400 font-medium">Save Rs.{savings.toLocaleString()}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addToCart(product, 1, product.flavors[0], product.sizes[0])}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl text-sm font-semibold
            hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20
            active:scale-[0.98] transition-all duration-200"
        >
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
