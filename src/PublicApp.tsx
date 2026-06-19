import { useEffect, useMemo, useState } from 'react'
import { fetchCollections, type Product, type CollectionItem } from './lib/collections'
import { AIChatbot } from './components/ui/AIChatbot'
import { HeroSection } from './components/ui/HeroSection'
import { ValueSpecsSection } from './components/ui/ValueSpecsSection'
import { GallerySection } from './components/ui/GallerySection'
import { CollectionSidebar } from './components/ui/CollectionSidebar'
import { ProductDetailView } from './components/ui/ProductDetailView'
import { ResourcesSection } from './components/ui/ResourcesSection'

// New extracted components
import { CollectionList } from './components/ui/CollectionList'
import { ProductsGrid } from './components/ui/ProductsGrid'
import { PortfolioResources } from './components/ui/PortfolioResources'
import { NewsSection } from './components/ui/NewsSection'
import { PublicFooter } from './components/ui/PublicFooter'
import { ProductModal } from './components/ui/ProductModal'

export default function PublicApp() {
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedProductIndex, setSelectedProductIndex] = useState(0)
  const [selectedModalProduct, setSelectedModalProduct] = useState<Product | null>(null)
  const [loadError, setLoadError] = useState(false)

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
  }, [query, collections])

  const activeCollection =
    filteredCollections.find((item) => item.id === activeId) ?? filteredCollections[0] ?? collections[0]

  const [prevCollectionId, setPrevCollectionId] = useState(activeCollection?.id || '')
  if (activeCollection && activeCollection.id !== prevCollectionId) {
    setPrevCollectionId(activeCollection.id)
    setSelectedProductIndex(0)
  }

  const productShowcase = activeCollection?.products?.map((product) => product.image).filter(Boolean) as string[] || []
  const selectedProduct = activeCollection?.products?.[selectedProductIndex] ?? activeCollection?.products?.[0]
  const currentSlide = selectedProduct?.image ?? productShowcase[selectedProductIndex] ?? activeCollection?.heroImage

  // Fetch data on mount
  useEffect(() => {
    fetchCollections().then((cols) => {
      if (cols.length > 0) {
        setCollections(cols)
        setActiveId(cols[0].id)
      } else {
        setLoadError(true)
      }
    })
  }, [])

  if (collections.length === 0 && !loadError) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e8720c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-medium text-white/90 uppercase tracking-widest">Đang tải dữ liệu</h2>
        </div>
      </div>
    )
  }

  if (loadError || collections.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-lg font-medium text-white/90">Không thể tải dữ liệu</h2>
          <p className="text-white/50">Vui lòng kiểm tra kết nối và thử lại</p>
          <button onClick={() => window.location.reload()} className="bg-[#e8720c] text-white px-6 py-2.5 rounded font-semibold">
            Tải lại trang
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#1a1a1a] selection:bg-[#e8720c]/20">
      {/* ── HERO SECTION ── */}
      <HeroSection />

      {/* ── CHI TIẾT TỪNG COLLECTION ── */}
      <CollectionList collections={collections} setActiveId={setActiveId} />

      {/* ── COLLECTIONS SHOWCASE ── */}
      <section id="collections" className="w-full bg-[#1a1a1a] py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] items-stretch">
            
            {/* SIDEBAR */}
            <CollectionSidebar
              query={query}
              setQuery={setQuery}
              filteredCollections={filteredCollections}
              activeCollection={activeCollection}
              setActiveId={setActiveId}
              setSelectedProductIndex={setSelectedProductIndex}
            />

            {/* PRODUCT DETAIL VIEW */}
            <ProductDetailView
              activeCollection={activeCollection}
              selectedProduct={selectedProduct}
              currentSlide={currentSlide}
              productShowcase={productShowcase}
              setSelectedProductIndex={setSelectedProductIndex}
            />
          </div>
        </div>
      </section>

      {/* ── VALUE & SPEC SECTION ── */}
      <ValueSpecsSection collection={activeCollection} selectedProduct={selectedProduct} />

      {/* ── PRODUCTS GRID & CATALOGUE ── */}
      <ProductsGrid 
        activeCollection={activeCollection} 
        onProductClick={setSelectedModalProduct} 
      />

      {/* ── BROCHURES & DOCUMENTS ── */}
      <ResourcesSection collection={activeCollection} />

      {/* ── GALLERY & ALL IMAGES ── */}
      <GallerySection collection={activeCollection} productShowcase={productShowcase} setSelectedImage={setSelectedImage} />

      {/* ── PORTFOLIO RESOURCES ── */}
      <PortfolioResources />

      {/* ── NEWS SECTION ── */}
      <NewsSection />

      {/* ── CONTACT & FOOTER ── */}
      <PublicFooter activeCollection={activeCollection} />

      {/* ── IMAGE MODAL ── */}
      {selectedImage ? (
        <button
          type="button"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <img src={selectedImage} alt="Collection preview" className="max-h-[90vh] max-w-[92vw] rounded-[28px] border border-white/10 object-contain shadow-2xl animate-fade-in" />
        </button>
      ) : null}

      {/* ── PRODUCT MODAL ── */}
      <ProductModal 
        product={selectedModalProduct} 
        onClose={() => setSelectedModalProduct(null)} 
      />

      <AIChatbot />
    </div>
  )
}
