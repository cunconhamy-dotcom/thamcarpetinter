import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Mail, Clock, CheckCircle2, AlertCircle, Send, Plus, X } from 'lucide-react'

interface EmailCampaign {
  id: string
  title: string
  subject: string
  target_audience: string
  status: string
  sent_count: number
  scheduled_for: string | null
  created_at: string
}

export function EmailManager() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ title: '', subject: '', body: '', target: 'all' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCampaigns(data as EmailCampaign[])
    }
    setIsLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // In a real app, this would trigger an Edge Function to actually send emails.
    // For now, we simulate saving the campaign.
    await supabase.from('email_campaigns').insert({
      title: formData.title,
      subject: formData.subject,
      body_html: formData.body,
      target_audience: formData.target,
      status: 'scheduled',
      scheduled_for: new Date(Date.now() + 60000).toISOString() // schedule 1 min later
    })

    setIsSubmitting(false)
    setIsModalOpen(false)
    fetchCampaigns()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <span style={{ padding: '4px 10px', background: '#f1f5f9', color: '#475569', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>Bản nháp</span>
      case 'scheduled': return <span style={{ padding: '4px 10px', background: '#fef3c7', color: '#d97706', borderRadius: 999, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> Đã lên lịch</span>
      case 'sent': return <span style={{ padding: '4px 10px', background: '#dcfce3', color: '#166534', borderRadius: 999, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={12} /> Đã gửi</span>
      case 'failed': return <span style={{ padding: '4px 10px', background: '#fee2e2', color: '#b91c1c', borderRadius: 999, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} /> Lỗi</span>
      default: return null
    }
  }

  return (
    <AdminLayout title="Email Marketing" breadcrumb={['Quản trị', 'CRM', 'Email']}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p style={{ color: '#64748b', margin: 0 }}>Quản lý các chiến dịch gửi Email chăm sóc khách hàng tự động.</p>
        <button 
          className="admin-btn admin-btn-primary" 
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Tạo chiến dịch mới
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f0f0f5', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Đang tải chiến dịch...</div>
        ) : campaigns.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Mail size={24} color="#94a3b8" />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 16, color: '#1e293b' }}>Chưa có chiến dịch Email nào</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Tạo chiến dịch mới để gửi thông báo, báo giá hoặc giới thiệu sản phẩm đến khách hàng.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Chiến dịch</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Trạng thái</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Tập khách hàng</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Đã gửi</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(camp => (
                <tr key={camp.id} style={{ borderBottom: '1px solid #f0f0f5' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{camp.title}</div>
                    <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Chủ đề: {camp.subject}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>{getStatusBadge(camp.status)}</td>
                  <td style={{ padding: '16px 24px', color: '#475569' }}>
                    {camp.target_audience === 'all' ? 'Tất cả Leads' : 
                     camp.target_audience === 'new' ? 'Leads mới đăng ký' : 'Leads tiềm năng'}
                  </td>
                  <td style={{ padding: '16px 24px', color: '#475569', fontWeight: 600 }}>{camp.sent_count}</td>
                  <td style={{ padding: '16px 24px', color: '#94a3b8', fontSize: 13 }}>
                    {new Date(camp.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => !isSubmitting && setIsModalOpen(false)} />
          <div style={{ position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 600, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 20, color: '#1e293b' }}>Soạn Email Mới</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
            </div>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Tên chiến dịch (Nội bộ)</label>
                <input required className="admin-input" placeholder="VD: Giới thiệu BST EcoSoft tháng 6" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Gửi đến đối tượng</label>
                <select className="admin-input" value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <option value="all">Tất cả Khách hàng (Leads)</option>
                  <option value="new">Chỉ Khách hàng Mới (Chưa liên hệ)</option>
                  <option value="qualified">Khách hàng Tiềm năng (Qualified)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Chủ đề Email (Subject)</label>
                <input required className="admin-input" placeholder="Carpets Inter xin giới thiệu..." value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Nội dung Email</label>
                <textarea required rows={6} className="admin-input" placeholder="Soạn nội dung..." value={formData.body} onChange={e => setFormData({ ...formData, body: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }} />
              </div>
              <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0', fontSize: 13, color: '#166534', marginTop: 8 }}>
                <strong>💡 Mẹo:</strong> Hệ thống hiện đang chạy ở chế độ giả lập. Trong môi trường thực tế, sau khi nhấn nút, một hệ thống nền (như Resend hoặc SendGrid) sẽ tự động gửi email đến khách hàng.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button type="button" className="admin-btn" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
                  <Send size={16} /> {isSubmitting ? 'Đang lên lịch...' : 'Lên lịch gửi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
