/** SettingsPage — Website settings management */
import { useState, useEffect, type FormEvent } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Save, Globe, Phone, Share2, Tag } from 'lucide-react'
import { toast } from 'sonner'

interface SiteInfo {
  name: string
  description: string
  url: string
  logo_url?: string
}

interface ContactInfo {
  phone: string
  email: string
  address: string
}

interface SocialLinks {
  facebook: string
  zalo: string
  linkedin: string
}

interface BrandInfo {
  badge_text: string
  cta_text: string
  hero_tagline: string
}

const DEFAULT_SITE: SiteInfo = { name: 'Carpets Inter Vietnam', description: 'Thảm sàn cao cấp cho không gian hiện đại', url: 'https://carpetsinter.vn', logo_url: '' }
const DEFAULT_CONTACT: ContactInfo = { phone: '028 1234 5678', email: 'info@carpetsinter.vn', address: 'Tầng 5, Tòa nhà AB Tower, 76A Lê Lai, Quận 1, TP.HCM' }
const DEFAULT_SOCIAL: SocialLinks = { facebook: '', zalo: '', linkedin: '' }
const DEFAULT_BRAND: BrandInfo = {
  badge_text: 'Giao hàng và thi công nhanh chóng trên toàn quốc.',
  cta_text: 'Liên hệ ngay để được tư vấn đúng bộ sưu tập, đúng cấu trúc bề mặt và đúng sắc độ phù hợp với concept công trình của bạn.',
  hero_tagline: 'Nội thất công cộng Minh Đức đồng hành cùng đối tác quốc tế Carpets Inter, mang giải pháp thảm sàn sinh thái đẳng cấp toàn cầu đến mọi công trình.'
}

const DEMO_STORAGE_KEY = 'ci_admin_settings'

export function SettingsPage() {
  const { user, isDemoMode, hasPermission } = useAuth()
  const canEdit = hasPermission('settings.edit')
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULT_SITE)
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT)
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(DEFAULT_SOCIAL)
  const [brandInfo, setBrandInfo] = useState<BrandInfo>(DEFAULT_BRAND)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const showNotification = (type: 'success' | 'error', message: string) => {
    if (type === 'success') toast.success(message)
    else toast.error(message)
  }

  // Load settings
  useEffect(() => {
    async function loadSettings() {
      if (isDemoMode) {
        try {
          const saved = localStorage.getItem(DEMO_STORAGE_KEY)
          if (saved) {
            const parsed = JSON.parse(saved)
            if (parsed.site_info) setSiteInfo(parsed.site_info)
            if (parsed.contact_info) setContactInfo(parsed.contact_info)
            if (parsed.social_links) setSocialLinks(parsed.social_links)
            if (parsed.brand_info) setBrandInfo(parsed.brand_info)
          }
        } catch { /* ignore */ }
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from('site_config').select('*')
        if (error) throw error

        if (data) {
          for (const row of data) {
            const val = row.value as Record<string, string>
            switch (row.key) {
              case 'site_info':
                setSiteInfo({ name: val.name || '', description: val.description || '', url: val.url || '', logo_url: val.logo_url || '' })
                break
              case 'contact_info':
                setContactInfo({ phone: val.phone || '', email: val.email || '', address: val.address || '' })
                break
              case 'social_links':
                setSocialLinks({ facebook: val.facebook || '', zalo: val.zalo || '', linkedin: val.linkedin || '' })
                break
              case 'brand_info':
                setBrandInfo({
                  badge_text: val.badge_text || DEFAULT_BRAND.badge_text,
                  cta_text: val.cta_text || DEFAULT_BRAND.cta_text,
                  hero_tagline: val.hero_tagline || DEFAULT_BRAND.hero_tagline,
                })
                break
            }
          }
        }
      } catch (err) {
        console.error('Error loading settings:', err)
      }
      setIsLoading(false)
    }
    loadSettings()
  }, [isDemoMode])

  // Save settings
  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    if (isDemoMode) {
      try {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({
          site_info: siteInfo,
          contact_info: contactInfo,
          social_links: socialLinks,
          brand_info: brandInfo,
        }))
        showNotification('success', 'Đã lưu cài đặt (Demo Mode)')
      } catch {
        showNotification('error', 'Lỗi lưu cài đặt')
      }
      setIsSaving(false)
      return
    }

    try {
      const configs = [
        { key: 'site_info', value: siteInfo },
        { key: 'contact_info', value: contactInfo },
        { key: 'social_links', value: socialLinks },
        { key: 'brand_info', value: brandInfo },
      ]

      for (const cfg of configs) {
        const { error } = await supabase.from('site_config').upsert(
          { key: cfg.key, value: cfg.value, updated_by: user?.id },
          { onConflict: 'key' }
        )
        if (error) throw error
      }

      showNotification('success', 'Đã lưu cài đặt thành công!')
    } catch (err) {
      console.error('Save error:', err)
      showNotification('error', 'Lỗi khi lưu cài đặt')
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <AdminLayout title="Cài đặt Website" breadcrumb={['Quản trị', 'Hệ thống', 'Cài đặt']}>
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #f29d38', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Đang tải cài đặt...
        </div>
      </AdminLayout>
    )
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      showNotification('error', 'File quá lớn (tối đa 2MB)')
      return
    }

    if (isDemoMode) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setSiteInfo({ ...siteInfo, logo_url: ev.target?.result as string })
      }
      reader.readAsDataURL(file)
      return
    }

    const ext = file.name.split('.').pop() || 'png'
    const path = `settings/logo_${Date.now()}.${ext}`

    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)
    if (uploadErr) {
      showNotification('error', `Upload lỗi: ${uploadErr.message}`)
      return
    }

    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(path)
    setSiteInfo({ ...siteInfo, logo_url: publicUrlData.publicUrl })
  }

  const cardStyle = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }
  const sectionTitleStyle = { margin: '0 0 20px 0', fontSize: 16, fontWeight: 600 as const, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 10 }

  return (
    <AdminLayout title="Cài đặt Website" breadcrumb={['Quản trị', 'Hệ thống', 'Cài đặt']}>
      <form onSubmit={handleSave}>
        <div className="admin-action-bar" style={{ justifyContent: 'flex-end' }}>
          {canEdit && (
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isSaving}>
              <Save size={16} />
              {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
          {/* Site Info */}
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <Globe size={20} color="#f29d38" /> Thông tin Website
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="admin-input-group">
                <label className="admin-input-label">Tên website</label>
                <input className="admin-input" value={siteInfo.name} disabled={!canEdit}
                  onChange={e => setSiteInfo({ ...siteInfo, name: e.target.value })}
                  placeholder="Tên hiển thị của website" />
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">Mô tả website</label>
                <textarea className="admin-input" rows={3} value={siteInfo.description} disabled={!canEdit}
                  onChange={e => setSiteInfo({ ...siteInfo, description: e.target.value })}
                  placeholder="Mô tả ngắn về website" />
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">URL website</label>
                <input className="admin-input" value={siteInfo.url} disabled={!canEdit}
                  onChange={e => setSiteInfo({ ...siteInfo, url: e.target.value })}
                  placeholder="https://example.com" />
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">Logo công ty</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {siteInfo.logo_url ? (
                    <img src={siteInfo.logo_url} alt="Logo" style={{ height: 40, width: 'auto', objectFit: 'contain', borderRadius: 4, background: '#f8fafc', padding: 4, border: '1px solid #e2e8f0' }} />
                  ) : (
                    <div style={{ width: 40, height: 40, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 }}>Trống</div>
                  )}
                  <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                    <input 
                      className="admin-input" 
                      style={{ flex: 1 }}
                      value={siteInfo.logo_url}
                      disabled={!canEdit}
                      onChange={e => setSiteInfo({ ...siteInfo, logo_url: e.target.value })}
                      placeholder="Nhập URL logo hoặc tải lên..."
                    />
                    <label className={`admin-btn ${canEdit ? 'admin-btn-secondary' : 'admin-btn-ghost'}`} style={{ cursor: canEdit ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
                      Tải lên
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={!canEdit} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <Phone size={20} color="#22c55e" /> Thông tin Liên hệ
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Số điện thoại</label>
                  <input className="admin-input" value={contactInfo.phone} disabled={!canEdit}
                    onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="028 xxxx xxxx" />
                </div>
                <div className="admin-input-group">
                  <label className="admin-input-label">Email liên hệ</label>
                  <input className="admin-input" type="email" value={contactInfo.email} disabled={!canEdit}
                    onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="info@example.com" />
                </div>
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">Địa chỉ</label>
                <textarea className="admin-input" rows={2} value={contactInfo.address} disabled={!canEdit}
                  onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })}
                  placeholder="Địa chỉ văn phòng" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <Share2 size={20} color="#3b82f6" /> Mạng xã hội
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="admin-input-group">
                <label className="admin-input-label">Facebook URL</label>
                <input className="admin-input" value={socialLinks.facebook} disabled={!canEdit}
                  onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  placeholder="https://facebook.com/yourpage" />
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">Zalo số</label>
                <input className="admin-input" value={socialLinks.zalo} disabled={!canEdit}
                  onChange={e => setSocialLinks({ ...socialLinks, zalo: e.target.value })}
                  placeholder="0901234567" />
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">LinkedIn URL</label>
                <input className="admin-input" value={socialLinks.linkedin} disabled={!canEdit}
                  onChange={e => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/yourcompany" />
              </div>
            </div>
          </div>

          {/* Brand Info */}
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <Tag size={20} color="#e8720c" /> Nội dung thương hiệu
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="admin-input-group">
                <label className="admin-input-label">Badge thông báo (thanh trên hero)</label>
                <input className="admin-input" value={brandInfo.badge_text} disabled={!canEdit}
                  onChange={e => setBrandInfo({ ...brandInfo, badge_text: e.target.value })}
                  placeholder="Giao hàng và thi công nhanh chóng trên toàn quốc." />
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">Tagline Hero (phụ đề bên dưới tiêu đề lớn)</label>
                <textarea className="admin-input" rows={3} value={brandInfo.hero_tagline} disabled={!canEdit}
                  onChange={e => setBrandInfo({ ...brandInfo, hero_tagline: e.target.value })}
                  placeholder="Mô tả thương hiệu ngắn gọn, hiện dưới tiêu đề trang chủ" />
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">Nội dung CTA tư vấn (phần Giá trị nổi bật)</label>
                <textarea className="admin-input" rows={3} value={brandInfo.cta_text} disabled={!canEdit}
                  onChange={e => setBrandInfo({ ...brandInfo, cta_text: e.target.value })}
                  placeholder="Liên hệ ngay để được tư vấn..." />
              </div>
            </div>
          </div>

          {!canEdit && (
            <div style={{ background: '#fef9e7', borderRadius: 12, padding: 16, border: '1px solid #fde68a', fontSize: 14, color: '#92400e' }}>
              ⚠️ Bạn không có quyền chỉnh sửa cài đặt. Liên hệ quản trị viên để được cấp quyền.
            </div>
          )}
        </div>
      </form>
    </AdminLayout>
  )
}
