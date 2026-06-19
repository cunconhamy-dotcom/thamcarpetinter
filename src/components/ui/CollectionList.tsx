import { FileText, ArrowRight } from 'lucide-react'
import { type CollectionItem } from '../../lib/collections'

interface CollectionListProps {
  collections: CollectionItem[]
  setActiveId: (id: string) => void
}

export function CollectionList({ collections, setActiveId }: CollectionListProps) {
  return (
    <section className="w-full bg-[#fafaf8] py-16 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-[#262626] p-5 md:p-6 space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">
            <FileText size={16} />
            Bộ sưu tập thảm sàn Carpets Inter
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((item) => (
              <a
                key={item.id}
                href="#collections"
                onClick={() => setActiveId(item.id)}
                className="overflow-hidden rounded-[26px] border border-white/10 bg-[#262626] shadow-sm transition-all duration-300 hover:border-[#e8720c]/40 hover:bg-[#333] group"
              >
                <div className="h-44 w-full overflow-hidden border-b border-white/10 bg-black/20">
                  <img src={item.heroImage} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-medium text-white">{item.name}</h4>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.accent }} />
                  </div>
                  <p className="line-clamp-3 text-base leading-6 text-white/60">{item.summary}</p>
                  <span className="inline-flex items-center gap-2 text-base text-[#e8720c] font-medium">
                    Xem chi tiết
                    <ArrowRight size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
