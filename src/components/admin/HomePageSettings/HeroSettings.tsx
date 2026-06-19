import { type HomepageSectionKey } from '@/types/home'

interface SettingsProps {
  data: any
  handleUpdateConfig: (section: HomepageSectionKey, field: string, value: any) => void
  commonLabelStyle: any
  commonInputStyle: any
}

export function HeroSettings({ data, handleUpdateConfig, commonLabelStyle, commonInputStyle }: SettingsProps) {
  const sectionKey = 'homepage_hero'
  return (
    <>
      <div>
        <label style={commonLabelStyle}>Badge Text (Slogan nhỏ)</label>
        <input type="text" value={data.badgeText} onChange={e => handleUpdateConfig(sectionKey, 'badgeText', e.target.value)} style={commonInputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <label style={commonLabelStyle}>Tiêu đề chính</label>
          <input type="text" value={data.title} onChange={e => handleUpdateConfig(sectionKey, 'title', e.target.value)} style={commonInputStyle} />
        </div>
        <div>
          <label style={commonLabelStyle}>Từ khóa nhấn mạnh (Highlight)</label>
          <input type="text" value={data.titleHighlight} onChange={e => handleUpdateConfig(sectionKey, 'titleHighlight', e.target.value)} style={commonInputStyle} />
        </div>
      </div>
      <div>
        <label style={commonLabelStyle}>Phụ đề (Subtitle)</label>
        <textarea value={data.subtitle} onChange={e => handleUpdateConfig(sectionKey, 'subtitle', e.target.value)} style={{ ...commonInputStyle, minHeight: 80 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <label style={commonLabelStyle}>Nút CTA 1 (Text)</label>
          <input type="text" value={data.ctaPrimaryText} onChange={e => handleUpdateConfig(sectionKey, 'ctaPrimaryText', e.target.value)} style={commonInputStyle} />
          <label style={{ ...commonLabelStyle, marginTop: 10 }}>Link CTA 1</label>
          <input type="text" value={data.ctaPrimaryLink} onChange={e => handleUpdateConfig(sectionKey, 'ctaPrimaryLink', e.target.value)} style={commonInputStyle} />
        </div>
        <div>
          <label style={commonLabelStyle}>Nút CTA 2 (Text)</label>
          <input type="text" value={data.ctaSecondaryText} onChange={e => handleUpdateConfig(sectionKey, 'ctaSecondaryText', e.target.value)} style={commonInputStyle} />
          <label style={{ ...commonLabelStyle, marginTop: 10 }}>Link CTA 2</label>
          <input type="text" value={data.ctaSecondaryLink} onChange={e => handleUpdateConfig(sectionKey, 'ctaSecondaryLink', e.target.value)} style={commonInputStyle} />
        </div>
      </div>
      <div style={{ padding: 16, background: '#f8fafc', borderRadius: 10, fontSize: 13, color: '#64748b' }}>
        💡 <strong>Ghi chú:</strong> Hình ảnh nền của Hero sẽ được cấu hình trong phần Bộ sưu tập (các bộ sưu tập nổi bật sẽ xuất hiện ở Hero).
      </div>
    </>
  )
}
