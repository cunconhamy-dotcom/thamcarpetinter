import { Grid2x2, Search } from 'lucide-react'
import type { CollectionItem } from '@/lib/collections'

interface CollectionSidebarProps {
  query: string
  setQuery: (query: string) => void
  filteredCollections: CollectionItem[]
  activeCollection: CollectionItem
  setActiveId: (id: string) => void
  setSelectedProductIndex: (index: number) => void
}

export function CollectionSidebar({
  query,
  setQuery,
  filteredCollections,
  activeCollection,
  setActiveId,
  setSelectedProductIndex,
}: CollectionSidebarProps) {
  return (
    <div className="relative lg:h-full">
      <div className="lg:absolute lg:inset-0 h-[500px] lg:h-full flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#262626] shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <div className="shrink-0 border-b border-white/10 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-[#e8720c] font-semibold">
            <Grid2x2 size={14} />
            BỘ SƯU TẬP
          </div>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm bộ sưu tập..."
              className="w-full rounded-xl border border-white/12 bg-white/5 py-2.5 pl-10 pr-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c]/50"
            />
          </label>
        </div>

        {/* Scrollable List */}
        <div className="relative flex flex-1 min-h-0">
          {/* Scroll track line (brand accent) */}
          <div className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[#e8720c]/80 via-[#f29d38]/50 to-transparent z-10 pointer-events-none" />

          <div
            className="flex-1 overflow-y-auto pb-4"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="space-y-1 p-3">
              {filteredCollections.map((item) => {
                const active = item.id === activeCollection?.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveId(item.id)
                      setSelectedProductIndex(0)
                    }}
                    className={`w-full rounded-[18px] border p-3.5 text-left transition-all duration-200 ${
                      active
                        ? 'border-[#e8720c]/30 bg-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.2)]'
                        : 'border-transparent hover:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className={`text-base font-medium leading-tight ${active ? 'text-[#e8720c]' : 'text-white'}`}>
                          {item.name}
                        </div>
                        <div className="mt-1 line-clamp-1 text-xs leading-4 text-white/50">
                          {item.tagline}
                        </div>
                      </div>
                      {active && (
                        <div className="h-2 w-2 shrink-0 rounded-full bg-[#e8720c]" />
                      )}
                    </div>
                  </button>
                )
              })}
              {!filteredCollections.length && (
                <div className="p-4 text-center text-sm text-white/40">
                  Không tìm thấy bộ sưu tập.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 mt-auto border-t border-white/10 px-4 py-3 bg-white/5">
          <div className="text-center text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold font-sans">
            {filteredCollections.length} bộ sưu tập
          </div>
        </div>
      </div>
    </div>
  )
}
