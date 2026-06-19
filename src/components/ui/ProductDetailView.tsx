import { AnimatePresence, motion } from 'framer-motion'
import type { CollectionItem, Product } from '@/lib/collections'

interface ProductDetailViewProps {
  activeCollection: CollectionItem
  selectedProduct: Product | undefined
  currentSlide: string
  productShowcase: string[]
  setSelectedProductIndex: (index: number) => void
}

export function ProductDetailView({
  activeCollection,
  selectedProduct,
  currentSlide,
  productShowcase,
  setSelectedProductIndex,
}: ProductDetailViewProps) {
  return (
    <div id={`collection-\${activeCollection.id}`} className="h-full overflow-hidden rounded-[30px] border border-white/10 bg-[#262626] shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-5 lg:p-7">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] h-full">
        {/* Left pane */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm uppercase tracking-[0.2em] text-[#e8720c] font-semibold">
              Chi tiết sản phẩm
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/70 font-medium">
              {activeCollection.products.length} mã sản phẩm
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-light sm:text-4xl text-white">{activeCollection.name}</h2>
            <p className="mt-2 text-base leading-7 text-[#e8720c] font-medium">{activeCollection.tagline}</p>
          </div>

          <p className="text-base leading-8 text-white/80">{activeCollection.summary}</p>
          <p className="text-base leading-8 text-white/60">{activeCollection.detail}</p>

          <div className="grid gap-3 sm:grid-cols-3">
            {activeCollection.quickFacts.map((fact) => (
              <div key={fact} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-base leading-6 text-white/80 shadow-sm">
                {fact}
              </div>
            ))}
          </div>
        </div>

        {/* Right pane (Image + thumbs) */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/40">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                initial={{ opacity: 0.35, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.2, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                src={currentSlide}
                alt={activeCollection.name}
                className="h-[300px] w-full object-cover"
              />
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-center gap-3 py-1">
            <span className="h-px w-8 bg-white/10" />
            <span className="text-lg uppercase tracking-[0.15em] text-[#e8720c] font-semibold">
              {selectedProduct ? `${selectedProduct.code} · ${selectedProduct.name}` : "Click vào mẫu bên dưới để xem chi tiết"}
            </span>
            <span className="h-px w-8 bg-white/10" />
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {productShowcase.slice(0, 12).map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedProductIndex(index)}
                className={`overflow-hidden rounded-xl border bg-white/5 transition-all duration-200 ${image === currentSlide ? 'border-[#e8720c] ring-2 ring-[#e8720c]/20' : 'border-white/10 hover:border-white/30'}`}
              >
                <img src={image} alt={activeCollection.name} className="h-20 w-full object-cover transition hover:scale-105" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
