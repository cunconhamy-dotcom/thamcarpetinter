/**
 * Admin API — centralised CRUD layer with Demo Mode fallback.
 *
 * Every admin page imports from here instead of touching Supabase directly.
 * When VITE_SUPABASE_URL is not set we fall back to hardcoded demo data so
 * the UI can be developed / demoed without a live backend.
 */

import { supabase } from '@/lib/supabase'
import type {
  DashboardStats,
  CollectionRecord,
  BlogPostRecord,
  MediaRecord,
  SiteConfigRecord,
  ContentStatus,
} from '@/types/admin'
import type { UserProfile, UserRole } from '@/types/auth'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL

/** Vietnamese-safe slug generator */
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Map a raw DB row (snake_case) → CollectionRecord (camelCase) */
function mapCollection(row: Record<string, unknown>): CollectionRecord {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    tagline: (row.tagline as string) ?? '',
    summary: (row.summary as string) ?? '',
    detail: (row.detail as string) ?? '',
    heroImage: (row.hero_image as string) ?? '',
    accent: (row.accent as string) ?? '#f29d38',
    highlights: (row.highlights as string[]) ?? [],
    quickFacts: (row.quick_facts as string[]) ?? [],
    valuePoints: (row.value_points as string[]) ?? [],
    applications: (row.applications as string[]) ?? [],
    status: (row.status as ContentStatus) ?? 'draft',
    sortOrder: (row.sort_order as number) ?? 0,
    createdBy: (row.created_by as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

/** Map CollectionRecord (camelCase) → DB row (snake_case) */
function collectionToRow(
  data: Partial<CollectionRecord>,
): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (data.name !== undefined) row.name = data.name
  if (data.slug !== undefined) row.slug = data.slug
  else if (data.name) row.slug = toSlug(data.name)
  if (data.tagline !== undefined) row.tagline = data.tagline
  if (data.summary !== undefined) row.summary = data.summary
  if (data.detail !== undefined) row.detail = data.detail
  if (data.heroImage !== undefined) row.hero_image = data.heroImage
  if (data.accent !== undefined) row.accent = data.accent
  if (data.highlights !== undefined) row.highlights = data.highlights
  if (data.quickFacts !== undefined) row.quick_facts = data.quickFacts
  if (data.valuePoints !== undefined) row.value_points = data.valuePoints
  if (data.applications !== undefined) row.applications = data.applications
  if (data.status !== undefined) row.status = data.status
  if (data.sortOrder !== undefined) row.sort_order = data.sortOrder
  if (data.createdBy !== undefined) row.created_by = data.createdBy
  return row
}

/** Map a raw DB row → BlogPostRecord */
function mapBlogPost(row: Record<string, unknown>): BlogPostRecord {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: (row.excerpt as string) ?? '',
    content: (row.content as Record<string, unknown>) ?? null,
    coverImage: (row.cover_image as string) ?? null,
    status: (row.status as ContentStatus) ?? 'draft',
    authorId: (row.author_id as string) ?? '',
    publishedAt: (row.published_at as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

/** Map BlogPostRecord → DB row */
function blogPostToRow(
  data: Partial<BlogPostRecord>,
): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (data.title !== undefined) row.title = data.title
  if (data.slug !== undefined) row.slug = data.slug
  else if (data.title) row.slug = toSlug(data.title)
  if (data.excerpt !== undefined) row.excerpt = data.excerpt
  if (data.content !== undefined) row.content = data.content
  if (data.coverImage !== undefined) row.cover_image = data.coverImage
  if (data.status !== undefined) row.status = data.status
  if (data.authorId !== undefined) row.author_id = data.authorId
  if (data.publishedAt !== undefined) row.published_at = data.publishedAt
  return row
}

/** Map a raw DB row → MediaRecord */
function mapMedia(row: Record<string, unknown>): MediaRecord {
  return {
    id: row.id as string,
    fileName: row.file_name as string,
    filePath: row.file_path as string,
    fileType: row.file_type as MediaRecord['fileType'],
    fileSize: row.file_size as number,
    altText: (row.alt_text as string) ?? null,
    uploadedBy: (row.uploaded_by as string) ?? '',
    createdAt: row.created_at as string,
  }
}

/** Map a raw DB row → UserProfile */
function mapUser(row: Record<string, unknown>): UserProfile {
  return {
    id: row.id as string,
    email: row.email as string,
    fullName: (row.full_name as string) ?? null,
    avatarUrl: (row.avatar_url as string) ?? null,
    role: (row.role as UserRole) ?? 'viewer',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

/* ------------------------------------------------------------------ */
/*  Demo data                                                          */
/* ------------------------------------------------------------------ */

const DEMO_STATS: DashboardStats = {
  totalCollections: 6,
  totalBlogPosts: 12,
  totalMediaFiles: 48,
  totalUsers: 3,
  publishedCollections: 4,
  draftBlogPosts: 3,
  storageUsedMB: 128,
}

const DEMO_COLLECTIONS: CollectionRecord[] = [
  {
    id: 'demo-1',
    name: 'Thảm Trải Sàn Cao Cấp',
    slug: 'tham-trai-san-cao-cap',
    tagline: 'Sang trọng & bền bỉ',
    summary: 'Bộ sưu tập thảm trải sàn cao cấp nhập khẩu từ châu Âu.',
    detail: '',
    heroImage: '',
    accent: '#f29d38',
    highlights: ['Chống cháy', 'Cách âm tốt'],
    quickFacts: [],
    valuePoints: [],
    applications: ['Văn phòng', 'Khách sạn'],
    status: 'published',
    sortOrder: 1,
    createdBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const DEMO_BLOG_POSTS: BlogPostRecord[] = [
  {
    id: 'demo-blog-1',
    title: 'Cách chọn thảm phù hợp cho văn phòng',
    slug: 'cach-chon-tham-phu-hop-cho-van-phong',
    excerpt: 'Hướng dẫn chọn thảm trải sàn phù hợp với không gian văn phòng hiện đại.',
    content: null,
    coverImage: null,
    status: 'published',
    authorId: 'demo-user',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const DEMO_MEDIA: MediaRecord[] = []

const DEMO_USERS: UserProfile[] = [
  {
    id: 'demo-user',
    email: 'admin@carpetsinter.vn',
    fullName: 'Admin Demo',
    avatarUrl: null,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

export async function fetchDashboardStats(): Promise<DashboardStats> {
  if (IS_DEMO) return DEMO_STATS

  try {
    const [collections, blogPosts, media, profiles] = await Promise.all([
      supabase.from('collections').select('id, status', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id, status', { count: 'exact', head: true }),
      supabase.from('media').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ])

    // Published collections count
    const { count: publishedCollections } = await supabase
      .from('collections')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')

    // Draft blog posts count
    const { count: draftBlogPosts } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'draft')

    return {
      totalCollections: collections.count ?? 0,
      totalBlogPosts: blogPosts.count ?? 0,
      totalMediaFiles: media.count ?? 0,
      totalUsers: profiles.count ?? 0,
      publishedCollections: publishedCollections ?? 0,
      draftBlogPosts: draftBlogPosts ?? 0,
      storageUsedMB: 0, // Supabase doesn't expose this easily — placeholder
    }
  } catch (err) {
    console.error('[admin-api] fetchDashboardStats error:', err)
    return { ...DEMO_STATS, totalCollections: 0 }
  }
}

/* ------------------------------------------------------------------ */
/*  Collections                                                        */
/* ------------------------------------------------------------------ */

export async function fetchCollections(): Promise<CollectionRecord[]> {
  if (IS_DEMO) return DEMO_COLLECTIONS

  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin-api] fetchCollections error:', error)
    return []
  }
  return (data ?? []).map(mapCollection)
}

export async function fetchCollectionById(
  id: string,
): Promise<CollectionRecord | null> {
  if (IS_DEMO) return DEMO_COLLECTIONS.find((c) => c.id === id || c.slug === id) ?? null

  // Try by ID first, then by slug
  let { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!data && !error) {
    ;({ data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', id)
      .maybeSingle())
  }

  if (error) {
    console.error('[admin-api] fetchCollectionById error:', error)
    return null
  }
  return data ? mapCollection(data) : null
}

export async function saveCollection(
  data: Partial<CollectionRecord> & { id?: string },
): Promise<{ data: unknown; error: string | null }> {
  if (IS_DEMO) return { data: { id: 'demo-new', ...data }, error: null }

  const row = collectionToRow(data)

  if (data.id) {
    // UPDATE
    const { data: updated, error } = await supabase
      .from('collections')
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq('id', data.id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: updated, error: null }
  }

  // INSERT
  const { data: inserted, error } = await supabase
    .from('collections')
    .insert({ ...row, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: inserted, error: null }
}

export async function deleteCollection(
  id: string,
): Promise<{ error: string | null }> {
  if (IS_DEMO) return { error: null }

  const { error } = await supabase.from('collections').delete().eq('id', id)
  return { error: error?.message ?? null }
}

/* ------------------------------------------------------------------ */
/*  Blog Posts                                                         */
/* ------------------------------------------------------------------ */

export async function fetchBlogPosts(): Promise<BlogPostRecord[]> {
  if (IS_DEMO) return DEMO_BLOG_POSTS

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin-api] fetchBlogPosts error:', error)
    return []
  }
  return (data ?? []).map(mapBlogPost)
}

export async function fetchBlogPostById(
  id: string,
): Promise<BlogPostRecord | null> {
  if (IS_DEMO) return DEMO_BLOG_POSTS.find((p) => p.id === id || p.slug === id) ?? null

  let { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!data && !error) {
    ;({ data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', id)
      .maybeSingle())
  }

  if (error) {
    console.error('[admin-api] fetchBlogPostById error:', error)
    return null
  }
  return data ? mapBlogPost(data) : null
}

export async function saveBlogPost(
  data: Partial<BlogPostRecord> & { id?: string },
): Promise<{ data: unknown; error: string | null }> {
  if (IS_DEMO) return { data: { id: 'demo-blog-new', ...data }, error: null }

  const row = blogPostToRow(data)

  if (data.id) {
    const { data: updated, error } = await supabase
      .from('blog_posts')
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq('id', data.id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: updated, error: null }
  }

  const { data: inserted, error } = await supabase
    .from('blog_posts')
    .insert({ ...row, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: inserted, error: null }
}

export async function deleteBlogPost(
  id: string,
): Promise<{ error: string | null }> {
  if (IS_DEMO) return { error: null }

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  return { error: error?.message ?? null }
}

/* ------------------------------------------------------------------ */
/*  Media                                                              */
/* ------------------------------------------------------------------ */

export async function fetchMediaFiles(): Promise<MediaRecord[]> {
  if (IS_DEMO) return DEMO_MEDIA

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin-api] fetchMediaFiles error:', error)
    return []
  }
  return (data ?? []).map(mapMedia)
}

export async function uploadMediaFile(
  file: File,
): Promise<{ data: MediaRecord | null; error: string | null }> {
  if (IS_DEMO) {
    // Create a local preview for demo
    const fakeRecord: MediaRecord = {
      id: `demo-media-${Date.now()}`,
      fileName: file.name,
      filePath: `demo/${file.name}`,
      fileType: file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : 'document',
      fileSize: file.size,
      altText: null,
      uploadedBy: 'demo-user',
      createdAt: new Date().toISOString(),
    }
    return { data: fakeRecord, error: null }
  }

  try {
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `uploads/${timestamp}_${safeName}`

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) return { data: null, error: uploadError.message }

    // 2. Determine file type
    let fileType: MediaRecord['fileType'] = 'document'
    if (file.type.startsWith('image/')) fileType = 'image'
    else if (file.type.startsWith('video/')) fileType = 'video'

    // 3. Insert record in media table
    const { data: record, error: insertError } = await supabase
      .from('media')
      .insert({
        file_name: file.name,
        file_path: storagePath,
        file_type: fileType,
        file_size: file.size,
        alt_text: null,
      })
      .select()
      .single()

    if (insertError) return { data: null, error: insertError.message }
    return { data: mapMedia(record), error: null }
  } catch (err) {
    console.error('[admin-api] uploadMediaFile error:', err)
    return { data: null, error: 'Lỗi khi tải tệp lên. Vui lòng thử lại.' }
  }
}

export async function deleteMediaFile(
  id: string,
  filePath: string,
): Promise<{ error: string | null }> {
  if (IS_DEMO) return { error: null }

  try {
    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([filePath])

    if (storageError) {
      console.warn('[admin-api] Storage delete warning:', storageError)
      // Continue to delete the DB record even if storage fails
    }

    // 2. Delete from media table
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)

    return { error: dbError?.message ?? null }
  } catch (err) {
    console.error('[admin-api] deleteMediaFile error:', err)
    return { error: 'Lỗi khi xóa tệp. Vui lòng thử lại.' }
  }
}

export function getMediaPublicUrl(filePath: string): string {
  if (IS_DEMO) return filePath

  const { data } = supabase.storage.from('media').getPublicUrl(filePath)
  return data.publicUrl
}

/* ------------------------------------------------------------------ */
/*  Users                                                              */
/* ------------------------------------------------------------------ */

export async function fetchUsers(): Promise<UserProfile[]> {
  if (IS_DEMO) return DEMO_USERS

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin-api] fetchUsers error:', error)
    return []
  }
  return (data ?? []).map(mapUser)
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<{ error: string | null }> {
  if (IS_DEMO) return { error: null }

  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)

  return { error: error?.message ?? null }
}

/* ------------------------------------------------------------------ */
/*  Site Config                                                        */
/* ------------------------------------------------------------------ */

export async function fetchSiteConfig(): Promise<Record<string, unknown>> {
  if (IS_DEMO) {
    return {
      general: {
        siteName: 'Carpets Inter Việt Nam',
        description: 'Nhà phân phối thảm trải sàn hàng đầu Việt Nam',
      },
    }
  }

  const { data, error } = await supabase
    .from('site_config')
    .select('*')

  if (error) {
    console.error('[admin-api] fetchSiteConfig error:', error)
    return {}
  }

  // Convert array of { key, value } → flat object
  const config: Record<string, unknown> = {}
  for (const row of data ?? []) {
    config[row.key as string] = row.value
  }
  return config
}

export async function saveSiteConfig(
  key: string,
  value: Record<string, unknown>,
): Promise<{ error: string | null }> {
  if (IS_DEMO) return { error: null }

  const { error } = await supabase
    .from('site_config')
    .upsert(
      {
        key,
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' },
    )

  return { error: error?.message ?? null }
}
