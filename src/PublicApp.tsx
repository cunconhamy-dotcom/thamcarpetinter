import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, Check, Download, ExternalLink, FileText, Grid2x2, Images, Mail, MessageCircle, Phone, Search, Send, Sparkles, Newspaper, Calendar, User, Zap } from 'lucide-react'
import { collectionHeroRotator, collections as fallbackCollections, fetchCollections, contactInfo, featuredResources, type Product, type ResourceLink, type CollectionItem } from './lib/collections'
import { mockNews, fetchNewsArticles, type NewsArticle } from './lib/news'
import { AIChatbot } from './components/ui/AIChatbot'

const resourceLabels: Record<ResourceLink['type'], string> = {
  brochure: 'Brochure',
  spec: 'Thông số',
  guide: 'Hướng dẫn',
  portfolio: 'Portfolio',
}

function PublicApp() {
  const [collections, setCollections] = useState<CollectionItem[]>(fallbackCollections)
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(mockNews)
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(fallbackCollections[0].id)
  const [activeNewsId, setActiveNewsId] = useState(mockNews[0].id)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedProductIndex, setSelectedProductIndex] = useState(0)
  const [selectedModalProduct, setSelectedModalProduct] = useState<Product | null>(null)
  const [heroCollectionIndex, setHeroCollectionIndex] = useState(0)
  const [formStatus, setFormStatus] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: '',
    message: '',
  })

  const filteredCollections = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return collections

    return collections.filter((item) => {
      const pool = [
        item.name,
        item.tagline,
        item.summary,
        ...item.products.flatMap((product) => [product.code, product.name, ...product.highlights]),
      ]
        .join(' ')
        .toLowerCase()

      return pool.includes(keyword)
    })
  }, [query])

  const activeCollection =
    filteredCollections.find((item) => item.id === activeId) ?? filteredCollections[0] ?? collections[0]

  const [prevCollectionId, setPrevCollectionId] = useState(activeCollection.id)
  if (activeCollection.id !== prevCollectionId) {
    setPrevCollectionId(activeCollection.id)
    setSelectedProductIndex(0)
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroCollectionIndex((prev) => (prev + 1) % collectionHeroRotator.length)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [])

  const productShowcase = activeCollection.products.map((product) => product.image).filter(Boolean) as string[]
  const selectedProduct = activeCollection.products[selectedProductIndex] ?? activeCollection.products[0]
  const currentSlide = selectedProduct?.image ?? productShowcase[selectedProductIndex] ?? activeCollection.heroImage
  const heroCollection = collectionHeroRotator[heroCollectionIndex] ?? collectionHeroRotator[0]
  // Fetch data on mount
  useEffect(() => {
    fetchNewsArticles().then((articles) => {
      if (articles.length > 0) {
        setNewsArticles(articles)
        setActiveNewsId(articles[0].id)
      }
    })
    
    fetchCollections().then((cols) => {
      if (cols.length > 0) {
        setCollections(cols)
        setActiveId(cols[0].id)
      }
    })
  }, [])

  const activeNews = newsArticles.find(n => n.id === activeNewsId) ?? newsArticles[0]
  
  const collectionGallery = useMemo(() => {
    const merged = [...productShowcase, ...activeCollection.gallery]
    const unique = Array.from(new Set(merged))
    return unique.filter(
      (image) =>
        !/Specification|Installation|Capture|DV700-DV800|2024-port|2024-qs|Recommended|Brochure|Disc\.jpg|055\.jpg|install|DeclareLabel|Red-List-Free|หน้าเปล่า/i.test(
          image,
        ),
    )
  }, [activeCollection.gallery, productShowcase])


  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const subject = encodeURIComponent(`Yêu cầu tư vấn collection - ${formData.project || activeCollection.name}`)
    const body = encodeURIComponent(
      [
        `Họ tên: ${formData.name}`,
        `Điện thoại: ${formData.phone}`,
        `Email/Công ty: ${formData.email}`,
        `Dự án/Bộ sưu tập: ${formData.project}`,
        '',
        formData.message,
      ].join('\n'),
    )

    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
    setFormStatus('Yêu cầu đã được mở trong ứng dụng email của bạn để gửi trực tiếp.')
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#1a1a1a] selection:bg-[#e8720c]/20">
      {/* ── HERO SECTION ── */}
      <header className="relative w-full h-[90vh] min-h-[650px] flex flex-col overflow-hidden">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0 bg-[#1a1a1a]">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroCollection.id}
              src={heroCollection.image}
              initial={{ opacity: 0.3, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.2, scale: 0.98 }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Top Navigation bar */}
        <div className="relative z-10 w-full border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Left Logo block */}
            <div className="flex items-center gap-3">
              <div className="bg-[#e8720c] h-10 w-10 text-white font-bold flex items-center justify-center text-lg rounded">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold leading-tight">Carpets Inter</span>
                <span className="uppercase text-white/70 text-xs leading-tight mt-0.5">THẢM TRẢI SÀN CAO CẤP</span>
              </div>
            </div>

            {/* Center Nav Links */}
            <div className="hidden md:flex gap-8 text-base font-medium text-white/90">
              <a href="#collections" className="hover:text-[#e8720c] transition">Bộ sưu tập</a>
              <a href="#tai-lieu" className="hover:text-[#e8720c] transition">Tài liệu</a>
              <a href="#news" className="hover:text-[#e8720c] transition">Tin tức</a>
              <a href="#lien-he-nhanh" className="hover:text-[#e8720c] transition">Liên hệ</a>
            </div>

            {/* Right CTA */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <Phone size={16} className="text-[#e8720c]" />
                <span className="text-white font-medium text-base">0908314939</span>
              </div>
              <a href="tel:0908314939" className="bg-[#e8720c] text-white px-6 py-2.5 rounded font-semibold text-base transition hover:bg-[#ff8a24]">
                Gọi ngay
              </a>
            </div>
          </div>
        </div>

        {/* Hero Body Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-7">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#e8720c]/30 bg-black/40 px-5 py-2.5 text-sm text-white backdrop-blur-md">
              <Zap size={16} className="text-[#e8720c]" />
              Giao hàng và thi công nhanh chóng trên toàn quốc.
            </div>

            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[4.5rem] font-bold text-white leading-[1.1] tracking-tight uppercase">
              HƠN CẢ THẨM MỸ<br />ĐÓ LÀ <span className="text-[#e8720c]">SỰ BỀN VỮNG</span>
            </h1>

            <p className="max-w-2xl text-lg sm:text-lg text-white/80 leading-relaxed font-light">
              Nội thất công cộng Minh Đức đồng hành cùng đối tác quốc tế Carpets Inter, mang giải pháp thảm sàn sinh thái đẳng cấp toàn cầu đến mọi công trình bằng sự chân thành và cam kết chất lượng trọn vẹn.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#collections" className="bg-[#e8720c] px-8 py-4 rounded text-base font-semibold text-white transition hover:bg-[#ff8a24]">
                Xem bộ sưu tập
              </a>
              <a href="#tai-lieu" className="border border-white/20 bg-black/40 px-8 py-4 rounded text-base font-medium text-white flex items-center gap-2 transition hover:bg-black/60 hover:border-white/40">
                <BookOpen size={20} />
                Tài liệu kỹ thuật
              </a>
            </div>

            {/* Slider controls */}
            <div className="pt-12 flex gap-2">
              {collectionHeroRotator.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setHeroCollectionIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === heroCollectionIndex ? 'w-10 bg-[#e8720c]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                  aria-label={`Chọn ${item.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── COLLECTIONS SHOWCASE ── */}
      <section id="collections" className="w-full bg-white py-16 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] items-stretch">
            
            {/* SIDEBAR */}
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
                      const active = item.id === activeCollection.id
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

            {/* PRODUCT DETAIL VIEW */}
            <div id={`collection-${activeCollection.id}`} className="h-full overflow-hidden rounded-[30px] border border-white/10 bg-[#262626] shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-5 lg:p-7">
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
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                    {productShowcase.slice(0, 8).map((image, index) => (
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
          </div>
        </div>
      </section>

      {/* ── VALUE & SPEC SECTION ── */}
      <section className="w-full bg-[#1a1a1a] py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-2">
          {/* GIÁ TRỊ NỔI BẬT */}
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#e8720c]/20 p-2 text-[#e8720c]">
                <Check size={14} />
              </span>
              <div className="text-base uppercase tracking-[0.25em] text-[#e8720c] font-semibold">Giá trị nổi bật mang lại</div>
            </div>
            
            <div className="space-y-3">
              {activeCollection.valuePoints.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10 hover:shadow-sm">
                  <span className="mt-0.5 shrink-0 rounded-full bg-[#e8720c]/20 p-1.5 text-[#e8720c]">
                    <Check size={13} />
                  </span>
                  <div className="text-base leading-7 text-white/80">{item}</div>
                </div>
              ))}
            </div>
            
            <div className="rounded-2xl border border-[#e8720c]/30 bg-[#e8720c]/10 p-4 text-base leading-7 text-[#e8720c] font-medium">
              Liên hệ ngay để được tư vấn đúng bộ sưu tập, đúng cấu trúc bề mặt và đúng sắc độ phù hợp với concept công trình của bạn.
            </div>
          </div>

          {/* THÔNG SỐ KỸ THUẬT */}
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-6 lg:p-8">
            {selectedProduct ? (
              <>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.25em] text-[#e8720c] font-semibold">Thông số kỹ thuật sản phẩm</div>
                    <h3 className="mt-2 text-2xl font-light text-white sm:text-3xl">
                      {selectedProduct.code} · {selectedProduct.name}
                    </h3>
                  </div>
                  <div className="h-3 w-3 shrink-0 rounded-full mt-2" style={{ backgroundColor: activeCollection.accent }} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Bộ sưu tập', activeCollection.name],
                    ['Số mã hiển thị', String(activeCollection.products.length)],
                    ['Cấu trúc sợi', selectedProduct.spec.pile],
                    ['Kết cấu', selectedProduct.spec.construction],
                    ['Đế thảm', selectedProduct.spec.backing],
                    ['Kích thước', selectedProduct.spec.size],
                    ['Phù hợp', selectedProduct.spec.useCase],
                    ['Lắp đặt', selectedProduct.spec.installation],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-[#e8720c] font-semibold">{label}</div>
                      <div className="mt-1 text-base leading-6 text-white/80">{value}</div>
                    </div>
                  ))}
                  {activeCollection.applications.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:col-span-2">
                      <div className="text-xs uppercase tracking-[0.18em] text-[#e8720c] font-semibold">Ứng dụng</div>
                      <div className="mt-1 text-base leading-6 text-white/80">{activeCollection.applications.join(' · ')}</div>
                    </div>
                  )}
                  {selectedProduct.colors?.length ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:col-span-2">
                      <div className="text-xs uppercase tracking-[0.18em] text-[#e8720c] font-semibold">Sắc độ gợi ý</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedProduct.colors.map((c) => (
                          <span key={c} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white/70 font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-base text-white/40">
                Chọn sản phẩm để xem thông số kỹ thuật
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── NEWS SECTION ── */}
      <section id="news" className="w-full bg-[#f5f3f0] py-16 border-b border-black/5">
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
                    {activeNews.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
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

      {/* ── PRODUCTS GRID & CATALOGUE ── */}
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
                <ProductCard key={product.code} product={product} accent={activeCollection.accent} onClick={() => setSelectedModalProduct(product)} dark />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BROCHURES & DOCUMENTS ── */}
      <section id="tai-lieu" className="w-full bg-[#f5f3f0] py-16 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[30px] border border-black/8 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-5 lg:p-7 space-y-5">
            <div className="flex items-center gap-2 text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">
              <FileText size={16} />
              Brochure · Spec · Hướng dẫn
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeCollection.resources.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-black/8 bg-[#f5f3f0] p-4 shadow-sm transition-all duration-200 hover:border-[#e8720c]/40 hover:shadow-md hover:bg-white"
                >
                  <div>
                    <div className="text-base font-medium text-[#1a1a1a]">{resource.label}</div>
                    <div className="mt-1 text-sm uppercase tracking-[0.18em] text-[#e8720c] font-semibold">{resourceLabels[resource.type]}</div>
                  </div>
                  <span className="rounded-full bg-[#e8720c] p-2 text-white shadow-[0_6px_16px_rgba(232,114,12,0.22)]">
                    <Download size={15} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY & ALL IMAGES ── */}
      <section className="w-full bg-[#1a1a1a] py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Photos Grid */}
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 md:p-6 space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-2 text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">
              <Sparkles size={16} />
              Toàn bộ hình ảnh trong bộ sưu tập
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {collectionGallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => {
                    setSelectedImage(image)
                  }}
                  className="group overflow-hidden rounded-[22px] border border-white/10 bg-white/5 text-left shadow-sm animate-fade-in transition duration-300 hover:border-white/30"
                >
                  <div className="h-44 w-full overflow-hidden sm:h-48 border-b border-white/10 bg-black/20">
                    <img src={image} alt={`${activeCollection.name} ${index + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                  </div>
                  <div className="px-4 py-3 text-base text-white/80 font-medium">Hình ảnh bộ sưu tập #{index + 1}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Collections list page detail link */}
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 md:p-6 space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-2 text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">
              <FileText size={16} />
              Trang chi tiết từng collection
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {collections.map((item) => (
                <a
                  key={item.id}
                  href={`#collection-${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  className="overflow-hidden rounded-[26px] border border-white/10 bg-white/5 shadow-sm transition-all duration-300 hover:border-[#e8720c]/40 hover:bg-white/10 group"
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

      {/* ── PORTFOLIO RESOURCES ── */}
      <section className="w-full bg-[#f5f3f0] py-16 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-[30px] border border-black/8 bg-white p-6 shadow-sm space-y-4">
            <div className="text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">Tài liệu tổng hợp</div>
            <h3 className="text-2xl font-light text-[#1a1a1a] sm:text-3xl">Portfolio hỗ trợ khách hàng</h3>
            <p className="text-base leading-7 text-black/70">
              Mỗi bộ sưu tập mang đến giải pháp thẩm mỹ rõ ràng cho từng kiểu không gian, giúp khách hàng dễ hình dung hiệu quả
              hoàn thiện, nâng chất lượng cảm nhận và tạo giá trị sử dụng bền vững cho công trình.
            </p>
          </div>

          <div className="grid gap-3">
            {featuredResources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-[24px] border border-black/8 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#e8720c]/40 hover:shadow-md hover:bg-[#fafaf8]"
              >
                <div>
                  <div className="text-base font-medium text-[#1a1a1a]">{resource.label}</div>
                  <div className="mt-1 text-sm uppercase tracking-[0.2em] text-[#e8720c] font-semibold">{resourceLabels[resource.type]}</div>
                </div>
                <span className="rounded-full border border-[#e8720c]/30 bg-[#e8720c]/5 p-2 text-[#e8720c] transition duration-200">
                  <ArrowRight size={16} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT & FOOTER (High Contrast Charcoal Black) ── */}
      <footer id="lien-he-nhanh" className="relative w-full bg-[#1a1a1a] text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          
          {/* Info Side */}
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-6">
            <div>
              <div className="text-base uppercase tracking-[0.22em] text-[#e8720c] font-medium">Thông tin liên hệ</div>
              <h3 className="mt-3 text-2xl font-light text-white sm:text-3xl">Kết nối tư vấn dự án và lựa chọn collection phù hợp</h3>
            </div>
            
            <div className="space-y-4 text-base text-white/80">
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-[#e8720c]/20 p-2 text-[#e8720c]"><Phone size={16} /></span>
                <div>
                  <div className="text-white font-medium font-sans">Điện thoại / Zalo / Viber / WhatsApp</div>
                  <div className="mt-1 text-white/70">{contactInfo.hotline}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-[#e8720c]/20 p-2 text-[#e8720c]"><Mail size={16} /></span>
                <div>
                  <div className="text-white font-medium font-sans">Email</div>
                  <div className="mt-1 text-white/70">{contactInfo.email}</div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                <div className="text-white font-medium font-sans">{contactInfo.company}</div>
                <div className="mt-2 leading-7 text-white/70 font-sans">Địa chỉ: {contactInfo.address}</div>
                <div className="mt-1 leading-7 text-white/60 font-sans">{contactInfo.hours}</div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/40 shadow-inner">
              <iframe
                title="Bản đồ Nội Thất Công Cộng Minh Đức"
                src="https://www.google.com/maps?q=G04-L04%20An%20Quy%20Villa%20KDT%20Moi%20Duong%20Noi%20Ha%20Noi&z=17&output=embed"
                className="h-[280px] w-full border-0 opacity-85 hover:opacity-100 transition duration-300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form Side */}
          <div className="space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-6">
              <div>
                <div className="text-base uppercase tracking-[0.22em] text-[#e8720c] font-medium font-sans">Yêu cầu của khách hàng</div>
                <h3 className="mt-3 text-2xl font-light text-white">Gửi nhu cầu để nhận đề xuất bộ sưu tập phù hợp</h3>
              </div>
              <form className="grid gap-4 md:grid-cols-2">
                <input value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c]" placeholder="Họ và tên" />
                <input value={formData.phone} onChange={(e) => handleFormChange('phone', e.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c]" placeholder="Số điện thoại" />
                <input value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c] md:col-span-2" placeholder="Email / công ty" />
                <input value={formData.project} onChange={(e) => handleFormChange('project', e.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c] md:col-span-2" placeholder="Dự án quan tâm / bộ sưu tập mong muốn" />
                <textarea value={formData.message} onChange={(e) => handleFormChange('message', e.target.value)} className="min-h-36 rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c] md:col-span-2" placeholder="Mô tả yêu cầu: diện tích, phong cách, mức độ sang trọng, tiến độ thi công..." />
                <button type="button" onClick={handleSubmit} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8720c] px-6 py-3 text-base font-medium text-white shadow-[0_12px_30px_rgba(232,114,12,0.35)] transition duration-200 hover:bg-[#ff8a24] md:col-span-2 md:w-fit cursor-pointer">
                  Gửi yêu cầu tư vấn
                  <Send size={16} />
                </button>
                {formStatus ? <div className="text-base text-[#e8720c] md:col-span-2">{formStatus}</div> : null}
              </form>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-5">
              <div className="text-base uppercase tracking-[0.22em] text-[#e8720c] font-medium font-sans">Liên hệ nhanh đa kênh</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Zalo', href: `https://zalo.me/${contactInfo.hotline}`, icon: MessageCircle },
                  { label: 'WhatsApp', href: `https://wa.me/84${contactInfo.hotline.replace(/^0/, '')}`, icon: MessageCircle },
                  { label: 'Facebook', href: 'https://www.facebook.com/noithatcongcong', icon: MessageCircle },
                  { label: 'Điện thoại', href: `tel:${contactInfo.hotline}`, icon: Phone },
                ].map((channel) => {
                  const Icon = channel.icon
                  return (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target={channel.href.startsWith('http') ? '_blank' : undefined}
                      rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-base text-white/80 transition-all duration-200 hover:border-[#e8720c]/50 hover:bg-white/10 hover:text-white"
                    >
                      <span className="inline-flex items-center gap-3 font-sans">
                        <span className="rounded-full bg-[#e8720c]/20 p-2 text-[#ffd891]"><Icon size={16} /></span>
                        {channel.label}
                      </span>
                      <ExternalLink size={14} className="text-[#e8720c]" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {selectedImage ? (
        <button
          type="button"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <img src={selectedImage} alt="Collection preview" className="max-h-[90vh] max-w-[92vw] rounded-[28px] border border-white/10 object-contain shadow-2xl animate-fade-in" />
        </button>
      ) : null}

      <AnimatePresence>
        {selectedModalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setSelectedModalProduct(null)} />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-[32px] border border-black/10 bg-white text-[#1a1a1a] shadow-2xl scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10"
            >
              <button 
                onClick={() => setSelectedModalProduct(null)}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black/70 hover:bg-black/20 hover:text-black backdrop-blur-md transition cursor-pointer font-bold"
              >
                ✕
              </button>

              <div className="grid md:grid-cols-[1fr_1fr] h-full min-h-[500px]">
                <div className="bg-[#f5f3f0] h-64 md:h-auto border-r border-black/5 flex items-center justify-center">
                   {selectedModalProduct.image ? (
                     <img src={selectedModalProduct.image} alt={selectedModalProduct.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="text-black/35 font-sans">Chưa có hình ảnh</div>
                   )}
                </div>
                <div className="p-8 md:p-10 space-y-6">
                   <div>
                      <div className="text-base uppercase tracking-[0.25em] text-[#e8720c] font-semibold">{selectedModalProduct.code}</div>
                      <h3 className="mt-2 text-3xl font-light text-[#1a1a1a]">{selectedModalProduct.name}</h3>
                   </div>
                   
                   <div className="space-y-4 rounded-[24px] border border-black/8 bg-[#f5f3f0] p-6 shadow-inner">
                     <div className="text-sm uppercase tracking-[0.22em] text-[#e8720c] font-semibold">Thông số kỹ thuật chi tiết</div>
                     <div className="grid gap-3 text-base leading-7 text-black/80 font-sans">
                       <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Cấu trúc sợi:</span> <span>{selectedModalProduct.spec.pile}</span></div>
                       <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Kết cấu:</span> <span>{selectedModalProduct.spec.construction}</span></div>
                       <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Đế thảm:</span> <span>{selectedModalProduct.spec.backing}</span></div>
                       <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Kích thước:</span> <span>{selectedModalProduct.spec.size}</span></div>
                       <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Phù hợp:</span> <span>{selectedModalProduct.spec.useCase}</span></div>
                       <div className="flex gap-2"><span className="text-[#8a5829] w-24 shrink-0 font-medium">Lắp đặt:</span> <span>{selectedModalProduct.spec.installation}</span></div>
                     </div>
                   </div>

                   <div className="space-y-3">
                      <div className="text-sm uppercase tracking-[0.22em] text-[#e8720c] font-semibold">Đặc điểm nổi bật</div>
                      {selectedModalProduct.highlights.map((point) => (
                        <div key={point} className="flex items-start gap-3 text-base leading-6 text-black/75">
                          <span className="mt-2 shrink-0 h-1.5 w-1.5 rounded-full bg-[#e8720c]" />
                          <span className="font-sans">{point}</span>
                        </div>
                      ))}
                   </div>

                   {selectedModalProduct.colors?.length ? (
                     <div className="pt-4 border-t border-black/5">
                       <div className="text-sm uppercase tracking-[0.22em] text-[#e8720c] font-semibold">Sắc độ gợi ý</div>
                       <div className="mt-2 flex gap-2 flex-wrap">
                         {selectedModalProduct.colors.map(color => (
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
      <AIChatbot />
    </div>
  )
}

function ProductCard({ product, accent, onClick, dark }: { product: Product; accent: string; onClick?: () => void; dark?: boolean }) {
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

export default PublicApp
