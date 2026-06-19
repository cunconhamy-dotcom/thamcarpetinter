/** App entry — Router with public + admin routes */
import { lazy, Suspense, useEffect, useState } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

// Lazy load admin pages (code splitting)
const LoginPage = lazy(() => import('@/pages/admin/LoginPage').then(m => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })))
const CollectionsManager = lazy(() => import('@/pages/admin/CollectionsManager').then(m => ({ default: m.CollectionsManager })))
const UiHeroSectionsManager = lazy(() => import('@/pages/admin/UiHeroSectionsManager').then(m => ({ default: m.UiHeroSectionsManager })))
const CollectionValuePointsManager = lazy(() => import('@/pages/admin/CollectionValuePointsManager').then(m => ({ default: m.CollectionValuePointsManager })))
const CollectionGalleriesManager = lazy(() => import('@/pages/admin/CollectionGalleriesManager').then(m => ({ default: m.CollectionGalleriesManager })))
const CollectionResourcesManager = lazy(() => import('@/pages/admin/CollectionResourcesManager').then(m => ({ default: m.CollectionResourcesManager })))
const ProductsManager = lazy(() => import('@/pages/admin/ProductsManager').then(m => ({ default: m.ProductsManager })))
const ProductSpecsManager = lazy(() => import('@/pages/admin/ProductSpecsManager').then(m => ({ default: m.ProductSpecsManager })))
const CollectionEditor = lazy(() => import('@/pages/admin/CollectionEditor').then(m => ({ default: m.CollectionEditor })))
const BlogManager = lazy(() => import('@/pages/admin/BlogManager').then(m => ({ default: m.BlogManager })))
const BlogEditor = lazy(() => import('@/pages/admin/BlogEditor').then(m => ({ default: m.BlogEditor })))
const MediaManager = lazy(() => import('@/pages/admin/MediaManager').then(m => ({ default: m.MediaManager })))
const UsersManager = lazy(() => import('@/pages/admin/UsersManager').then(m => ({ default: m.UsersManager })))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })))
const AISettingsPage = lazy(() => import('@/pages/admin/AISettingsPage').then(m => ({ default: m.AISettingsPage })))
const LeadsManager = lazy(() => import('@/pages/admin/LeadsManager').then(m => ({ default: m.LeadsManager })))
const EmailManager = lazy(() => import('@/pages/admin/EmailManager').then(m => ({ default: m.EmailManager })))

// Import existing public page
import PublicApp from './PublicApp'

/** Simple client-side router */
function useRoute() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  return path
}

/** Loading skeleton for lazy pages */
function AdminPageSkeleton() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fb',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ textAlign: 'center', color: '#9ca3af' }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #f29d38',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <div style={{ fontSize: 14 }}>Đang tải...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

/** Protected route — redirects to login if not authenticated */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <AdminPageSkeleton />

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<AdminPageSkeleton />}>
        <LoginPage />
      </Suspense>
    )
  }

  return <>{children}</>
}

function AdminRouter() {
  const path = useRoute()

  let match = null;
  if (path === '/admin') match = <DashboardPage />;
  else if (path === '/admin/ui-hero-sections') match = <UiHeroSectionsManager />;
  else if (path === '/admin/collections') match = <CollectionsManager />;
  else if (path === '/admin/collection-value-points') match = <CollectionValuePointsManager />;
  else if (path === '/admin/collection-galleries') match = <CollectionGalleriesManager />;
  else if (path === '/admin/collection-resources') match = <CollectionResourcesManager />;
  else if (path === '/admin/products') match = <ProductsManager />;
  else if (path === '/admin/product-specs') match = <ProductSpecsManager />;
  else if (path === '/admin/collections/new') match = <CollectionEditor />;
  else if (path.startsWith('/admin/collections/')) match = <CollectionEditor />;
  else if (path === '/admin/blog') match = <BlogManager />;
  else if (path === '/admin/blog/new') match = <BlogEditor />;
  else if (path.startsWith('/admin/blog/')) match = <BlogEditor />;
  else if (path === '/admin/media') match = <MediaManager />;
  else if (path === '/admin/users') match = <UsersManager />;
  else if (path === '/admin/leads') match = <LeadsManager />;
  else if (path === '/admin/emails') match = <EmailManager />;
  else if (path === '/admin/settings') match = <SettingsPage />;
  else if (path === '/admin/ai-settings') match = <AISettingsPage />;
  else match = <DashboardPage />; // Fallback

  return (
    <ProtectedRoute>
      <Suspense fallback={<AdminPageSkeleton />}>
        {match}
      </Suspense>
    </ProtectedRoute>
  )
}

/** Main App — route between public and admin */
function AppRouter() {
  const path = useRoute()

  if (path.startsWith('/admin')) {
    return <AdminRouter />
  }

  return <PublicApp />
}

import { Toaster } from 'sonner'

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <AppRouter />
    </AuthProvider>
  )
}
