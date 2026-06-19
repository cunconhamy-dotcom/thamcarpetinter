import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import type { CollectionResourceRecord } from '@/types/admin'

type ResourceWithCollection = CollectionResourceRecord & {
  collections: { name: string } | null
}

export function CollectionResourcesManager() {
  const [resources, setResources] = useState<ResourceWithCollection[]>([])
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    collection_id: '',
    label: '',
    resource_type: 'brochure',
    file_url: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [resourcesRes, collectionsRes] = await Promise.all([
      supabase.from('collection_resources').select('*, collections(name)').order('created_at', { ascending: false }),
      supabase.from('collections').select('id, name').order('name')
    ])
    if (resourcesRes.data) setResources(resourcesRes.data)
    if (collectionsRes.data) setCollections(collectionsRes.data)
    setIsLoading(false)
  }

  const openModal = (item?: ResourceWithCollection) => {
    if (item) {
      setEditingId(item.id)
      setFormData({
        collection_id: item.collection_id,
        label: item.label,
        resource_type: item.resource_type,
        file_url: item.file_url
      })
    } else {
      setEditingId(null)
      setFormData({
        collection_id: collections[0]?.id || '',
        label: '',
        resource_type: 'brochure',
        file_url: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.collection_id || !formData.label || !formData.resource_type || !formData.file_url) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc')
      return
    }

    if (editingId) {
      const { error } = await supabase.from('collection_resources').update(formData).eq('id', editingId)
      if (error) alert('Lỗi cập nhật: ' + error.message)
      else {
        setIsModalOpen(false)
        loadData()
      }
    } else {
      const { error } = await supabase.from('collection_resources').insert([formData])
      if (error) alert('Lỗi thêm mới: ' + error.message)
      else {
        setIsModalOpen(false)
        loadData()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tài liệu này?')) return
    const { error } = await supabase.from('collection_resources').delete().eq('id', id)
    if (error) alert('Lỗi khi xóa: ' + error.message)
    else loadData()
  }

  return (
    <AdminLayout title="Quản lý Tài Liệu (Resources)">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button className="admin-btn admin-btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> Thêm Tài Liệu
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : resources.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Chưa có dữ liệu nào</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px' }}>Nhãn (Label)</th>
                <th style={{ padding: '12px 16px' }}>Loại (Type)</th>
                <th style={{ padding: '12px 16px' }}>File URL</th>
                <th style={{ padding: '12px 16px' }}>Bộ sưu tập</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{r.label}</td>
                  <td style={{ padding: '12px 16px' }}>{r.resource_type}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <a href={r.file_url} target="_blank" rel="noopener noreferrer" style={{ color: '#f29d38', textDecoration: 'underline' }}>Xem file</a>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{r.collections?.name || '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openModal(r)}><Edit2 size={16} /></button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(r.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{editingId ? 'Sửa Tài Liệu' : 'Thêm Tài Liệu mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Bộ sưu tập liên kết *</label>
                <select 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.collection_id}
                  onChange={e => setFormData({...formData, collection_id: e.target.value})}
                  required
                >
                  <option value="">-- Chọn bộ sưu tập --</option>
                  {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Nhãn hiển thị (Label) *</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.label}
                  onChange={e => setFormData({...formData, label: e.target.value})}
                  placeholder="VD: Brochure, Catalog..."
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Loại tài liệu (Type) *</label>
                <select 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.resource_type}
                  onChange={e => setFormData({...formData, resource_type: e.target.value})}
                  required
                >
                  <option value="brochure">Brochure</option>
                  <option value="specification">Specification</option>
                  <option value="installation">Installation</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Đường dẫn file (URL) *</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.file_url}
                  onChange={e => setFormData({...formData, file_url: e.target.value})}
                  placeholder="https://..."
                  required
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
