import { Trash2, Plus } from 'lucide-react'
import { type HomepageSectionKey } from '@/types/home'

interface SettingsProps {
  data: any
  handleUpdateConfig: (section: HomepageSectionKey, field: string, value: any) => void
  commonLabelStyle: any
  commonInputStyle: any
}

export function ValuesSettings({ data, handleUpdateConfig, commonLabelStyle, commonInputStyle }: SettingsProps) {
  const sectionKey = 'homepage_values'
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
        <label style={commonLabelStyle}>Câu kêu gọi hành động (Dưới cùng)</label>
        <textarea value={data.ctaText} onChange={e => handleUpdateConfig(sectionKey, 'ctaText', e.target.value)} style={{ ...commonInputStyle, minHeight: 60 }} />
      </div>
      <div>
        <label style={commonLabelStyle}>Danh sách giá trị</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.values.map((item: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <input type="text" value={item} onChange={e => {
                const newItems = [...data.values]
                newItems[i] = e.target.value
                handleUpdateConfig(sectionKey, 'values', newItems)
              }} style={{ ...commonInputStyle, flex: 1 }} />
              <button className="admin-btn" style={{ padding: '0 12px', background: '#fee2e2', color: '#ef4444' }} onClick={() => {
                const newItems = data.values.filter((_: any, idx: number) => idx !== i)
                handleUpdateConfig(sectionKey, 'values', newItems)
              }}><Trash2 size={16} /></button>
            </div>
          ))}
          <button className="admin-btn" style={{ padding: '8px 12px', background: '#f1f5f9', alignSelf: 'flex-start' }} onClick={() => {
            handleUpdateConfig(sectionKey, 'values', [...data.values, ''])
          }}><Plus size={16} /> Thêm giá trị mới</button>
        </div>
      </div>
    </>
  )
}
