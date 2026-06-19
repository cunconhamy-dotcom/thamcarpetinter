import { Trash2, Plus } from 'lucide-react'

export function DynamicListsForm({ form, handleAddQuickFact, handleUpdateQuickFact, handleRemoveQuickFact, handleAddValuePoint, handleUpdateValuePoint, handleRemoveValuePoint }: any) {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Đặc điểm & Giá trị</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Quick Facts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <label className="admin-input-label">Đặc điểm nổi bật (Quick Facts)</label>
            <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={handleAddQuickFact}>
              <Plus size={14} /> Thêm
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {form.quickFacts.map((fact: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <input className="admin-input" value={fact} onChange={e => handleUpdateQuickFact(i, e.target.value)} placeholder="Nhập đặc điểm..." />
                <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleRemoveQuickFact(i)}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
        {/* Value Points */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <label className="admin-input-label">Giá trị mang lại (Value Points)</label>
            <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={handleAddValuePoint}>
              <Plus size={14} /> Thêm
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {form.valuePoints.map((point: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <input className="admin-input" value={point} onChange={e => handleUpdateValuePoint(i, e.target.value)} placeholder="Nhập giá trị..." />
                <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleRemoveValuePoint(i)}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
