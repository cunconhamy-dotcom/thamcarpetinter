import { supabase } from './supabase'

export type ProductSpec = {
  pile?: string
  construction?: string
  backing?: string
  size?: string
  useCase?: string
  installation?: string
}

export type Product = {
  code: string
  name: string
  highlights: string[]
  colors?: string[]
  image?: string
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
      // Map DB schema to frontend CollectionItem interface
      return data.map((item: any) => {
        const metadata = item.metadata || {}
        
        // Relational products from new table
        const relationalProducts = item.products?.map((p: any) => ({
          id: p.id,
          code: p.code,
          name: p.name,
          image: p.image,
          highlights: p.highlights || [],
          colors: p.colors || [],
          spec: p.spec || {}
        })) || [];

        return {
          id: item.slug,
          name: item.name,
          tagline: item.tagline || '',
          summary: item.summary || '',
          detail: item.detail || '',
          heroImage: item.hero_image || '',
          gallery: metadata.gallery || [],
          productImages: metadata.productImages || [],
          accent: item.accent || '#f29d38',
          quickFacts: item.quick_facts || [],
          applications: item.applications || [],
          valuePoints: item.value_points || [],
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

export const featuredResources: ResourceLink[] = [
  { label: 'Hồ sơ phối hợp bộ sưu tập', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/MixMatchbyCarpetsInterFeb2020LR.pdf' },
  { label: 'Hồ sơ thiết kế tùy chỉnh', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/CarpetTileCustomDesignPortfolioAug2021lr.pdf' },
]

export const contactInfo: ContactInfo = {
  company: 'Nội Thất Công Cộng Minh Đức',
  hotline: '0908314939',
  email: 'gd@mdsf.vn',
  address: 'Số 47/153/30, Phú Đô, Nam Từ Liêm, Hà Nội, Việt Nam',
  hours: 'Văn phòng: G04-L04 An Quý Villa - KĐT Mới Dương Nội, P. Dương Nội, Hà Nội.',
}
