export function BasicInfoForm({ form, updateField, toSlug }: any) {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Thông tin cơ bản</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="admin-input-group">
          <label className="admin-input-label">Tên bộ sưu tập *</label>
          <input required className="admin-input" placeholder="Ví dụ: EcoSoft Series"
            value={form.name} onChange={e => updateField('name', e.target.value)} />
          {form.name && <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Slug: {toSlug(form.name)}</span>}
        </div>
        <div className="admin-input-group">
          <label className="admin-input-label">Tagline</label>
          <input className="admin-input" placeholder="Slogan ngắn"
            value={form.tagline} onChange={e => updateField('tagline', e.target.value)} />
        </div>
        <div className="admin-input-group">
          <label className="admin-input-label">Mô tả ngắn (Summary)</label>
          <textarea className="admin-input" rows={3} placeholder="Mô tả tóm tắt..."
            value={form.summary} onChange={e => updateField('summary', e.target.value)} />
        </div>
        <div className="admin-input-group">
          <label className="admin-input-label">Mô tả chi tiết (Detail)</label>
          <textarea className="admin-input" rows={5} placeholder="Nội dung chi tiết..."
            value={form.detail} onChange={e => updateField('detail', e.target.value)} />
        </div>
      </div>
    </div>
  )
}
