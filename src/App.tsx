import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, Check, ChevronRight, Download, ExternalLink, FileText, Grid2x2, Images, Mail, MessageCircle, Phone, Search, Send, Sparkles } from 'lucide-react'
import { collectionHeroRotator, collections, contactInfo, featuredResources, type Product, type ResourceLink } from './lib/collections'

const resourceLabels: Record<ResourceLink['type'], string> = {
  brochure: 'Brochure',
  spec: 'Thông số',
  guide: 'Hướng dẫn',
  portfolio: 'Portfolio',
}

function App() {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(collections[0].id)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedProductIndex, setSelectedProductIndex] = useState(0)
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

  useEffect(() => {
    setSelectedProductIndex(0)
  }, [activeCollection.id])

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

  const detailPages = collections.map((item) => ({
    id: item.id,
    label: item.name,
    href: `#collection-${item.id}`,
  }))

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
    <div className="min-h-screen bg-[#120b08] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,186,91,0.16),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent_25%)]" />

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[32px] border border-white/12 bg-[#201511]/68 shadow-[0_30px_120px_rgba(0,0,0,0.58)] backdrop-blur-xl">
          <div className="grid gap-10 border-b border-white/10 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffbe63]/35 bg-[#ffbe63]/14 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#ffd891]">
                <span className="h-2 w-2 rounded-full bg-[#ffb95a]" />
                Bộ sưu tập thảm cao cấp
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
                  Catalog thảm Carpets Inter
                </h1>
                <p className="max-w-3xl text-xl font-light leading-9 text-[#ffd184] sm:text-2xl">
                  Bề mặt tĩnh lặng cho không gian có chiều sâu.
                </p>
                <p className="max-w-3xl text-base leading-8 text-white/82 sm:text-lg">
                  Một trải nghiệm catalog Tiếng Việt dành cho kiến trúc sư, nhà thiết kế và chủ đầu tư: tối giản, giàu chất liệu,
                  tập trung vào cấu trúc sợi, nhịp màu và cảm giác sử dụng trong không gian hiện đại.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#collections"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f29d38] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(242,157,56,0.28)] transition hover:bg-[#ffae4e]"
                >
                  Xem bộ sưu tập
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#tai-lieu"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ffd08f]/30 bg-white/6 px-6 py-3 text-sm text-white transition hover:border-[#ffbe63]/60 hover:bg-white/10"
                >
                  Tài liệu nổi bật
                  <BookOpen size={16} />
                </a>
                <a
                  href="#lien-he-nhanh"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ffbe63]/30 bg-[#ffbe63]/12 px-6 py-3 text-sm text-[#ffe0ad] transition hover:bg-[#ffbe63]/18"
                >
                  Liên hệ nhanh
                  <MessageCircle size={16} />
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['09+', 'Bộ sưu tập nổi bật'],
                  ['50+', 'Mã sản phẩm giới thiệu'],
                  ['20+', 'Brochure, spec, hướng dẫn'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <div className="text-2xl font-light text-[#ffd184]">{value}</div>
                    <div className="mt-1 text-sm leading-6 text-white/78">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-10 hidden h-32 w-32 rounded-full bg-[#f0a53d]/20 blur-3xl lg:block" />
              <div className="overflow-hidden rounded-[28px] border border-[#ffbe63]/20 bg-[#160e0b]/75 p-4 backdrop-blur-md">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={heroCollection.id}
                    src={heroCollection.image}
                    alt={heroCollection.name}
                    initial={{ opacity: 0.3, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.2, scale: 0.98 }}
                    transition={{ duration: 0.55 }}
                    className="h-[320px] w-full rounded-[22px] object-cover"
                  />
                </AnimatePresence>
                <div className="mt-4 space-y-3 px-1 pb-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.28em] text-[#ffd184]">Bộ sưu tập đang nổi bật</div>
                      <h2 className="mt-2 text-2xl font-light">{heroCollection.name}</h2>
                    </div>
                    <div
                      className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#1a120e]"
                      style={{ backgroundColor: heroCollection.accent }}
                    >
                      luxury
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-white/82">{heroCollection.tagline}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {collectionHeroRotator.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setHeroCollectionIndex(index)}
                        className={`h-2.5 rounded-full transition ${index === heroCollectionIndex ? 'w-8 bg-[#ffbe63]' : 'w-2.5 bg-white/28 hover:bg-white/45'}`}
                        aria-label={`Chọn ${item.name}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="collections" className="grid gap-6 px-4 py-6 md:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-10 lg:py-8 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-5">
              <div className="rounded-[28px] border border-white/10 bg-[#18100d]/72 p-5 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#ffd184]">
                  <Grid2x2 size={16} />
                  Collection
                </div>
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm theo tên, mã, đặc tính..."
                    className="w-full rounded-2xl border border-white/12 bg-white/7 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#ffbe63]/50"
                  />
                </label>
                <div className="mt-4 text-sm leading-7 text-white/76">
                  Truy cập nhanh từng bộ sưu tập, hỗ trợ khách hàng xem và chốt lựa chọn thuận tiện hơn.
                </div>
              </div>

              <div className="max-h-[780px] space-y-3 overflow-auto pr-1">
                {filteredCollections.map((item) => {
                  const active = item.id === activeCollection.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveId(item.id)
                        setSelectedProductIndex(0)
                      }}
                      className={`w-full rounded-[24px] border p-4 text-left transition ${
                        active
                          ? 'border-[#ffbe63]/50 bg-[#2f2019]/70 shadow-[0_20px_60px_rgba(0,0,0,0.35)]'
                          : 'border-white/10 bg-[#18100d]/65 hover:border-white/20 hover:bg-[#231712]/72'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-light text-white">{item.name}</div>
                          <div className="mt-2 line-clamp-2 text-sm leading-6 text-white/76">{item.tagline}</div>
                        </div>
                        <ChevronRight size={18} className={active ? 'text-[#f0a53d]' : 'text-white/30'} />
                      </div>
                    </button>
                  )
                })}
                {!filteredCollections.length && (
                  <div className="rounded-[24px] border border-dashed border-white/15 bg-white/5 p-5 text-sm text-white/68">
                    Không tìm thấy bộ sưu tập phù hợp. Hãy thử từ khóa khác.
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#18100d]/72 p-5 backdrop-blur-md">
                <div className="mb-4 text-sm uppercase tracking-[0.22em] text-[#ffd184]">Trang chi tiết nhanh</div>
                <div className="space-y-2">
                  {detailPages.map((page) => (
                    <a
                      key={page.id}
                      href={page.href}
                      onClick={() => {
                        setActiveId(page.id)
                        setSelectedProductIndex(0)
                      }}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:border-[#ffbe63]/45 hover:text-white"
                    >
                      <span>{page.label}</span>
                      <ExternalLink size={14} className="text-[#ffbe63]" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            <section className="space-y-6 lg:col-span-1">
              <div id={`collection-${activeCollection.id}`} className="overflow-hidden rounded-[30px] border border-white/10 bg-[#19110d]/70 backdrop-blur-md">
                <div className="grid gap-6 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#ffd184]">
                        Chi tiết sản phẩm
                      </span>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/78">{activeCollection.products.length} mã sản phẩm</span>
                    </div>

                    <div>
                      <h2 className="text-3xl font-light sm:text-4xl">{activeCollection.name}</h2>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#ffd184]">{activeCollection.tagline}</p>
                    </div>

                    <p className="text-sm leading-8 text-white/84">{activeCollection.summary}</p>
                    <p className="text-sm leading-8 text-white/74">{activeCollection.detail}</p>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {activeCollection.quickFacts.map((fact) => (
                        <div key={fact} className="rounded-2xl border border-white/10 bg-white/6 p-4 text-sm leading-6 text-white/84">
                          {fact}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#120b08]/60">
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
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {productShowcase.map((image, index) => (
                        <button
                          key={image}
                          type="button"
                          onClick={() => {
                            setSelectedProductIndex(index)
                          }}
                          className={`overflow-hidden rounded-2xl border bg-white/5 ${image === currentSlide ? 'border-[#ffbe63]/60' : 'border-white/10'}`}
                        >
                          <img src={image} alt={activeCollection.name} className="h-24 w-full object-cover transition hover:scale-105" />
                        </button>
                      ))}
                    </div>
                    {selectedProduct ? (
                      <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                        <div className="text-xs uppercase tracking-[0.22em] text-[#ffd184]">Thông số kỹ thuật sản phẩm</div>
                        <h3 className="mt-3 text-xl font-light text-white">{selectedProduct.code} · {selectedProduct.name}</h3>
                        <div className="mt-4 grid gap-2 text-sm leading-7 text-white/80">
                          <div><span className="text-[#ffd184]">Bộ sưu tập:</span> {activeCollection.name}</div>
                          <div><span className="text-[#ffd184]">Số mã hiển thị:</span> {activeCollection.products.length}</div>
                          <div><span className="text-[#ffd184]">Cấu trúc sợi:</span> {selectedProduct.spec.pile}</div>
                          <div><span className="text-[#ffd184]">Kết cấu:</span> {selectedProduct.spec.construction}</div>
                          <div><span className="text-[#ffd184]">Đế thảm:</span> {selectedProduct.spec.backing}</div>
                          <div><span className="text-[#ffd184]">Kích thước:</span> {selectedProduct.spec.size}</div>
                          <div><span className="text-[#ffd184]">Ứng dụng:</span> {activeCollection.applications.join(' · ')}</div>
                          <div><span className="text-[#ffd184]">Phù hợp:</span> {selectedProduct.spec.useCase}</div>
                          <div><span className="text-[#ffd184]">Lắp đặt:</span> {selectedProduct.spec.installation}</div>
                          {selectedProduct.colors?.length ? <div><span className="text-[#ffd184]">Sắc độ:</span> {selectedProduct.colors.join(' · ')}</div> : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] lg:col-span-2">
                <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-5 lg:p-6 backdrop-blur-md">
                  <div className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#ffd184]">
                    <Images size={16} />
                    Danh mục sản phẩm trong bộ sưu tập
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {activeCollection.products.map((product) => (
                      <ProductCard key={product.code} product={product} accent={activeCollection.accent} />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-5 lg:p-6 backdrop-blur-md">
                    <div className="mb-4 text-sm uppercase tracking-[0.22em] text-[#ffd184]">Giá trị nổi bật mang lại</div>
                    <div className="space-y-3">
                      {activeCollection.valuePoints.map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 p-4">
                          <span className="mt-0.5 rounded-full bg-[#f29d38]/22 p-2 text-[#ffbe63]">
                            <Check size={15} />
                          </span>
                          <div className="text-sm leading-7 text-white/84">{item}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-2xl border border-[#ffbe63]/25 bg-[#ffbe63]/10 p-4 text-sm leading-7 text-[#ffe0ad]">
                      Liên hệ ngay để được tư vấn đúng bộ sưu tập, đúng cấu trúc bề mặt và đúng sắc độ phù hợp với concept công trình của bạn.
                    </div>
                  </div>

                  <div id="tai-lieu" className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-5 lg:p-6 backdrop-blur-md">
                    <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#ffd184]">
                      <FileText size={16} />
                      Brochure · Spec · Hướng dẫn
                    </div>
                    <div className="space-y-3">
                      {activeCollection.resources.map((resource) => (
                        <a
                          key={resource.url}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/6 p-4 transition hover:border-[#ffbe63]/45 hover:bg-white/8"
                        >
                          <div>
                            <div className="text-sm text-white">{resource.label}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#ffd184]">{resourceLabels[resource.type]}</div>
                          </div>
                          <span className="rounded-full bg-[#f29d38] p-2 text-white shadow-[0_10px_24px_rgba(242,157,56,0.25)]">
                            <Download size={15} />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-5 backdrop-blur-md md:p-6 lg:col-span-2">
                <div className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#ffd184]">
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
                      className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#120b08]/70 text-left"
                    >
                      <img src={image} alt={`${activeCollection.name} ${index + 1}`} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-48" />
                      <div className="px-4 py-3 text-sm text-white/82">Hình ảnh bộ sưu tập #{index + 1}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-5 md:p-6 backdrop-blur-md lg:col-span-2">
                <div className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#ffd184]">
                  <FileText size={16} />
                  Trang chi tiết từng collection
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {collections.map((item) => (
                    <a
                      key={item.id}
                      href={`#collection-${item.id}`}
                      onClick={() => setActiveId(item.id)}
                      className="overflow-hidden rounded-[26px] border border-white/10 bg-[#140c09]/70 transition hover:border-[#ffbe63]/45 hover:bg-[#1c120e]"
                    >
                      <img src={item.heroImage} alt={item.name} className="h-44 w-full object-cover" />
                      <div className="space-y-3 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-lg font-light text-white">{item.name}</h4>
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.accent }} />
                        </div>
                        <p className="line-clamp-3 text-sm leading-6 text-white/72">{item.summary}</p>
                        <span className="inline-flex items-center gap-2 text-sm text-[#ffd184]">
                          Xem chi tiết
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </section>

          <section className="grid gap-6 border-t border-white/10 px-4 py-8 md:px-6 lg:grid-cols-[1fr_1fr] lg:px-10">
            <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-6 backdrop-blur-md">
              <div className="text-sm uppercase tracking-[0.22em] text-[#ffd184]">Tài liệu tổng hợp</div>
              <h3 className="mt-3 text-2xl font-light">Portfolio hỗ trợ khách hàng</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">
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
                  className="flex items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[#19110d]/70 p-5 transition hover:border-[#ffbe63]/45 hover:bg-[#251915]/85"
                >
                  <div>
                    <div className="text-base text-white">{resource.label}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#ffd184]">{resourceLabels[resource.type]}</div>
                  </div>
                  <span className="rounded-full border border-[#ffbe63]/45 bg-white/6 p-2 text-[#ffbe63]">
                    <ArrowRight size={16} />
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section id="lien-he-nhanh" className="grid gap-6 border-t border-white/10 px-4 py-8 md:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-10">
            <div>
              <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-6 backdrop-blur-md">
              <div className="text-sm uppercase tracking-[0.22em] text-[#ffd184]">Thông tin liên hệ</div>
              <h3 className="mt-3 text-2xl font-light">Kết nối tư vấn dự án và lựa chọn collection phù hợp</h3>
              <div className="mt-6 space-y-4 text-sm text-white/82">
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-[#f29d38]/20 p-2 text-[#ffbe63]"><Phone size={16} /></span>
                  <div>
                    <div className="text-white">Điện thoại / Zalo / Viber / WhatsApp</div>
                    <div className="mt-1 text-white/72">{contactInfo.hotline}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-[#f29d38]/20 p-2 text-[#ffbe63]"><Mail size={16} /></span>
                  <div>
                    <div className="text-white">Email</div>
                    <div className="mt-1 text-white/72">{contactInfo.email}</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="text-white">{contactInfo.company}</div>
                  <div className="mt-2 leading-7 text-white/72">Địa chỉ: {contactInfo.address}</div>
                  <div className="mt-1 leading-7 text-white/70">{contactInfo.hours}</div>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-[#120b08]/65">
                <iframe
                  title="Bản đồ Nội Thất Công Cộng Minh Đức"
                  src="https://www.google.com/maps?q=G04-L04%20An%20Quy%20Villa%20KDT%20Moi%20Duong%20Noi%20Ha%20Noi&z=17&output=embed"
                  className="h-[280px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-6 backdrop-blur-md">
                <div className="text-sm uppercase tracking-[0.22em] text-[#ffd184]">Yêu cầu của khách hàng</div>
                <h3 className="mt-3 text-2xl font-light">Gửi nhu cầu để nhận đề xuất bộ sưu tập phù hợp</h3>
                <form className="mt-6 grid gap-4 md:grid-cols-2">
                  <input value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)} className="rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45" placeholder="Họ và tên" />
                  <input value={formData.phone} onChange={(e) => handleFormChange('phone', e.target.value)} className="rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45" placeholder="Số điện thoại" />
                  <input value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)} className="rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 md:col-span-2" placeholder="Email / công ty" />
                  <input value={formData.project} onChange={(e) => handleFormChange('project', e.target.value)} className="rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 md:col-span-2" placeholder="Dự án quan tâm / bộ sưu tập mong muốn" />
                  <textarea value={formData.message} onChange={(e) => handleFormChange('message', e.target.value)} className="min-h-36 rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 md:col-span-2" placeholder="Mô tả yêu cầu: diện tích, phong cách, mức độ sang trọng, tiến độ thi công..." />
                  <button type="button" onClick={handleSubmit} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f29d38] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(242,157,56,0.28)] transition hover:bg-[#ffae4e] md:col-span-2 md:w-fit">
                    Gửi yêu cầu tư vấn
                    <Send size={16} />
                  </button>
                  {formStatus ? <div className="text-sm text-[#ffd184] md:col-span-2">{formStatus}</div> : null}
                </form>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-6 backdrop-blur-md">
                <div className="text-sm uppercase tracking-[0.22em] text-[#ffd184]">Liên hệ nhanh đa kênh</div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm text-white/82 transition hover:border-[#ffbe63]/45 hover:text-white"
                      >
                        <span className="inline-flex items-center gap-3">
                          <span className="rounded-full bg-[#f29d38]/18 p-2 text-[#ffbe63]"><Icon size={16} /></span>
                          {channel.label}
                        </span>
                        <ExternalLink size={14} className="text-[#ffd184]" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>

      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
        <a href={`https://wa.me/84${contactInfo.hotline.replace(/^0/, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#ffbe63]/40 bg-[#1a110d]/82 px-5 py-3 text-sm text-white transition hover:border-[#ffbe63]/65">
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <a href="https://www.facebook.com/noithatcongcong" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#ffbe63]/40 bg-[#1a110d]/82 px-5 py-3 text-sm text-white transition hover:border-[#ffbe63]/65">
          <MessageCircle size={16} />
          Facebook
        </a>
      </div>

      {selectedImage ? (
        <button
          type="button"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 p-4"
        >
          <img src={selectedImage} alt="Collection preview" className="max-h-[90vh] max-w-[92vw] rounded-[28px] border border-white/10 object-contain shadow-2xl" />
        </button>
      ) : null}
    </div>
  )
}

function ProductCard({ product, accent }: { product: Product; accent: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#221712]/72 p-5 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-white/58">{product.code}</div>
          <h3 className="mt-2 text-xl font-light text-white">{product.name}</h3>
        </div>
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
      </div>
      <div className="mt-4 space-y-2">
        {product.highlights.map((point) => (
          <div key={point} className="flex gap-3 text-sm leading-6 text-white/82">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ffbe63]" />
            <span>{point}</span>
          </div>
        ))}
      </div>
      {product.colors?.length ? (
        <div className="mt-4 text-xs uppercase tracking-[0.18em] text-[#ffd184]">Sắc độ gợi ý: {product.colors.join(' · ')}</div>
      ) : null}
    </div>
  )
}

export default App
