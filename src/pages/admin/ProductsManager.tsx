import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Edit2, Trash2, Search, Filter, Image as ImageIcon } from 'lucide-react'

interface ProductRecord {
  id: string
  collection_id: string
  code: string
  name: string
  image: string
  highlights: string[]
  colors: string[]
  spec: {
    construction?: string
    pile?: string
    backing?: string
    size?: string
    useCase?: string
    installation?: string
  }
  sort_order?: number
}

interface CollectionBasic {
  id: string
  name: string
  slug: string
}

export function ProductsManager() {
  const { isDemoMode } = useAuth()
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [collections, setCollections] = useState<CollectionBasic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCollection, setFilterCollection] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const { data: cols } = await supabase.from('collections').select('id, name, slug').order('name')
    if (cols) setCollections(cols)

    const { data: prods } = await supabase.from('products').select('*').order('collection_id').order('sort_order', { ascending: true }).order('code')
    if (prods) setProducts(prods)
    
    setIsLoading(false)
  }

  const filteredProducts = products.filter(p => {
    const matchSearch = p.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCollection = filterCollection === 'all' || p.collection_id === filterCollection
    return matchSearch && matchCollection
  })

  const getCollectionName = (id: string) => collections.find(c => c.id === id)?.name || 'Unknown'

  const handleDelete = async (id: string, name: string) => {
    if (isDemoMode) return alert('Demo Mode: Chức năng bị khóa')
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm ${name}?`)) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts(products.filter(p => p.id !== id))
    } else {
      alert('Lỗi: ' + error.message)
    }
  }

  return (
    <AdminLayout title="Quản lý Sản phẩm" subtitle="Thêm, sửa, xóa các mẫu thảm độc lập">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 300 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Tìm mã hoặc tên sản phẩm..." 
                className="admin-input" 
                style={{ paddingLeft: 38, width: '100%' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ position: 'relative', width: 200 }}>
              <Filter size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
              <select 
                className="admin-input" 
                style={{ paddingLeft: 38, width: '100%', appearance: 'none' }}
                value={filterCollection}
                onChange={e => setFilterCollection(e.target.value)}
              >
                <option value="all">Tất cả bộ sưu tập</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={() => alert('Chức năng thêm mới đang được hoàn thiện')}>
            <Plus size={18} /> Thêm sản phẩm
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: 12 }}>
            <ImageIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: 16 }}>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Hình ảnh</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Mã SP</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Tên</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Bộ sưu tập</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, width: 80, textAlign: 'center' }}>Thứ tự</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img src={p.image} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{p.code}</td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{p.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: '#475569' }}>
                        {getCollectionName(p.collection_id)}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={p.sort_order || 0}
                        onChange={async (e) => {
                          const newOrder = parseInt(e.target.value) || 0;
                          setProducts(products.map(prod => prod.id === p.id ? { ...prod, sort_order: newOrder } : prod));
                          if (!isDemoMode) {
                            await supabase.from('products').update({ sort_order: newOrder }).eq('id', p.id);
                          }
                        }}
                        style={{ width: 60, padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" title="Sửa" onClick={() => alert('Sửa: ' + p.code)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: '#ef4444' }} title="Xóa" onClick={() => handleDelete(p.id, p.code)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
