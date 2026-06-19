import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import type { ProductSpecRecord } from '@/types/admin'

type ProductSpecWithProduct = ProductSpecRecord & {
  products: { name: string; code: string } | null
}

export function ProductSpecsManager() {
  const [specs, setSpecs] = useState<ProductSpecWithProduct[]>([])
  const [productsList, setProductsList] = useState<{ id: string; name: string; code: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    product_id: '',
    pile_type: '',
    construction: '',
    backing: '',
    size: '',
    installation: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [specsRes, productsRes] = await Promise.all([
      supabase.from('product_specs').select('*, products(name, code)').order('created_at', { ascending: false }),
      supabase.from('products').select('id, name, code').order('code')
    ])
    if (specsRes.data) setSpecs(specsRes.data)
    if (productsRes.data) setProductsList(productsRes.data)
    setIsLoading(false)
  }

  const openModal = (item?: ProductSpecWithProduct) => {
    if (item) {
      setEditingId(item.id)
      setFormData({
        product_id: item.product_id,
        pile_type: item.pile_type || '',
        construction: item.construction || '',
        backing: item.backing || '',
        size: item.size || '',
        installation: item.installation || ''
      })
    } else {
      setEditingId(null)
      setFormData({
        product_id: productsList[0]?.id || '',
        pile_type: '',
        construction: '',
        backing: '',
        size: '',
        installation: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.product_id) {
      alert('Vui lòng chọn sản phẩm')
      return
    }

    if (editingId) {
      const { error } = await supabase.from('product_specs').update(formData).eq('id', editingId)
      if (error) alert('Lỗi cập nhật: ' + error.message)
      else {
        setIsModalOpen(false)
        loadData()
      }
    } else {
      const { error } = await supabase.from('product_specs').insert([formData])
      if (error) {
        if (error.code === '23505') { // unique violation
          alert('Sản phẩm này đã có thông số. Vui lòng sửa thay vì thêm mới.')
        } else {
          alert('Lỗi thêm mới: ' + error.message)
        }
      } else {
        setIsModalOpen(false)
        loadData()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa thông số này?')) return
    const { error } = await supabase.from('product_specs').delete().eq('id', id)
    if (error) alert('Lỗi khi xóa: ' + error.message)
    else loadData()
  }

  return (
    <AdminLayout title="Quản lý Thông Số Sản Phẩm">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button className="admin-btn admin-btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> Thêm Thông Số
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : specs.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Chưa có dữ liệu nào</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px' }}>Sản phẩm</th>
                  <th style={{ padding: '12px 16px' }}>Pile Type</th>
                  <th style={{ padding: '12px 16px' }}>Construction</th>
                  <th style={{ padding: '12px 16px' }}>Backing</th>
                  <th style={{ padding: '12px 16px' }}>Size</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {specs.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                      {s.products?.name} ({s.products?.code})
                    </td>
                    <td style={{ padding: '12px 16px' }}>{s.pile_type || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{s.construction || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{s.backing || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{s.size || '-'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openModal(s)}><Edit2 size={16} /></button>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(s.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{editingId ? 'Sửa Thông Số' : 'Thêm Thông Số mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Sản phẩm liên kết *</label>
                <select 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.product_id}
                  onChange={e => setFormData({...formData, product_id: e.target.value})}
                  required
                  disabled={!!editingId} // Không cho đổi sản phẩm khi đang edit vì 1-1 mapping
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {productsList.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                </select>
                {!!editingId && <small style={{ color: '#94a3b8', display: 'block', marginTop: 4 }}>Không thể thay đổi sản phẩm khi cập nhật.</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Pile Type</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.pile_type}
                  onChange={e => setFormData({...formData, pile_type: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Construction</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.construction}
                  onChange={e => setFormData({...formData, construction: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Backing</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.backing}
                  onChange={e => setFormData({...formData, backing: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Size</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.size}
                  onChange={e => setFormData({...formData, size: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Installation</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.installation}
                  onChange={e => setFormData({...formData, installation: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn-primary">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
