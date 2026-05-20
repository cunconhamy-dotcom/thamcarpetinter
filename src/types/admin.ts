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
