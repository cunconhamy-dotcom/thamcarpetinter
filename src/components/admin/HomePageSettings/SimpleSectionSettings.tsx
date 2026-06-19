import { Check } from 'lucide-react'
import { type HomepageSectionKey } from '@/types/home'

interface SettingsProps {
  sectionKey: HomepageSectionKey
  data: any
  handleUpdateConfig: (section: HomepageSectionKey, field: string, value: any) => void
  commonLabelStyle: any
  commonInputStyle: any
  collectionsList?: any[]
}

export function SimpleSectionSettings({ sectionKey, data, handleUpdateConfig, commonLabelStyle, commonInputStyle, collectionsList = [] }: SettingsProps) {
  return (
    <>
      {/* Base Configs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <label style={{ ...commonLabelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', textTransform: 'none' }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#1e293b' }}>Hiển thị khu vực này</span>
            <input 
              type="checkbox" 
              checked={data.isVisible} 
              onChange={e => handleUpdateConfig(sectionKey, 'isVisible', e.target.checked)} 
              style={{ width: 18, height: 18, accentColor: '#f29d38' }}
            />
          </label>
        </div>
        <div>
          <label style={commonLabelStyle}>Giao diện nền (Style)</label>
          <select value={data.style} onChange={e => handleUpdateConfig(sectionKey, 'style', e.target.value)} style={commonInputStyle}>
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
              onChange={e => handleUpdateConfig(sectionKey, 'limit', parseInt(e.target.value) || 0)} 
              style={commonInputStyle} 
              min={1} max={50}
            />
          </div>
        )}
      </div>

      {/* Section Titles */}
      <div>
        <label style={commonLabelStyle}>Tiêu đề khu vực</label>
        <input type="text" value={data.sectionTitle} onChange={e => handleUpdateConfig(sectionKey, 'sectionTitle', e.target.value)} style={commonInputStyle} />
      </div>
      <div>
        <label style={commonLabelStyle}>Mô tả phụ</label>
        <input type="text" value={data.sectionSubtitle} onChange={e => handleUpdateConfig(sectionKey, 'sectionSubtitle', e.target.value)} style={commonInputStyle} />
      </div>

      {/* Custom settings for Gallery */}
      {sectionKey === 'homepage_gallery' && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
          <label style={commonLabelStyle}>Nguồn hình ảnh (Bộ sưu tập)</label>
          <select 
            value={data.collectionId || ''} 
            onChange={e => {
              handleUpdateConfig(sectionKey, 'collectionId', e.target.value)
              handleUpdateConfig(sectionKey, 'selectedImages', []) // reset
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
                          handleUpdateConfig(sectionKey, 'selectedImages', newSelected)
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
  )
}
