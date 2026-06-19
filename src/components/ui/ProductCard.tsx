import { type Product } from '../../lib/collections'

interface ProductCardProps {
  product: Product
  accent: string
  onClick?: () => void
  dark?: boolean
}

export function ProductCard({ product, accent, onClick, dark }: ProductCardProps) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component 
      type={onClick ? "button" : undefined} 
      onClick={onClick} 
      className={`group flex h-full flex-col overflow-hidden rounded-[24px] border text-left shadow-sm transition duration-300 ${onClick ? 'cursor-pointer' : ''} ${dark ? 'border-white/10 bg-white/5 hover:border-[#e8720c]/40 hover:bg-white/10' : 'border-black/8 bg-white hover:border-[#e8720c]/40 hover:shadow-md'}`}
    >
      {product.image && (
         <div className={`h-40 w-full shrink-0 overflow-hidden border-b ${dark ? 'border-white/10 bg-black/20' : 'border-black/5 bg-[#f5f3f0]'}`}>
           <img src={product.image} alt={product.name} className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${dark ? 'opacity-90 group-hover:opacity-100' : ''}`} />
         </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={`text-sm uppercase tracking-[0.22em] font-semibold ${dark ? 'text-white/40' : 'text-black/40'}`}>{product.code}</div>
            <h3 className={`mt-2 text-lg font-medium ${dark ? 'text-white' : 'text-[#1a1a1a]'}`}>{product.name}</h3>
          </div>
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
        </div>
        <div className="mt-4 flex-1 space-y-2">
          {product.highlights.map((point) => (
            <div key={point} className={`flex items-start gap-3 text-base leading-6 ${dark ? 'text-white/70' : 'text-black/75'}`}>
               <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dark ? 'bg-[#e8720c]' : 'bg-[#e8720c]'}`} />
               <span className="font-sans">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </Component>
  )
}
