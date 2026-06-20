/**
 * useSiteConfig — Hook tải cấu hình website từ Supabase (site_config table)
 * Fallback về giá trị mặc định nếu chưa có dữ liệu
 */
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface SiteConfigData {
  site_info: {
    name: string
    description: string
    url: string
    logo_url: string
  }
  contact_info: {
    phone: string
    email: string
    address: string
    company?: string
    hotline?: string
    hours?: string
  }
  social_links: {
    facebook: string
    zalo: string
    youtube?: string
    linkedin?: string
  }
  brand_info: {
    badge_text: string
    cta_text: string
    hero_tagline: string
  }
  hero_slider_settings: {
    display_mode: 'fixed' | 'dynamic' | 'mixed'
    slide_interval: number
    fixed_title: string
    fixed_subtitle: string
  }
}

const DEFAULTS: SiteConfigData = {
  site_info: {
    name: 'Carpets Inter Vietnam',
    description: 'Thảm sàn cao cấp cho không gian hiện đại',
    url: 'https://carpetsinter.vn',
    logo_url: '',
  },
  contact_info: {
    phone: '0908314939',
    hotline: '0908314939',
    email: 'gd@mdsf.vn',
    address: 'Số 47/153/30, Phú Đô, Nam Từ Liêm, Hà Nội, Việt Nam',
    company: 'Nội Thất Công Cộng Minh Đức',
    hours: 'Văn phòng: G04-L04 An Quý Villa - KĐT Mới Dương Nội, P. Dương Nội, Hà Nội.',
  },
  social_links: {
    facebook: 'https://www.facebook.com/carpetsinter.vn/',
    zalo: '0908314939',
    youtube: '',
    linkedin: '',
  },
  brand_info: {
    badge_text: 'Giao hàng và thi công nhanh chóng trên toàn quốc.',
    cta_text: 'Liên hệ ngay để được tư vấn đúng bộ sưu tập, đúng cấu trúc bề mặt và đúng sắc độ phù hợp với concept công trình của bạn.',
    hero_tagline: 'Nội thất công cộng Minh Đức đồng hành cùng đối tác quốc tế Carpets Inter, mang giải pháp thảm sàn sinh thái đẳng cấp toàn cầu đến mọi công trình.',
  },
  hero_slider_settings: {
    display_mode: 'mixed',
    slide_interval: 6,
    fixed_title: 'HƠN CẢ THẨM MỸ<br/>ĐÓ LÀ <span class="text-[#e8720c]">SỰ BỀN VỮNG</span>',
    fixed_subtitle: 'Nội thất công cộng Minh Đức đồng hành cùng đối tác quốc tế Carpets Inter, mang giải pháp thảm sàn sinh thái đẳng cấp toàn cầu đến mọi công trình bằng sự chân thành và cam kết chất lượng trọn vẹn.',
  },
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfigData>(DEFAULTS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value')

        if (error || !data) {
          console.warn('useSiteConfig: failed to load', error?.message)
          setIsLoading(false)
          return
        }

        const merged: SiteConfigData = { ...DEFAULTS }
        for (const row of data) {
          if (row.key === 'site_info') {
            merged.site_info = { ...DEFAULTS.site_info, ...(row.value as object) }
          } else if (row.key === 'contact_info') {
            const ci = row.value as Record<string, string>
            merged.contact_info = {
              ...DEFAULTS.contact_info,
              ...ci,
              // Map 'phone' → 'hotline' for backwards compat
              hotline: ci.phone || ci.hotline || DEFAULTS.contact_info.hotline,
            }
          } else if (row.key === 'social_links') {
            merged.social_links = { ...DEFAULTS.social_links, ...(row.value as object) }
          } else if (row.key === 'brand_info') {
            merged.brand_info = { ...DEFAULTS.brand_info, ...(row.value as object) }
          } else if (row.key === 'hero_slider_settings') {
            merged.hero_slider_settings = { ...DEFAULTS.hero_slider_settings, ...(row.value as object) }
          }
        }

        setConfig(merged)
      } catch (err) {
        console.error('useSiteConfig exception:', err)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  return { config, isLoading }
}
