import { type HomepageSectionKey } from '@/types/home'

interface SettingsProps {
  data: any
  handleUpdateConfig: (section: HomepageSectionKey, field: string, value: any) => void
  commonLabelStyle: any
  commonInputStyle: any
}

export function ContactSettings({ data, handleUpdateConfig, commonLabelStyle, commonInputStyle }: SettingsProps) {
  const sectionKey = 'homepage_contact'
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <label style={commonLabelStyle}>Tiêu đề</label>
          <input type="text" value={data.sectionTitle} onChange={e => handleUpdateConfig(sectionKey, 'sectionTitle', e.target.value)} style={commonInputStyle} />
        </div>
        <div>
          <label style={commonLabelStyle}>Số điện thoại</label>
          <input type="text" value={data.phone} onChange={e => handleUpdateConfig(sectionKey, 'phone', e.target.value)} style={commonInputStyle} />
        </div>
      </div>
      <div>
        <label style={commonLabelStyle}>Mô tả</label>
        <input type="text" value={data.sectionSubtitle} onChange={e => handleUpdateConfig(sectionKey, 'sectionSubtitle', e.target.value)} style={commonInputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <label style={commonLabelStyle}>Email</label>
          <input type="text" value={data.email} onChange={e => handleUpdateConfig(sectionKey, 'email', e.target.value)} style={commonInputStyle} />
        </div>
        <div>
          <label style={commonLabelStyle}>Địa chỉ</label>
          <input type="text" value={data.address} onChange={e => handleUpdateConfig(sectionKey, 'address', e.target.value)} style={commonInputStyle} />
        </div>
      </div>
      <div>
        <label style={commonLabelStyle}>Google Maps Embed URL</label>
        <input type="text" value={data.mapEmbedUrl} onChange={e => handleUpdateConfig(sectionKey, 'mapEmbedUrl', e.target.value)} style={commonInputStyle} placeholder="<iframe src='...'></iframe> hoặc link url" />
      </div>
    </>
  )
}
