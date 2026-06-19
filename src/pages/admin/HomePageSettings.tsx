import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { saveSiteConfig } from '@/lib/admin-api'
import {
  SECTION_CONFIG,
  DEFAULT_HERO,
  DEFAULT_NAV,
  DEFAULT_COLLECTIONS_SECTION,
  DEFAULT_VALUES,
  DEFAULT_SPECS,
  DEFAULT_NEWS_SECTION,
  DEFAULT_PRODUCTS_SECTION,
  DEFAULT_GALLERY,
  DEFAULT_CONTACT,
  DEFAULT_FOOTER,
  type HomepageSectionKey
} from '@/types/home'
import {
  MonitorPlay, Navigation, Layers, Award, Ruler, Newspaper, Package, Images, Mail, PanelBottom,
  Save, RotateCcw, ChevronDown, ChevronUp, Check, X, Layout
} from 'lucide-react'

import { HeroSettings } from '@/components/admin/HomePageSettings/HeroSettings'
import { NavSettings } from '@/components/admin/HomePageSettings/NavSettings'
import { ValuesSettings } from '@/components/admin/HomePageSettings/ValuesSettings'
import { SimpleSectionSettings } from '@/components/admin/HomePageSettings/SimpleSectionSettings'
import { ContactSettings } from '@/components/admin/HomePageSettings/ContactSettings'
import { FooterSettings } from '@/components/admin/HomePageSettings/FooterSettings'

// Default configs map
const DEFAULTS: Record<HomepageSectionKey, any> = {
  homepage_hero: DEFAULT_HERO,
  homepage_nav: DEFAULT_NAV,
  homepage_collections: DEFAULT_COLLECTIONS_SECTION,
  homepage_values: DEFAULT_VALUES,
  homepage_specs: DEFAULT_SPECS,
  homepage_news: DEFAULT_NEWS_SECTION,
  homepage_products: DEFAULT_PRODUCTS_SECTION,
  homepage_gallery: DEFAULT_GALLERY,
  homepage_contact: DEFAULT_CONTACT,
  homepage_footer: DEFAULT_FOOTER,
}

const ICONS: Record<string, any> = {
  MonitorPlay, Navigation, Layers, Award, Ruler, Newspaper, Package, Images, Mail, PanelBottom
}

export function HomePageSettings() {
  const { isDemoMode, hasPermission } = useAuth()
  const canEdit = hasPermission('homepage.edit')
  
  const [configs, setConfigs] = useState<Record<HomepageSectionKey, any>>(DEFAULTS)
  const [expandedSection, setExpandedSection] = useState<HomepageSectionKey | null>('homepage_hero')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<HomepageSectionKey | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [collectionsList, setCollectionsList] = useState<any[]>([])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Fetch configs
  useEffect(() => {
    async function loadConfigs() {
      setIsLoading(true)
      try {
        if (isDemoMode) {
          const loaded = { ...DEFAULTS }
          for (const key of Object.keys(DEFAULTS) as HomepageSectionKey[]) {
            const saved = localStorage.getItem(`ci_demo_${key}`)
            if (saved) loaded[key] = JSON.parse(saved)
          }
          setConfigs(loaded)
        } else {
          const { data, error } = await supabase
            .from('site_config')
            .select('*')
            .like('key', 'homepage_%')

          if (!error && data) {
            const loaded = { ...DEFAULTS }
            for (const row of data) {
              if (row.key in loaded) {
                loaded[row.key as HomepageSectionKey] = row.value
              }
            }
            setConfigs(loaded)
          }

          // Load collections for gallery picker
          const { data: colsData } = await supabase.from('collections').select('id, name, slug, metadata')
          if (colsData) {
            setCollectionsList(colsData)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadConfigs()
  }, [isDemoMode])

  const handleUpdateConfig = (section: HomepageSectionKey, field: string, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = async (section: HomepageSectionKey) => {
    if (!canEdit) {
      showNotification('error', 'Bạn không có quyền lưu thay đổi')
      return
    }
    
    setIsSaving(section)
    try {
      if (isDemoMode) {
        localStorage.setItem(`ci_demo_${section}`, JSON.stringify(configs[section]))
        showNotification('success', 'Đã lưu cấu hình (Demo Mode)')
      } else {
        const { error } = await saveSiteConfig(section, configs[section])
        if (error) throw new Error(error)
        showNotification('success', 'Đã lưu cấu hình thành công')
      }
    } catch (err) {
      showNotification('error', 'Lỗi khi lưu cấu hình')
    } finally {
      setIsSaving(null)
    }
  }

  const handleSaveAll = async () => {
    if (!canEdit) return
    setIsSaving('homepage_hero') // use any truthy value for loading state
    try {
      if (isDemoMode) {
        for (const key of Object.keys(configs) as HomepageSectionKey[]) {
          localStorage.setItem(`ci_demo_${key}`, JSON.stringify(configs[key]))
        }
      } else {
        const promises = (Object.keys(configs) as HomepageSectionKey[]).map(key => 
          saveSiteConfig(key, configs[key])
        )
        await Promise.all(promises)
      }
      showNotification('success', 'Đã lưu toàn bộ cấu hình')
    } catch (err) {
      showNotification('error', 'Lỗi khi lưu toàn bộ cấu hình')
    } finally {
      setIsSaving(null)
    }
  }

  const handleReset = (section: HomepageSectionKey) => {
    if (confirm('Khôi phục về mặc định ban đầu? Dữ liệu hiện tại của phần này sẽ bị mất nếu bạn lưu.')) {
      setConfigs(prev => ({ ...prev, [section]: DEFAULTS[section] }))
    }
  }

  const commonInputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }
  const commonLabelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }

  const commonProps = { handleUpdateConfig, commonLabelStyle, commonInputStyle }

  return (
    <AdminLayout title="Cài đặt Trang chủ" breadcrumb={['Quản trị', 'Tổng quan', 'Trang chủ']}>
      {notification && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 100,
          background: 'white', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          borderLeft: `4px solid ${notification.type === 'success' ? '#22c55e' : '#ef4444'}`,
          display: 'flex', alignItems: 'center', gap: 12,
          animation: 'admin-fadeIn 0.3s ease', maxWidth: 400,
        }}>
          {notification.type === 'success' ? <Check size={18} style={{ color: '#22c55e' }} /> : <X size={18} style={{ color: '#ef4444' }} />}
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{notification.message}</div>
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>Đang tải...</div>
      ) : (
        <div style={{ maxWidth: 900 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <button className="admin-btn admin-btn-primary" onClick={handleSaveAll} disabled={!!isSaving || !canEdit}>
              <Save size={16} /> Lưu toàn bộ
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SECTION_CONFIG.map((section) => {
              const Icon = ICONS[section.icon] || Layout
              const isExpanded = expandedSection === section.key
              const data = configs[section.key]

              return (
                <div key={section.key} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Header */}
                  <div 
                    style={{ 
                      padding: '16px 24px', background: isExpanded ? '#f8fafc' : 'white', 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none'
                    }}
                    onClick={() => setExpandedSection(isExpanded ? null : section.key)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{section.label}</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{section.description}</div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                  </div>

                  {/* Form Body */}
                  {isExpanded && (
                    <div style={{ padding: 24, background: 'white' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                        
                        {section.key === 'homepage_hero' && <HeroSettings data={data} {...commonProps} />}
                        {section.key === 'homepage_nav' && <NavSettings data={data} {...commonProps} />}
                        {section.key === 'homepage_values' && <ValuesSettings data={data} {...commonProps} />}
                        
                        {['homepage_collections', 'homepage_specs', 'homepage_news', 'homepage_products', 'homepage_gallery'].includes(section.key) && (
                          <SimpleSectionSettings 
                            sectionKey={section.key as any} 
                            data={data} 
                            collectionsList={collectionsList}
                            {...commonProps} 
                          />
                        )}

                        {section.key === 'homepage_contact' && <ContactSettings data={data} {...commonProps} />}
                        {section.key === 'homepage_footer' && <FooterSettings data={data} {...commonProps} />}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                          <button 
                            className="admin-btn" 
                            style={{ background: 'transparent', color: '#64748b', gap: 6 }}
                            onClick={() => handleReset(section.key)}
                          >
                            <RotateCcw size={14} /> Khôi phục mặc định
                          </button>
                          <button 
                            className="admin-btn admin-btn-primary" 
                            style={{ padding: '8px 24px' }}
                            onClick={() => handleSave(section.key)}
                            disabled={isSaving === section.key || !canEdit}
                          >
                            <Save size={16} /> {isSaving === section.key ? 'Đang lưu...' : 'Lưu thay đổi'}
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
