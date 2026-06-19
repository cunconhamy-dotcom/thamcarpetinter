import { Trash2, Plus } from 'lucide-react'
import { type HomepageSectionKey } from '@/types/home'

interface SettingsProps {
  data: any
  handleUpdateConfig: (section: HomepageSectionKey, field: string, value: any) => void
  commonLabelStyle: any
  commonInputStyle: any
}

export function FooterSettings({ data, handleUpdateConfig, commonLabelStyle, commonInputStyle }: SettingsProps) {
  const sectionKey = 'homepage_footer'
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <label style={commonLabelStyle}>Tên công ty</label>
          <input type="text" value={data.companyName} onChange={e => handleUpdateConfig(sectionKey, 'companyName', e.target.value)} style={commonInputStyle} />
        </div>
        <div>
          <label style={commonLabelStyle}>Slogan</label>
          <input type="text" value={data.slogan} onChange={e => handleUpdateConfig(sectionKey, 'slogan', e.target.value)} style={commonInputStyle} />
        </div>
      </div>
      <div>
        <label style={commonLabelStyle}>Bản quyền (Copyright)</label>
        <input type="text" value={data.copyright} onChange={e => handleUpdateConfig(sectionKey, 'copyright', e.target.value)} style={commonInputStyle} />
      </div>
      <div>
        <label style={commonLabelStyle}>Social Links</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.socialLinks.map((item: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <input type="text" value={item.platform} placeholder="Tên mạng xã hội (vd: Facebook)" onChange={e => {
                const newItems = [...data.socialLinks]
                newItems[i].platform = e.target.value
                handleUpdateConfig(sectionKey, 'socialLinks', newItems)
              }} style={{ ...commonInputStyle, width: '30%' }} />
              <input type="text" value={item.url} placeholder="Link URL" onChange={e => {
                const newItems = [...data.socialLinks]
                newItems[i].url = e.target.value
                handleUpdateConfig(sectionKey, 'socialLinks', newItems)
              }} style={{ ...commonInputStyle, flex: 1 }} />
              <button className="admin-btn" style={{ padding: '0 12px', background: '#fee2e2', color: '#ef4444' }} onClick={() => {
                const newItems = data.socialLinks.filter((_: any, idx: number) => idx !== i)
                handleUpdateConfig(sectionKey, 'socialLinks', newItems)
              }}><Trash2 size={16} /></button>
            </div>
          ))}
          <button className="admin-btn" style={{ padding: '8px 12px', background: '#f1f5f9', alignSelf: 'flex-start' }} onClick={() => {
            handleUpdateConfig(sectionKey, 'socialLinks', [...data.socialLinks, { platform: '', url: '', icon: '' }])
          }}><Plus size={16} /> Thêm Social Link</button>
        </div>
      </div>
    </>
  )
}
