import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { analyzeAndUpdateLead } from '@/lib/ai-processor'
import { Users, Mail, Phone, Calendar, Tag, BrainCircuit, Wand2 } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  project_type: string
  budget: string
  message: string
  ai_tags: string[]
  ai_intent: string
  status: string
  created_at: string
}

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [analyzingId, setAnalyzingId] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setLeads(data as Lead[])
    }
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return { bg: '#dbeafe', color: '#1e40af', label: 'Mới' }
      case 'contacted': return { bg: '#fef3c7', color: '#d97706', label: 'Đã liên hệ' }
      case 'qualified': return { bg: '#dcfce3', color: '#166534', label: 'Tiềm năng' }
      case 'lost': return { bg: '#f3f4f6', color: '#4b5563', label: 'Từ chối' }
      case 'won': return { bg: '#bbf7d0', color: '#15803d', label: 'Thành công' }
      default: return { bg: '#f3f4f6', color: '#4b5563', label: status }
    }
  }

  const handleAnalyze = async (lead: Lead) => {
    setAnalyzingId(lead.id)
    await analyzeAndUpdateLead(lead.id, lead.message || '', lead.project_type || '', lead.company || '')
    await fetchLeads()
    setAnalyzingId(null)
  }

  return (
    <AdminLayout title="Khách hàng tiềm năng (Leads)" breadcrumb={['Quản trị', 'CRM', 'Khách hàng']}>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1, background: 'white', padding: 24, borderRadius: 16, border: '1px solid #f0f0f5' }}>
          <div style={{ color: '#64748b', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Tổng số Leads</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>{leads.length}</div>
        </div>
        <div style={{ flex: 1, background: 'white', padding: 24, borderRadius: 16, border: '1px solid #f0f0f5' }}>
          <div style={{ color: '#64748b', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Chưa liên hệ</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#ef4444' }}>{leads.filter(l => l.status === 'new').length}</div>
        </div>
        <div style={{ flex: 1, background: 'white', padding: 24, borderRadius: 16, border: '1px solid #f0f0f5' }}>
          <div style={{ color: '#64748b', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Chốt thành công</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>{leads.filter(l => l.status === 'won').length}</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f0f0f5', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f5', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Danh sách đăng ký tư vấn</h3>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Đang tải dữ liệu...</div>
        ) : leads.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Chưa có khách hàng nào đăng ký.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Khách hàng</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Liên hệ</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Dự án</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>AI Phân tích</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const status = getStatusColor(lead.status)
                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #f0f0f5' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Users size={16} color="#94a3b8" /> {lead.name}
                        </div>
                        {lead.company && <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{lead.company}</div>}
                        <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={12} /> {new Date(lead.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {lead.email && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', marginBottom: 4 }}><Mail size={14} /> {lead.email}</div>}
                        {lead.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}><Phone size={14} /> {lead.phone}</div>}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ color: '#334155' }}>Loại: {lead.project_type || 'N/A'}</div>
                        <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Ngân sách: {lead.budget || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                          {lead.ai_tags && lead.ai_tags.length > 0 ? lead.ai_tags.map((tag, i) => (
                            <span key={i} style={{ padding: '2px 8px', background: '#f3e8ff', color: '#7e22ce', borderRadius: 999, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Tag size={10} /> {tag}
                            </span>
                          )) : <span style={{ color: '#94a3b8', fontSize: 12 }}>Chưa có tag</span>}
                        </div>
                        {lead.ai_intent ? (
                          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', background: '#f8fafc', padding: 8, borderRadius: 8, fontSize: 12, color: '#475569' }}>
                            <BrainCircuit size={14} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: 2 }} />
                            <div>{lead.ai_intent}</div>
                          </div>
                        ) : (
                          <button 
                            className="admin-btn admin-btn-ghost admin-btn-sm" 
                            onClick={() => handleAnalyze(lead)}
                            disabled={analyzingId === lead.id}
                            style={{ color: '#8b5cf6', fontSize: 12, padding: '4px 8px' }}
                          >
                            <Wand2 size={12} style={{ marginRight: 4 }} />
                            {analyzingId === lead.id ? 'Đang phân tích...' : 'Dùng AI Phân tích'}
                          </button>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <select
                          value={lead.status}
                          onChange={async (e) => {
                            await supabase.from('leads').update({ status: e.target.value }).eq('id', lead.id)
                            fetchLeads()
                          }}
                          style={{
                            background: status.bg, color: status.color, border: 'none',
                            padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                            outline: 'none', cursor: 'pointer', appearance: 'none'
                          }}
                        >
                          <option value="new">Mới</option>
                          <option value="contacted">Đã liên hệ</option>
                          <option value="qualified">Tiềm năng</option>
                          <option value="lost">Từ chối</option>
                          <option value="won">Thành công</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
