import { Plus, Trash2, Image as ImageIcon } from 'lucide-react'

export function GalleryManager({ form, handleAddGalleryImage, handleUpdateGalleryImage, handleRemoveGalleryImage }: any) {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Hình ảnh Gallery ({form.gallery.length} ảnh)</h3>
        <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={handleAddGalleryImage}>
          <Plus size={14} /> Thêm ảnh
        </button>
      </div>

      {form.gallery.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {form.gallery.map((url: string, i: number) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#f9fafb', padding: 12, borderRadius: 12, border: '1px solid #f0f0f5' }}>
              {url ? (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden' }}>
                  <img src={url} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                  <ImageIcon size={24} />
                </div>
              )}
              <input className="admin-input" style={{ padding: '8px 10px', fontSize: 13 }} placeholder="Nhập URL hình ảnh..." value={url} onChange={e => handleUpdateGalleryImage(i, e.target.value)} />
              <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleRemoveGalleryImage(i)} style={{ width: '100%', justifyContent: 'center' }}>
                <Trash2 size={14} /> Xóa
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: 32, background: '#f9fafb', borderRadius: 12 }}>
          Chưa có hình ảnh — nhấn "Thêm ảnh" để nhập URL ảnh hiển thị
        </div>
      )}
    </div>
  )
}
