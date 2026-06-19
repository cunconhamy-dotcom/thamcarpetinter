/** Admin panel type definitions */

export type ContentStatus = 'draft' | 'published' | 'archived'

export interface CollectionRecord {
  id: string
  name: string
  slug: string
  tagline: string
  summary: string
  detail: string
  heroImage: string
  accent: string
  highlights: string[]
  quickFacts: string[]
  valuePoints: string[]
  applications: string[]
  status: ContentStatus
  sortOrder: number
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export interface UiHeroSectionRecord {
  id: string
  collection_id: string
  image_url: string
  title: string | null
  subtitle: string | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CollectionValuePointRecord {
  id: string
  collection_id: string
  point_text: string
  created_at: string
  updated_at: string
}

export interface CollectionGalleryRecord {
  id: string
  collection_id: string
  image_url: string
  caption: string | null
  created_at: string
  updated_at: string
}

export interface CollectionResourceRecord {
  id: string
  collection_id: string
  label: string
  resource_type: string
  file_url: string
  created_at: string
  updated_at: string
}

export interface ProductRecord {
  id: string
  collection_id: string
  code: string
  name: string
  image: string
  highlights: string[]
  colors: string[]
  spec: Record<string, unknown>
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductSpecRecord {
  id: string
  product_id: string
  pile_type: string | null
  construction: string | null
  backing: string | null
  size: string | null
  installation: string | null
  created_at: string
  updated_at: string
}

export interface BlogPostRecord {
  id: string
  title: string
  slug: string
  excerpt: string
  content: Record<string, unknown> | null
  coverImage: string | null
  status: ContentStatus
  authorId: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface MediaRecord {
  id: string
  fileName: string
  filePath: string
  fileType: 'image' | 'video' | 'document'
  fileSize: number
  altText: string | null
  uploadedBy: string
  createdAt: string
}

export interface SiteConfigRecord {
  key: string
  value: Record<string, unknown>
  updatedBy: string | null
  updatedAt: string
}

/** Dashboard statistics */
export interface DashboardStats {
  totalCollections: number
  totalBlogPosts: number
  totalMediaFiles: number
  totalUsers: number
  publishedCollections: number
  draftBlogPosts: number
  storageUsedMB: number
}

/** Admin sidebar navigation item */
export interface AdminNavItem {
  label: string
  href: string
  icon: string
  permission: string
  badge?: number
}
