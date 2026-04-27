'use client'
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { PRODUCTS, CATEGORIES } from '@/lib/products'
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, List } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'popular',   label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'discount',  label: 'Best Discount' },
  { value: 'rating',    label: 'Top Rated' },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [sort, setSort] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 25000])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
    const s = searchParams.get('search')
    if (s) setSearch(s)
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    if (category !== 'all') list = list.filter(p => p.category === category)
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sort) {
      case 'price_asc':  list.sort((a,b) => a.price - b.price); break
      case 'price_desc': list.sort((a,b) => b.price - a.price); break
      case 'discount':   list.sort((a,b) => b.discount - a.discount); break
      case 'rating':     list.sort((a,b) => b.rating - a.rating); break
      default:           list.sort((a,b) => b.reviews - a.reviews); break
    }
    return list
  }, [search, category, sort, priceRange])

  const clearFilters = () => {
    setSearch(''); setCategory('all'); setSort('popular'); setPriceRange([0, 25000])
  }
  const hasFilters = search || category !== 'all' || sort !== 'popular'

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20">
      <div className="section">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">All Products</h1>
          <p className="text-zinc-400">{filtered.length} products found</p>
        </div>

        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search protein, creatine, BCAA..."
              className="input pl-10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="input pr-8 appearance-none cursor-pointer min-w-[160px]"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(o => !o)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                showFilters ? 'bg-orange-500 border-orange-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            {/* View toggle */}
            <div className="hidden sm:flex bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="glass p-5 mb-6 animate-slide-up">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <p className="text-sm font-semibold text-white mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        category === c.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                      }`}
                    >
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:w-64">
                <p className="text-sm font-semibold text-white mb-3">
                  Price Range: Rs.{priceRange[0]} – Rs.{priceRange[1].toLocaleString()}
                </p>
                <input
                  type="range"
                  min={0} max={25000} step={500}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, +e.target.value])}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-4 flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300">
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === c.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-zinc-400 mb-6">Try different keywords or clear your filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className={`grid gap-4 lg:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filtered.map((p, i) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
