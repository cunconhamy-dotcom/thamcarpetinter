import { supabase } from './supabase'

export type ProductSpec = {
  pile?: string
  construction?: string
  backing?: string
  size?: string
  useCase?: string
  installation?: string
  detail?: string
}

export type Product = {
  id: string
  code: string
  name: string
  highlights: string[]
  colors?: string[]
  image?: string
  sort_order?: number
  spec: ProductSpec
}

export type ResourceLink = {
  label: string
  type: 'brochure' | 'spec' | 'guide' | 'portfolio'
  url: string
}

export type ContactInfo = {
  company: string
  hotline: string
  email: string
  address: string
  hours: string
}

export type CollectionItem = {
  id: string
  dbId: string
  name: string
  tagline: string
  summary: string
  detail: string
  heroImage: string
  gallery: string[]
  productImages: string[]
  accent: string
  quickFacts: string[]
  applications: string[]
  valuePoints: string[]
  products: Product[]
  resources: ResourceLink[]
}

export async function fetchCollections(): Promise<CollectionItem[]> {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*, products(*)')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Lỗi khi tải bộ sưu tập từ Supabase:', error)
      return [] 
    }

    if (data && data.length > 0) {
      console.log('[fetchCollections] Found collections:', data.length)
      return data.map((item: any) => {
        const metadata = item.metadata || {}
        
        const relationalProducts = item.products?.map((p: any) => ({
          id: p.id,
          code: p.code,
          name: p.name,
          image: p.image,
          highlights: Array.isArray(p.highlights) ? p.highlights : [],
          colors: Array.isArray(p.colors) ? p.colors : [],
          spec: p.spec || {},
          sort_order: p.sort_order || 0
        })).sort((a: any, b: any) => {
          if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
          return a.code.localeCompare(b.code);
        }) || [];

        return {
          id: item.slug,
          dbId: item.id,
          name: item.name,
          tagline: item.tagline || '',
          summary: item.summary || '',
          detail: item.detail || '',
          heroImage: item.hero_image || '',
          gallery: metadata.gallery || [],
          productImages: metadata.productImages || [],
          accent: item.accent || '#f29d38',
          quickFacts: Array.isArray(item.quick_facts) ? item.quick_facts : [],
          applications: Array.isArray(item.applications) ? item.applications : [],
          valuePoints: Array.isArray(item.value_points) ? item.value_points : [],
          products: relationalProducts,
          resources: metadata.resources || [],
        }
      })
    }

    return []
  } catch (err) {
    console.error('Exception fetching collections:', err)
    return []
  }
}

/** Fetch global portfolio resources from collection_resources table (type = portfolio) */
export async function fetchGlobalResources(): Promise<ResourceLink[]> {
  try {
    const { data, error } = await supabase
      .from('collection_resources')
      .select('title, resource_type, url')
      .eq('resource_type', 'portfolio')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      // Fallback to hardcoded
      return [
        { label: 'Hồ sơ phối hợp bộ sưu tập', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/MixMatchbyCarpetsInterFeb2020LR.pdf' },
        { label: 'Hồ sơ thiết kế tùy chỉnh', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/CarpetTileCustomDesignPortfolioAug2021lr.pdf' },
      ]
    }

    return data.map((r: any) => ({
      label: r.title,
      type: 'portfolio' as const,
      url: r.url,
    }))
  } catch {
    return [
      { label: 'Hồ sơ phối hợp bộ sưu tập', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/MixMatchbyCarpetsInterFeb2020LR.pdf' },
      { label: 'Hồ sơ thiết kế tùy chỉnh', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/CarpetTileCustomDesignPortfolioAug2021lr.pdf' },
    ]
  }
}

/** @deprecated Use useSiteConfig hook instead */
export const contactInfo: ContactInfo = {
  company: 'Nội Thất Công Cộng Minh Đức',
  hotline: '0908314939',
  email: 'gd@mdsf.vn',
  address: 'Số 47/153/30, Phú Đô, Nam Từ Liêm, Hà Nội, Việt Nam',
  hours: 'Văn phòng: G04-L04 An Quý Villa - KĐT Mới Dương Nội, P. Dương Nội, Hà Nội.',
}

/** @deprecated Use fetchGlobalResources() instead */
export const featuredResources: ResourceLink[] = [
  { label: 'Hồ sơ phối hợp bộ sưu tập', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/MixMatchbyCarpetsInterFeb2020LR.pdf' },
  { label: 'Hồ sơ thiết kế tùy chỉnh', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/CarpetTileCustomDesignPortfolioAug2021lr.pdf' },
]
