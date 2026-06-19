import { Trash2, Plus } from 'lucide-react'
import { type HomepageSectionKey } from '@/types/home'

interface SettingsProps {
  data: any
  handleUpdateConfig: (section: HomepageSectionKey, field: string, value: any) => void
  commonLabelStyle: any
  commonInputStyle: any
}

export function NavSettings({ data, handleUpdateConfig, commonLabelStyle, commonInputStyle }: SettingsProps) {
  const sectionKey = 'homepage_nav'
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <label style={commonLabelStyle}>Logo Text</label>
          <input type="text" value={data.logoText} onChange={e => handleUpdateConfig(sectionKey, 'logoText', e.target.value)} style={commonInputStyle} />
        </div>
        <div>
          <label style={commonLabelStyle}>Logo Subtext</label>
          <input type="text" value={data.logoSubtext} onChange={e => handleUpdateConfig(sectionKey, 'logoSubtext', e.target.value)} style={commonInputStyle} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <label style={commonLabelStyle}>Số điện thoại</label>
          <input type="text" value={data.phone} onChange={e => handleUpdateConfig(sectionKey, 'phone', e.target.value)} style={commonInputStyle} />
        </div>
        <div>
          <label style={commonLabelStyle}>Nút Gọi (Text)</label>
          <input type="text" value={data.ctaButtonText} onChange={e => handleUpdateConfig(sectionKey, 'ctaButtonText', e.target.value)} style={commonInputStyle} />
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
                handleUpdateConfig(sectionKey, 'menuItems', newItems)
              }} style={{ ...commonInputStyle, flex: 1 }} />
              <input type="text" value={item.href} placeholder="Link (vd: #collections)" onChange={e => {
                const newItems = [...data.menuItems]
                newItems[i].href = e.target.value
                handleUpdateConfig(sectionKey, 'menuItems', newItems)
              }} style={{ ...commonInputStyle, flex: 1 }} />
              <button className="admin-btn" style={{ padding: '0 12px', background: '#fee2e2', color: '#ef4444' }} onClick={() => {
                const newItems = data.menuItems.filter((_: any, idx: number) => idx !== i)
                handleUpdateConfig(sectionKey, 'menuItems', newItems)
              }}><Trash2 size={16} /></button>
            </div>
          ))}
          <button className="admin-btn" style={{ padding: '8px 12px', background: '#f1f5f9', alignSelf: 'flex-start' }} onClick={() => {
            handleUpdateConfig(sectionKey, 'menuItems', [...data.menuItems, { label: '', href: '' }])
          }}><Plus size={16} /> Thêm link mới</button>
        </div>
      </div>
    </>
  )
}
