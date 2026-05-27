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

/** Permission matrix per role */
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'dashboard.view',
    'collections.view', 'collections.create', 'collections.edit', 'collections.delete',
    'blog.view', 'blog.create', 'blog.edit', 'blog.delete', 'blog.publish',
    'media.view', 'media.upload', 'media.delete',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'settings.view', 'settings.edit',
    'ai.generate',
  ],
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

export type Permission = typeof DEFAULT_ROLE_PERMISSIONS.admin[number]
