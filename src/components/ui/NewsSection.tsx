import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Newspaper, Calendar, User } from 'lucide-react'
import { mockNews, fetchNewsArticles, type NewsArticle } from '../../lib/news'

export function NewsSection() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(mockNews)
  const [activeNewsId, setActiveNewsId] = useState(mockNews[0].id)

  useEffect(() => {
    fetchNewsArticles().then((articles) => {
      if (articles.length > 0) {
        setNewsArticles(articles)
        setActiveNewsId(articles[0].id)
      }
    })
  }, [])

  const activeNews = newsArticles.find(n => n.id === activeNewsId) ?? newsArticles[0]

  return (
    <section id="news" className="w-full bg-[#1a1a1a] py-16 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="mb-2 flex items-center gap-2 text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">
          <Newspaper size={16} />
          Tin tức & Sự kiện
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] items-stretch">
          {/* SIDEBAR NEWS */}
          <div className="relative h-full flex flex-col overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-sm">
            <div className="relative flex flex-1 min-h-0 pt-3">
              <div className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[#e8720c]/80 via-[#f29d38]/50 to-transparent z-10 pointer-events-none" />

              <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                <div className="space-y-1 p-3">
                  {newsArticles.map((item) => {
                    const active = item.id === activeNewsId
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveNewsId(item.id)}
                        className={`w-full rounded-[18px] border p-3.5 text-left transition-all duration-200 ${
                          active
                            ? 'border-[#e8720c]/30 bg-[#fafaf8] shadow-[0_4px_16px_rgba(0,0,0,0.02)]'
                            : 'border-transparent hover:border-black/5 hover:bg-black/5'
                        }`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className={`text-base font-medium leading-tight line-clamp-2 ${active ? 'text-[#e8720c]' : 'text-[#1a1a1a]'}`}>
                            {item.title}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] text-black/40 flex items-center gap-1">
                              <Calendar size={10} />
                              {item.date}
                            </div>
                            {active && <div className="h-2 w-2 shrink-0 rounded-full bg-[#e8720c]" />}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* DETAIL NEWS VIEW */}
          <div className="overflow-hidden rounded-[30px] border border-black/8 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-5 lg:p-7">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-black/8 bg-[#f5f3f0] px-3 py-1 text-sm uppercase tracking-[0.2em] text-[#e8720c] font-semibold">
                    Chi tiết bài viết
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-sm text-black/60 font-medium">
                    <User size={12} /> {activeNews.author}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-sm text-black/60 font-medium">
                    <Calendar size={12} /> {activeNews.date}
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl font-light sm:text-4xl text-[#1a1a1a]">{activeNews.title}</h2>
                  <p className="mt-3 text-base leading-7 text-[#8a5829] font-medium">{activeNews.summary}</p>
                </div>

                <div className="space-y-4 text-base leading-8 text-black/75">
                  {activeNews.content && activeNews.content.includes('<') && activeNews.content.includes('>') ? (
                    <div 
                      className="space-y-4 [&>p]:text-black/75 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-[#1a1a1a] [&>h2]:mt-6 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:text-[#1a1a1a] [&>h3]:mt-4 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:text-black/75 [&>strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: activeNews.content }} 
                    />
                  ) : (
                    String(activeNews.content || '').split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4 h-full flex flex-col">
                <div className="overflow-hidden rounded-[22px] border border-black/8 bg-[#fafaf8] flex-1 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeNews.id}
                      initial={{ opacity: 0.35, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.2, scale: 0.98 }}
                      transition={{ duration: 0.5 }}
                      src={activeNews.image}
                      alt={activeNews.title}
                      className="h-full w-full object-cover"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
