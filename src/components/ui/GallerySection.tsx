import { useEffect, useState, useMemo } from 'react'
import { Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CollectionItem } from '@/lib/collections'

interface GallerySectionProps {
  collection: CollectionItem
  productShowcase: string[]
  setSelectedImage: (image: string | null) => void
}

export function GallerySection({ collection, productShowcase, setSelectedImage }: GallerySectionProps) {
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!collection?.dbId) return
    const fetchGallery = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('collection_galleries')
          .select('image_url')
          .eq('collection_id', collection.dbId)

        if (error) {
          console.error('Error fetching gallery:', error)
          setGalleryImages(collection.gallery || [])
        } else if (data && data.length > 0) {
          setGalleryImages(data.map((row) => row.image_url))
        } else {
          setGalleryImages(collection.gallery || [])
        }
      } catch (err) {
        console.error(err)
        setGalleryImages(collection.gallery || [])
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [collection])

  const combinedGallery = useMemo(() => {
    const merged = [...productShowcase, ...galleryImages]
    const unique = Array.from(new Set(merged))
    return unique.filter(
      (image) =>
        !/Specification|Installation|Capture|DV700-DV800|2024-port|2024-qs|Recommended|Brochure|Disc\.jpg|055\.jpg|install|DeclareLabel|Red-List-Free|หน้าเปล่า/i.test(
          image,
        ),
    )
  }, [galleryImages, productShowcase])

  return (
    <section className="w-full bg-[#1a1a1a] py-16 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Photos Grid */}
        <div className="rounded-[30px] border border-white/10 bg-[#262626] p-5 md:p-6 space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">
            <Sparkles size={16} />
            Toàn bộ hình ảnh trong bộ sưu tập
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-2 border-[#e8720c] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {combinedGallery.map((image, index) => (
                <button
                  key={`\${image}-\${index}`}
                  type="button"
                  onClick={() => {
                    setSelectedImage(image)
                  }}
                  className="group overflow-hidden rounded-[22px] border border-white/10 bg-white/5 text-left shadow-sm animate-fade-in transition duration-300 hover:border-white/30"
                >
                  <div className="h-44 w-full overflow-hidden sm:h-48 border-b border-white/10 bg-black/20">
                    <img src={image} alt={`\${collection.name} \${index + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                  </div>
                  <div className="px-4 py-3 text-base text-white/80 font-medium">Hình ảnh bộ sưu tập #{index + 1}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
