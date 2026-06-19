import { Images } from 'lucide-react'
import { type CollectionItem, type Product } from '../../lib/collections'
import { ProductCard } from './ProductCard'

interface ProductsGridProps {
  activeCollection: CollectionItem
  onProductClick: (product: Product) => void
}

export function ProductsGrid({ activeCollection, onProductClick }: ProductsGridProps) {
  return (
    <section className="w-full bg-[#1a1a1a] py-16 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-[30px] border border-white/10 bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-5 lg:p-7 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">
              <Images size={16} />
              Danh mục sản phẩm trong bộ sưu tập
            </div>
            <div className="text-sm text-white/40 font-medium">Click vào sản phẩm để xem chi tiết</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeCollection.products.map((product) => (
              <ProductCard 
                key={product.code} 
                product={product} 
                accent={activeCollection.accent} 
                onClick={() => onProductClick(product)} 
                dark 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
