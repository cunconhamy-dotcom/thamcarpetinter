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
  Save, RotateCcw, ChevronDown, ChevronUp, Plus, Trash2, Check, X, Layout
} from 'lucide-react'

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
                        
                        {/* HERO */}
                        {section.key === 'homepage_hero' && (
                          <>
                            <div>
                              <label style={commonLabelStyle}>Badge Text (Slogan nhỏ)</label>
                              <input type="text" value={data.badgeText} onChange={e => handleUpdateConfig(section.key, 'badgeText', e.target.value)} style={commonInputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                              <div>
                                <label style={commonLabelStyle}>Tiêu đề chính</label>
                                <input type="text" value={data.title} onChange={e => handleUpdateConfig(section.key, 'title', e.target.value)} style={commonInputStyle} />
                              </div>
                              <div>
                                <label style={commonLabelStyle}>Từ khóa nhấn mạnh (Highlight)</label>
                                <input type="text" value={data.titleHighlight} onChange={e => handleUpdateConfig(section.key, 'titleHighlight', e.target.value)} style={commonInputStyle} />
                              </div>
                            </div>
                            <div>
                              <label style={commonLabelStyle}>Phụ đề (Subtitle)</label>
                              <textarea value={data.subtitle} onChange={e => handleUpdateConfig(section.key, 'subtitle', e.target.value)} style={{ ...commonInputStyle, minHeight: 80 }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                              <div>
                                <label style={commonLabelStyle}>Nút CTA 1 (Text)</label>
                                <input type="text" value={data.ctaPrimaryText} onChange={e => handleUpdateConfig(section.key, 'ctaPrimaryText', e.target.value)} style={commonInputStyle} />
                                <label style={{ ...commonLabelStyle, marginTop: 10 }}>Link CTA 1</label>
                                <input type="text" value={data.ctaPrimaryLink} onChange={e => handleUpdateConfig(section.key, 'ctaPrimaryLink', e.target.value)} style={commonInputStyle} />
                              </div>
                              <div>
                                <label style={commonLabelStyle}>Nút CTA 2 (Text)</label>
                                <input type="text" value={data.ctaSecondaryText} onChange={e => handleUpdateConfig(section.key, 'ctaSecondaryText', e.target.value)} style={commonInputStyle} />
                                <label style={{ ...commonLabelStyle, marginTop: 10 }}>Link CTA 2</label>
                                <input type="text" value={data.ctaSecondaryLink} onChange={e => handleUpdateConfig(section.key, 'ctaSecondaryLink', e.target.value)} style={commonInputStyle} />
                              </div>
                            </div>
                            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 10, fontSize: 13, color: '#64748b' }}>
                              💡 <strong>Ghi chú:</strong> Hình ảnh nền của Hero sẽ được cấu hình trong phần Bộ sưu tập (các bộ sưu tập nổi bật sẽ xuất hiện ở Hero).
                            </div>
                          </>
                        )}

                        {/* NAV */}
                        {section.key === 'homepage_nav' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                              <div>
                                <label style={commonLabelStyle}>Logo Text</label>
                                <input type="text" value={data.logoText} onChange={e => handleUpdateConfig(section.key, 'logoText', e.target.value)} style={commonInputStyle} />
                              </div>
                              <div>
                                <label style={commonLabelStyle}>Logo Subtext</label>
                                <input type="text" value={data.logoSubtext} onChange={e => handleUpdateConfig(section.key, 'logoSubtext', e.target.value)} style={commonInputStyle} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                              <div>
                                <label style={commonLabelStyle}>Số điện thoại</label>
                                <input type="text" value={data.phone} onChange={e => handleUpdateConfig(section.key, 'phone', e.target.value)} style={commonInputStyle} />
                              </div>
                              <div>
                                <label style={commonLabelStyle}>Nút Gọi (Text)</label>
                                <input type="text" value={data.ctaButtonText} onChange={e => handleUpdateConfig(section.key, 'ctaButtonText', e.target.value)} style={commonInputStyle} />
                              </div>
                            </div>
                            <div>
                              <label style={commonLabelStyle}>Menu Links</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {data.menuItems.map((item: any, i: number) => (
                                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                                    <input type="text" value={item.label} placeholder="Tên menu" onChange={e => {
                                      const newItems = [...data.menuItems]
                                      newItems[i].label = e.target.value
                                      handleUpdateConfig(section.key, 'menuItems', newItems)
                                    }} style={{ ...commonInputStyle, flex: 1 }} />
                                    <input type="text" value={item.href} placeholder="Link (vd: #collections)" onChange={e => {
                                      const newItems = [...data.menuItems]
                                      newItems[i].href = e.target.value
                                      handleUpdateConfig(section.key, 'menuItems', newItems)
                                    }} style={{ ...commonInputStyle, flex: 1 }} />
                                    <button className="admin-btn" style={{ padding: '0 12px', background: '#fee2e2', color: '#ef4444' }} onClick={() => {
                                      const newItems = data.menuItems.filter((_: any, idx: number) => idx !== i)
                                      handleUpdateConfig(section.key, 'menuItems', newItems)
                                    }}><Trash2 size={16} /></button>
                                  </div>
                                ))}
                                <button className="admin-btn" style={{ padding: '8px 12px', background: '#f1f5f9', alignSelf: 'flex-start' }} onClick={() => {
                                  handleUpdateConfig(section.key, 'menuItems', [...data.menuItems, { label: '', href: '' }])
                                }}><Plus size={16} /> Thêm link mới</button>
                              </div>
                            </div>
                          </>
                        )}

                        {/* VALUES */}
                        {section.key === 'homepage_values' && (
                          <>
                            {/* Base Configs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                              <div>
                                <label style={{ ...commonLabelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', textTransform: 'none' }}>
                                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1e293b' }}>Hiển thị khu vực này</span>
                                  <input 
                                    type="checkbox" 
                                    checked={data.isVisible} 
                                    onChange={e => handleUpdateConfig(section.key, 'isVisible', e.target.checked)} 
                                    style={{ width: 18, height: 18, accentColor: '#f29d38' }}
                                  />
                                </label>
                              </div>
                              <div>
                                <label style={commonLabelStyle}>Giao diện nền (Style)</label>
                                <select value={data.style} onChange={e => handleUpdateConfig(section.key, 'style', e.target.value)} style={commonInputStyle}>
                                  <option value="light">Nền sáng (Sạch sẽ, hiện đại)</option>
                                  <option value="dark">Nền tối (Sang trọng, nổi bật)</option>
                                </select>
                              </div>
                              {data.limit !== undefined && (
                                <div>
                                  <label style={commonLabelStyle}>Giới hạn hiển thị (Limit)</label>
                                  <input 
                                    type="number" 
                                    value={data.limit} 
                                    onChange={e => handleUpdateConfig(section.key, 'limit', parseInt(e.target.value) || 0)} 
                                    style={commonInputStyle} 
                                    min={1} max={50}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Section Titles */}
                            <div>
                              <label style={commonLabelStyle}>Tiêu đề khu vực</label>
                              <input type="text" value={data.sectionTitle} onChange={e => handleUpdateConfig(section.key, 'sectionTitle', e.target.value)} style={commonInputStyle} />
                            </div>
                            <div>
                              <label style={commonLabelStyle}>Câu kêu gọi hành động (Dưới cùng)</label>
                              <textarea value={data.ctaText} onChange={e => handleUpdateConfig(section.key, 'ctaText', e.target.value)} style={{ ...commonInputStyle, minHeight: 60 }} />
                            </div>
                            <div>
                              <label style={commonLabelStyle}>Danh sách giá trị</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {data.values.map((item: string, i: number) => (
                                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                                    <input type="text" value={item} onChange={e => {
                                      const newItems = [...data.values]
                                      newItems[i] = e.target.value
                                      handleUpdateConfig(section.key, 'values', newItems)
                                    }} style={{ ...commonInputStyle, flex: 1 }} />
                                    <button className="admin-btn" style={{ padding: '0 12px', background: '#fee2e2', color: '#ef4444' }} onClick={() => {
                                      const newItems = data.values.filter((_: any, idx: number) => idx !== i)
                                      handleUpdateConfig(section.key, 'values', newItems)
                                    }}><Trash2 size={16} /></button>
                                  </div>
                                ))}
                                <button className="admin-btn" style={{ padding: '8px 12px', background: '#f1f5f9', alignSelf: 'flex-start' }} onClick={() => {
                                  handleUpdateConfig(section.key, 'values', [...data.values, ''])
                                }}><Plus size={16} /> Thêm giá trị mới</button>
                              </div>
                            </div>
                          </>
                        )}

                        {/* SIMPLE SECTIONS (Collections, Specs, News, Products, Gallery) */}
                        {['homepage_collections', 'homepage_specs', 'homepage_news', 'homepage_products', 'homepage_gallery'].includes(section.key) && (
                          <>
                            {/* Base Configs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                              <div>
                                <label style={{ ...commonLabelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', textTransform: 'none' }}>
                                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1e293b' }}>Hiển thị khu vực này</span>
                                  <input 
                                    type="checkbox" 
                                    checked={data.isVisible} 
                                    onChange={e => handleUpdateConfig(section.key, 'isVisible', e.target.checked)} 
                                    style={{ width: 18, height: 18, accentColor: '#f29d38' }}
                                  />
                                </label>
                              </div>
                              <div>
                                <label style={commonLabelStyle}>Giao diện nền (Style)</label>
                                <select value={data.style} onChange={e => handleUpdateConfig(section.key, 'style', e.target.value)} style={commonInputStyle}>
                                  <option value="light">Nền sáng (Sạch sẽ, hiện đại)</option>
                                  <option value="dark">Nền tối (Sang trọng, nổi bật)</option>
                                </select>
                              </div>
                              {data.limit !== undefined && (
                                <div>
                                  <label style={commonLabelStyle}>Giới hạn hiển thị (Limit)</label>
                                  <input 
                                    type="number" 
                                    value={data.limit} 
                                    onChange={e => handleUpdateConfig(section.key, 'limit', parseInt(e.target.value) || 0)} 
                                    style={commonInputStyle} 
                                    min={1} max={50}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Section Titles */}
                            <div>
                              <label style={commonLabelStyle}>Tiêu đề khu vực</label>
                              <input type="text" value={data.sectionTitle} onChange={e => handleUpdateConfig(section.key, 'sectionTitle', e.target.value)} style={commonInputStyle} />
                            </div>
                            <div>
                              <label style={commonLabelStyle}>Mô tả phụ</label>
                              <input type="text" value={data.sectionSubtitle} onChange={e => handleUpdateConfig(section.key, 'sectionSubtitle', e.target.value)} style={commonInputStyle} />
                            </div>

                            {/* Custom settings for Gallery */}
                            {section.key === 'homepage_gallery' && (
                              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                                <label style={commonLabelStyle}>Nguồn hình ảnh (Bộ sưu tập)</label>
                                <select 
                                  value={data.collectionId || ''} 
                                  onChange={e => {
                                    handleUpdateConfig(section.key, 'collectionId', e.target.value)
                                    handleUpdateConfig(section.key, 'selectedImages', []) // reset
                                  }} 
                                  style={{ ...commonInputStyle, marginBottom: 20 }}
                                >
                                  <option value="">-- Chọn một bộ sưu tập --</option>
                                  {collectionsList.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                  ))}
                                </select>

                                {data.collectionId && (
                                  <div>
                                    <label style={{ ...commonLabelStyle, display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Chọn các hình ảnh muốn hiển thị ngoài trang chủ</span>
                                      <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'none' }}>
                                        Đã chọn: {(data.selectedImages || []).length} ảnh
                                      </span>
                                    </label>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginTop: 12 }}>
                                      {(() => {
                                        const selectedCol = collectionsList.find(c => c.id === data.collectionId)
                                        const meta = selectedCol?.metadata || {}
                                        const galleryUrls = meta.gallery || []
                                        const productUrls = (meta.products || []).map((p: any) => p.image).filter(Boolean)
                                        const availableImages = Array.from(new Set([...galleryUrls, ...productUrls]))
                                        const selectedSet = new Set(data.selectedImages || [])

                                        if (availableImages.length === 0) {
                                          return <div style={{ gridColumn: '1 / -1', fontSize: 13, color: '#94a3b8' }}>Bộ sưu tập này chưa có hình ảnh nào. Hãy vào Quản trị Bộ sưu tập để thêm ảnh.</div>
                                        }

                                        return availableImages.map((imgUrl: string, idx: number) => {
                                          const isSelected = selectedSet.has(imgUrl)
                                          return (
                                            <div 
                                              key={idx}
                                              onClick={() => {
                                                const newSelected = isSelected 
                                                  ? (data.selectedImages || []).filter((u: string) => u !== imgUrl)
                                                  : [...(data.selectedImages || []), imgUrl]
                                                handleUpdateConfig(section.key, 'selectedImages', newSelected)
                                              }}
                                              style={{ 
                                                position: 'relative', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', 
                                                cursor: 'pointer', border: isSelected ? '2px solid #f29d38' : '2px solid transparent',
                                                opacity: isSelected ? 1 : 0.6, transition: 'all 0.2s'
                                              }}
                                            >
                                              <img src={imgUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                              {isSelected && (
                                                <div style={{ position: 'absolute', top: 4, right: 4, background: '#f29d38', color: 'white', borderRadius: '50%', padding: 2 }}>
                                                  <Check size={14} />
                                                </div>
                                              )}
                                            </div>
                                          )
                                        })
                                      })()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}

                        {/* CONTACT */}
                        {section.key === 'homepage_contact' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                              <div>
                                <label style={commonLabelStyle}>Tiêu đề</label>
                                <input type="text" value={data.sectionTitle} onChange={e => handleUpdateConfig(section.key, 'sectionTitle', e.target.value)} style={commonInputStyle} />
                              </div>
                              <div>
                                <label style={commonLabelStyle}>Số điện thoại</label>
                                <input type="text" value={data.phone} onChange={e => handleUpdateConfig(section.key, 'phone', e.target.value)} style={commonInputStyle} />
                              </div>
                            </div>
                            <div>
                              <label style={commonLabelStyle}>Mô tả</label>
                              <input type="text" value={data.sectionSubtitle} onChange={e => handleUpdateConfig(section.key, 'sectionSubtitle', e.target.value)} style={commonInputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                              <div>
                                <label style={commonLabelStyle}>Email</label>
                                <input type="text" value={data.email} onChange={e => handleUpdateConfig(section.key, 'email', e.target.value)} style={commonInputStyle} />
                              </div>
                              <div>
                                <label style={commonLabelStyle}>Địa chỉ</label>
                                <input type="text" value={data.address} onChange={e => handleUpdateConfig(section.key, 'address', e.target.value)} style={commonInputStyle} />
                              </div>
                            </div>
                            <div>
                              <label style={commonLabelStyle}>Google Maps Embed URL</label>
                              <input type="text" value={data.mapEmbedUrl} onChange={e => handleUpdateConfig(section.key, 'mapEmbedUrl', e.target.value)} style={commonInputStyle} placeholder="<iframe src='...'></iframe> hoặc link url" />
                            </div>
                          </>
                        )}

                        {/* FOOTER */}
                        {section.key === 'homepage_footer' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                              <div>
                                <label style={commonLabelStyle}>Tên công ty</label>
                                <input type="text" value={data.companyName} onChange={e => handleUpdateConfig(section.key, 'companyName', e.target.value)} style={commonInputStyle} />
                              </div>
                              <div>
                                <label style={commonLabelStyle}>Slogan</label>
                                <input type="text" value={data.slogan} onChange={e => handleUpdateConfig(section.key, 'slogan', e.target.value)} style={commonInputStyle} />
                              </div>
                            </div>
                            <div>
                              <label style={commonLabelStyle}>Bản quyền (Copyright)</label>
                              <input type="text" value={data.copyright} onChange={e => handleUpdateConfig(section.key, 'copyright', e.target.value)} style={commonInputStyle} />
                            </div>
                            <div>
                              <label style={commonLabelStyle}>Social Links</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {data.socialLinks.map((item: any, i: number) => (
                                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                                    <input type="text" value={item.platform} placeholder="Tên mạng xã hội (vd: Facebook)" onChange={e => {
                                      const newItems = [...data.socialLinks]
                                      newItems[i].platform = e.target.value
                                      handleUpdateConfig(section.key, 'socialLinks', newItems)
                                    }} style={{ ...commonInputStyle, width: '30%' }} />
                                    <input type="text" value={item.url} placeholder="Link URL" onChange={e => {
                                      const newItems = [...data.socialLinks]
                                      newItems[i].url = e.target.value
                                      handleUpdateConfig(section.key, 'socialLinks', newItems)
                                    }} style={{ ...commonInputStyle, flex: 1 }} />
                                    <button className="admin-btn" style={{ padding: '0 12px', background: '#fee2e2', color: '#ef4444' }} onClick={() => {
                                      const newItems = data.socialLinks.filter((_: any, idx: number) => idx !== i)
                                      handleUpdateConfig(section.key, 'socialLinks', newItems)
                                    }}><Trash2 size={16} /></button>
                                  </div>
                                ))}
                                <button className="admin-btn" style={{ padding: '8px 12px', background: '#f1f5f9', alignSelf: 'flex-start' }} onClick={() => {
                                  handleUpdateConfig(section.key, 'socialLinks', [...data.socialLinks, { platform: '', url: '', icon: '' }])
                                }}><Plus size={16} /> Thêm Social Link</button>
                              </div>
                            </div>
                          </>
                        )}

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
