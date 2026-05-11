import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Check, ChevronRight, Download, FileText, Grid2x2, Images, Mail, Phone, Search, Send, Sparkles } from 'lucide-react'
import { collections, contactInfo, featuredResources, type Product, type ResourceLink } from './lib/collections'

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
                <h1 className="max-w-3xl font-serif text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
                  Không gian bán hàng sang trọng, truy cập nhanh toàn bộ collection, brochure và hướng dẫn.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
                  Website tiếng Việt được tổ chức để khách hàng xem nhanh từng bộ sưu tập, cảm nhận rõ giá trị thẩm mỹ,
                  tải brochure, xem hướng dẫn lắp đặt và khám phá hình ảnh sản phẩm theo cách trực tiếp, tinh tế và đẳng cấp.
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
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['09+', 'Bộ sưu tập nổi bật'],
                  ['30+', 'Mã sản phẩm giới thiệu'],
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
                <img
                  src={activeCollection.heroImage}
                  alt={activeCollection.name}
                  className="h-[320px] w-full rounded-[22px] object-cover"
                />
                <div className="mt-4 space-y-3 px-1 pb-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.28em] text-[#ffd184]">Bộ sưu tập đang nổi bật</div>
                      <h2 className="mt-2 text-2xl font-light">{activeCollection.name}</h2>
                    </div>
                    <div
                      className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#1a120e]"
                      style={{ backgroundColor: activeCollection.accent }}
                    >
                      luxury
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-white/82">{activeCollection.tagline}</p>
                </div>
              </div>
            </div>
          </div>

          <section id="collections" className="grid gap-6 px-6 py-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-10 lg:py-8">
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
                      onClick={() => setActiveId(item.id)}
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
            </aside>

            <section className="space-y-6">
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#19110d]/70 backdrop-blur-md">
                <div className="grid gap-6 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#ffd184]">
                        Chi tiết sản phẩm
                      </span>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/78">{activeCollection.products.length} mã giới thiệu</span>
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
                    <img
                      src={activeCollection.heroImage}
                      alt={activeCollection.name}
                      className="h-[300px] w-full rounded-[24px] object-cover"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      {activeCollection.gallery.map((image) => (
                        <button key={image} type="button" onClick={() => setSelectedImage(image)} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                          <img src={image} alt={activeCollection.name} className="h-24 w-full object-cover transition hover:scale-105" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-5 lg:p-6 backdrop-blur-md">
                <div className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#ffd184]">
                  <Sparkles size={16} />
                  Toàn bộ hình ảnh trong bộ sưu tập
                </div>
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {activeCollection.gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#120b08]/70 text-left"
                    >
                      <img src={image} alt={`${activeCollection.name} ${index + 1}`} className="h-40 w-full object-cover transition duration-300 group-hover:scale-105" />
                      <div className="px-4 py-3 text-sm text-white/82">Hình ảnh bộ sưu tập #{index + 1}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
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
                      {activeCollection.applications.map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 p-4">
                          <span className="mt-0.5 rounded-full bg-[#f29d38]/22 p-2 text-[#ffbe63]">
                            <Check size={15} />
                          </span>
                          <div>
                            <div className="text-sm font-medium text-white">{item}</div>
                            <div className="mt-1 text-sm leading-6 text-white/76">
                              Tối ưu trải nghiệm thị giác, gia tăng cảm giác đầu tư chỉn chu và hỗ trợ định vị hình ảnh cao cấp.
                            </div>
                          </div>
                        </div>
                      ))}
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
            </section>
          </section>

          <section className="grid gap-6 border-t border-white/10 px-6 py-8 lg:grid-cols-[1fr_1fr] lg:px-10">
            <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-6 backdrop-blur-md">
              <div className="text-sm uppercase tracking-[0.22em] text-[#ffd184]">Tài liệu tổng hợp</div>
              <h3 className="mt-3 text-2xl font-light">Portfolio hỗ trợ tư vấn và trình bày nhanh với khách hàng</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">
                Ngoài các brochure riêng của từng collection, website còn tổng hợp portfolio để đội ngũ kinh doanh dễ dàng chia sẻ,
                trình bày ý tưởng mix & match và giới thiệu năng lực thiết kế tùy biến.
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

          <section className="grid gap-6 border-t border-white/10 px-6 py-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-10">
            <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-6 backdrop-blur-md">
              <div className="text-sm uppercase tracking-[0.22em] text-[#ffd184]">Thông tin liên hệ</div>
              <h3 className="mt-3 text-2xl font-light">Kết nối tư vấn dự án và lựa chọn collection phù hợp</h3>
              <div className="mt-6 space-y-4 text-sm text-white/82">
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-[#f29d38]/20 p-2 text-[#ffbe63]"><Phone size={16} /></span>
                  <div>
                    <div className="text-white">Hotline</div>
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
                  <div className="mt-2 leading-7 text-white/72">{contactInfo.address}</div>
                  <div className="mt-1 text-white/70">{contactInfo.hours}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#19110d]/70 p-6 backdrop-blur-md">
              <div className="text-sm uppercase tracking-[0.22em] text-[#ffd184]">Yêu cầu của khách hàng</div>
              <h3 className="mt-3 text-2xl font-light">Gửi nhu cầu để nhận đề xuất bộ sưu tập phù hợp</h3>
              <form className="mt-6 grid gap-4 md:grid-cols-2">
                <input className="rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45" placeholder="Họ và tên" />
                <input className="rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45" placeholder="Số điện thoại" />
                <input className="rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 md:col-span-2" placeholder="Email / công ty" />
                <input className="rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 md:col-span-2" placeholder="Dự án quan tâm / bộ sưu tập mong muốn" />
                <textarea className="min-h-36 rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 md:col-span-2" placeholder="Mô tả yêu cầu: diện tích, phong cách, mức độ sang trọng, tiến độ thi công..." />
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f29d38] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(242,157,56,0.28)] transition hover:bg-[#ffae4e] md:col-span-2 md:w-fit">
                  Gửi yêu cầu tư vấn
                  <Send size={16} />
                </button>
              </form>
            </div>
          </section>
        </section>
      </main>

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
