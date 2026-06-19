import { AnimatePresence, motion } from 'framer-motion'
import { type Product } from '../../lib/collections'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-[32px] border border-black/10 bg-white text-[#1a1a1a] shadow-2xl scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10"
          >
            <button 
              onClick={onClose}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black/70 hover:bg-black/20 hover:text-black backdrop-blur-md transition cursor-pointer font-bold"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-[1fr_1fr] h-full min-h-[500px]">
              <div className="bg-[#f5f3f0] h-64 md:h-auto border-r border-black/5 flex items-center justify-center">
                 {product.image ? (
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="text-black/35 font-sans">Chưa có hình ảnh</div>
                 )}
              </div>
              <div className="p-8 md:p-10 space-y-6">
                 <div>
                    <div className="text-base uppercase tracking-[0.25em] text-[#e8720c] font-semibold">{product.code}</div>
                    <h3 className="mt-2 text-3xl font-light text-[#1a1a1a]">{product.name}</h3>
                 </div>
                 
                 <div className="space-y-4 rounded-[24px] border border-black/8 bg-[#f5f3f0] p-6 shadow-inner">
                   <div className="text-sm uppercase tracking-[0.22em] text-[#e8720c] font-semibold">Thông số kỹ thuật chi tiết</div>
                   <div className="grid gap-3 text-base leading-7 text-black/80 font-sans">
                     <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Cấu trúc sợi:</span> <span>{product.spec.pile}</span></div>
                     <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Kết cấu:</span> <span>{product.spec.construction}</span></div>
                     <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Đế thảm:</span> <span>{product.spec.backing}</span></div>
                     <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Kích thước:</span> <span>{product.spec.size}</span></div>
                     <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Phù hợp:</span> <span>{product.spec.useCase}</span></div>
                     <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Lắp đặt:</span> <span>{product.spec.installation}</span></div>
                   </div>
                 </div>

                 <div className="space-y-3">
                    <div className="text-sm uppercase tracking-[0.22em] text-[#e8720c] font-semibold">Đặc điểm nổi bật</div>
                    {product.highlights.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-base leading-6 text-black/75">
                        <span className="mt-2 shrink-0 h-1.5 w-1.5 rounded-full bg-[#e8720c]" />
                        <span className="font-sans">{point}</span>
                      </div>
                    ))}
                 </div>

                 {product.colors?.length ? (
                   <div className="pt-4 border-t border-black/5">
                     <div className="text-sm uppercase tracking-[0.22em] text-[#e8720c] font-semibold">Sắc độ gợi ý</div>
                     <div className="mt-2 flex gap-2 flex-wrap">
                       {product.colors.map(color => (
                          <span key={color} className="rounded-full bg-[#f5f3f0] border border-black/5 px-3 py-1 text-base text-black/80 font-medium font-sans">{color}</span>
                       ))}
                     </div>
                   </div>
                 ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
