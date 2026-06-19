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
