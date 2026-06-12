/** Auth & RBAC type definitions — shared contract */

export type UserRole = 'admin' | 'writer' | 'viewer'

export interface UserProfile {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
}

/** All available permissions in the system */
export const ALL_PERMISSIONS = [
  // Dashboard
  'dashboard.view',
  // Homepage CMS
  'homepage.view', 'homepage.edit',
  // Collections
  'collections.view', 'collections.create', 'collections.edit', 'collections.delete',
  // Blog / News
  'blog.view', 'blog.create', 'blog.edit', 'blog.delete', 'blog.publish',
  // Media
  'media.view', 'media.upload', 'media.delete',
  // Users
  'users.view', 'users.create', 'users.edit', 'users.delete',
  // Settings
  'settings.view', 'settings.edit',
  // AI
  'ai.settings', 'ai.knowledge', 'ai.generate',
] as const

export type Permission = typeof ALL_PERMISSIONS[number]

/** Permission groups for the UI */
export interface PermissionGroup {
  label: string
  description: string
  permissions: { key: Permission; label: string }[]
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: 'Tổng quan',
    description: 'Quyền truy cập bảng điều khiển',
    permissions: [
      { key: 'dashboard.view', label: 'Xem bảng điều khiển' },
    ],
  },
  {
    label: 'Trang chủ',
    description: 'Quản trị nội dung trang chủ (Hero, Footer, Contact...)',
    permissions: [
      { key: 'homepage.view', label: 'Xem cài đặt trang chủ' },
      { key: 'homepage.edit', label: 'Chỉnh sửa nội dung trang chủ' },
    ],
  },
  {
    label: 'Bộ sưu tập',
    description: 'Quản lý các bộ sưu tập thảm',
    permissions: [
      { key: 'collections.view', label: 'Xem bộ sưu tập' },
      { key: 'collections.create', label: 'Tạo bộ sưu tập mới' },
      { key: 'collections.edit', label: 'Chỉnh sửa bộ sưu tập' },
      { key: 'collections.delete', label: 'Xóa bộ sưu tập' },
    ],
  },
  {
    label: 'Tin tức & Bài viết',
    description: 'Quản lý bài viết, tin tức trên website',
    permissions: [
      { key: 'blog.view', label: 'Xem bài viết' },
      { key: 'blog.create', label: 'Tạo bài viết mới' },
      { key: 'blog.edit', label: 'Chỉnh sửa bài viết' },
      { key: 'blog.delete', label: 'Xóa bài viết' },
      { key: 'blog.publish', label: 'Xuất bản bài viết' },
    ],
  },
  {
    label: 'Thư viện Media',
    description: 'Quản lý hình ảnh, tài liệu đã tải lên',
    permissions: [
      { key: 'media.view', label: 'Xem thư viện' },
      { key: 'media.upload', label: 'Tải lên tệp mới' },
      { key: 'media.delete', label: 'Xóa tệp' },
    ],
  },
  {
    label: 'Trợ lý AI',
    description: 'Cài đặt và quản lý AI chatbot',
    permissions: [
      { key: 'ai.settings', label: 'Cấu hình AI (Provider, Model)' },
      { key: 'ai.knowledge', label: 'Quản lý kho tri thức (RAG)' },
      { key: 'ai.generate', label: 'Sử dụng AI tạo nội dung' },
    ],
  },
  {
    label: 'Người dùng',
    description: 'Quản lý tài khoản và phân quyền',
    permissions: [
      { key: 'users.view', label: 'Xem danh sách người dùng' },
      { key: 'users.create', label: 'Tạo người dùng mới' },
      { key: 'users.edit', label: 'Chỉnh sửa người dùng' },
      { key: 'users.delete', label: 'Xóa người dùng' },
    ],
  },
  {
    label: 'Cài đặt hệ thống',
    description: 'Cấu hình website, liên hệ, mạng xã hội',
    permissions: [
      { key: 'settings.view', label: 'Xem cài đặt' },
      { key: 'settings.edit', label: 'Chỉnh sửa cài đặt' },
    ],
  },
]

/** Permission matrix per role */
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [...ALL_PERMISSIONS],
  writer: [
    'dashboard.view',
    'blog.view', 'blog.create', 'blog.edit',
    'media.view', 'media.upload',
    'ai.generate',
  ],
  viewer: [
    'dashboard.view',
  ],
}
