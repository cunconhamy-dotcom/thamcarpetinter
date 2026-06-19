import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Newspaper, Phone, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useSiteConfig } from '@/hooks/useSiteConfig'

interface HeroSectionProps {}

export function HeroSection({}: HeroSectionProps) {
  const { config } = useSiteConfig()
  const hotline = config.contact_info.hotline || config.contact_info.phone || '0908314939'
  const [heroData, setHeroData] = useState<any[]>([])
  const [heroCollectionIndex, setHeroCollectionIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data, error } = await supabase
          .from('ui_hero_sections')
          .select('*, collections(*)')
          .eq('is_active', true)
          .order('order_index', { ascending: true })

        if (error) {
          console.error('Error fetching hero data:', error)
        } else if (data && data.length > 0) {
          setHeroData(data)
        }
      } catch (err) {
        console.error('Failed to fetch hero data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  useEffect(() => {
    if (heroData.length === 0) return
    const timer = window.setInterval(() => {
      setHeroCollectionIndex((prev) => (prev + 1) % heroData.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [heroData.length])

  if (loading || heroData.length === 0) {
    // Return a fallback or empty placeholder matching the height
    return (
      <header className="relative w-full h-[90vh] min-h-[650px] flex flex-col overflow-hidden bg-[#1a1a1a]">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#e8720c] border-t-transparent rounded-full animate-spin" />
        </div>
      </header>
    )
  }

  const currentHero = heroData[heroCollectionIndex] || {}
  const image = currentHero.image_url || currentHero.collections?.hero_image || ''
  const collectionName = currentHero.collections?.name || ''
  const accent = currentHero.collections?.accent || '#e8720c'

  return (
    <header className="relative w-full h-[90vh] min-h-[650px] flex flex-col overflow-hidden">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-0 bg-[#1a1a1a]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentHero.id}
            src={image}
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
              <span className="text-white font-medium text-base">{hotline}</span>
            </div>
            <a href={`tel:${hotline}`} className="bg-[#e8720c] text-white px-6 py-2.5 rounded font-semibold text-base transition hover:bg-[#ff8a24]">
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

          <div className="h-[260px] sm:h-[280px] flex flex-col justify-end gap-6 mb-4">
            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[4.5rem] font-bold text-white leading-[1.1] tracking-tight uppercase">
              {currentHero.title ? (
                <span dangerouslySetInnerHTML={{ __html: currentHero.title.replace('\\n', '<br/>') }} />
              ) : (
                <>HƠN CẢ THẨM MỸ<br />ĐÓ LÀ <span className="text-[#e8720c]">SỰ BỀN VỮNG</span></>
              )}
            </h1>

            <p className="max-w-2xl text-lg sm:text-lg text-white/80 leading-relaxed font-light line-clamp-2 min-h-[56px]">
              {currentHero.subtitle || 'Nội thất công cộng Minh Đức đồng hành cùng đối tác quốc tế Carpets Inter, mang giải pháp thảm sàn sinh thái đẳng cấp toàn cầu đến mọi công trình bằng sự chân thành và cam kết chất lượng trọn vẹn.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="#collections" className="bg-[#e8720c] px-8 py-4 rounded text-base font-semibold text-white transition hover:bg-[#ff8a24]">
              Xem bộ sưu tập
            </a>
            <a href="#tai-lieu" className="border border-white/20 bg-black/40 px-8 py-4 rounded text-base font-medium text-white flex items-center gap-2 transition hover:bg-black/60 hover:border-white/40">
              <BookOpen size={20} />
              Tài liệu kỹ thuật
            </a>
            <a href="#news" className="border border-white/20 bg-black/40 px-8 py-4 rounded text-base font-medium text-white flex items-center gap-2 transition hover:bg-black/60 hover:border-white/40">
              <Newspaper size={20} />
              Tin tức & Sự kiện
            </a>
          </div>

          {/* Slider controls */}
          <div className="pt-12 flex gap-3">
            {heroData.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setHeroCollectionIndex(index)}
                className={`rounded-full transition-all duration-300 ${index === heroCollectionIndex ? 'w-3 h-3 bg-[#e8720c]' : 'w-3 h-3 bg-white/30 hover:bg-white/50'}`}
                aria-label={`Chọn \${item.collections?.name || 'slide'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
