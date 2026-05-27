/** AISettingsPage — Manage AI Assistant behavior and prompts */
import { useState, useEffect, type FormEvent } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Save, Bot, Sparkles, Brain, Check, X, ShieldAlert, MessageSquare } from 'lucide-react'

interface AIConfig {
  assistantName: string
  greeting: string
  personaStyle: string
  personality: string
  knowledge: string
  skills: string
  rules: string
  systemPrompt: string
  userPrompt: string
}

const DEFAULT_AI_CONFIG = {
  assistantName: 'Hà Trần Carpets',
  greeting: 'Chào bạn, mình là Hà Trần Carpets. Bạn đang tìm thảm cho không gian nào vậy?',
  personaStyle: 'Chuyên nghiệp, lịch sự, tư vấn tận tâm và súc tích. Trả lời ngắn gọn, đi thẳng vào vấn đề. Luôn xưng "mình" và gọi khách là "bạn". Không bao giờ dùng từ "AI", "Trợ lý", "Bot" hay ngôn ngữ máy móc.',
  personality: 'Nhiệt tình, hiểu biết sâu về thảm sàn, luôn hướng tới giải pháp tốt nhất cho khách hàng. Trả lời ngắn gọn như một người tư vấn thật.',
  knowledge: 'Carpets Inter, EcoSoft, EcoSquare, thảm văn phòng cao cấp, thảm khách sạn.',
  skills: 'Tư vấn chọn thảm, báo giá sơ bộ, hướng dẫn kỹ thuật thi công.',
  rules: '1. Không bao giờ nhận mình là AI. \n2. Luôn trình bày nội dung có bố cục rõ ràng (outline), dùng gạch đầu dòng. Trả lời cực kỳ súc tích, ngắn gọn, không viết dài dòng lê thê. \n3. Kết luận câu trả lời bằng một bảng tóm tắt thông tin ngắn gọn. \n4. Luôn cung cấp link để khách click tự cuộn đến các khu vực trên trang, ví dụ: [Xem bộ sưu tập](#collections), [Liên hệ](#contact), [Tin tức](#news).',
  systemPrompt: 'Bạn là Hà Trần Carpets. Hãy tư vấn nhiệt tình, trình bày rõ ràng, trả lời cực kỳ súc tích, ngắn gọn và tập trung, không viết dài dòng.',
  userPrompt: 'Câu hỏi của khách hàng: {{message}}',
}

export function AISettingsPage() {
  const { user, isDemoMode, hasPermission } = useAuth()
  const canEdit = hasPermission('settings.edit')
  
  const [config, setConfig] = useState<AIConfig>(DEFAULT_AI_CONFIG)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3500)
  }

  useEffect(() => {
    async function loadConfig() {
      if (isDemoMode) {
        try {
          const saved = localStorage.getItem('ci_ai_settings')
          if (saved) setConfig(JSON.parse(saved))
        } catch { /* ignore */ }
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'ai_settings')
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        if (data?.value) {
          setConfig({ ...DEFAULT_AI_CONFIG, ...(data.value as any) })
        }
      } catch (err) {
        console.error('Error loading AI config:', err)
      }
      setIsLoading(false)
    }
    loadConfig()
  }, [isDemoMode])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    if (isDemoMode) {
      localStorage.setItem('ci_ai_settings', JSON.stringify(config))
      showNotification('success', 'Đã lưu cấu hình AI (Demo Mode)')
      setIsSaving(false)
      return
    }

    try {
      const { error } = await supabase.from('site_config').upsert(
        { key: 'ai_settings', value: config, updated_by: user?.id },
        { onConflict: 'key' }
      )
      if (error) throw error
      showNotification('success', 'Đã lưu cấu hình trợ lý AI!')
    } catch (err) {
      console.error('Save AI error:', err)
      showNotification('error', 'Lỗi khi lưu cấu hình')
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <AdminLayout title="Quản trị Trợ lý AI" breadcrumb={['Quản trị', 'Hệ thống', 'Trợ lý AI']}>
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>Đang tải cấu hình...</div>
      </AdminLayout>
    )
  }

  const cardStyle = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5', marginBottom: 24 }
  const sectionTitleStyle = { margin: '0 0 20px 0', fontSize: 16, fontWeight: 600 as const, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 10 }

  return (
    <AdminLayout title="Cấu hình Trợ lý AI" breadcrumb={['Quản trị', 'Hệ thống', 'Trợ lý AI']}>
      {notification && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: 'white', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          borderLeft: `4px solid ${notification.type === 'success' ? '#22c55e' : '#ef4444'}`,
          display: 'flex', alignItems: 'center', gap: 12,
          animation: 'admin-fadeIn 0.3s ease', maxWidth: 400,
        }}>
          {notification.type === 'success' ? <Check size={18} style={{ color: '#22c55e' }} /> : <X size={18} style={{ color: '#ef4444' }} />}
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{notification.message}</div>
        </div>
      )}

      <form onSubmit={handleSave} style={{ maxWidth: 900 }}>
        <div className="admin-action-bar" style={{ justifyContent: 'flex-end', marginBottom: 24 }}>
          {canEdit && (
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isSaving}>
              <Save size={16} />
              {isSaving ? 'Đang lưu...' : 'Lưu cấu hình AI'}
            </button>
          )}
        </div>

        {/* Thông tin cơ bản */}
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}><Bot size={20} color="#3b82f6" /> Thông tin cơ bản</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            <div className="admin-input-group">
              <label className="admin-input-label">Tên trợ lý</label>
              <input className="admin-input" value={config.assistantName} disabled={!canEdit}
                onChange={e => setConfig({ ...config, assistantName: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label className="admin-input-label">Lời chào mặc định</label>
              <textarea className="admin-input" rows={2} value={config.greeting} disabled={!canEdit}
                onChange={e => setConfig({ ...config, greeting: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Persona & Knowledge */}
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}><Brain size={20} color="#8b5cf6" /> Định hình Persona & Kiến thức</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
            <div className="admin-input-group">
              <label className="admin-input-label">Phong cách (Persona Style)</label>
              <textarea className="admin-input" rows={2} value={config.personaStyle} disabled={!canEdit}
                placeholder="VD: Trịnh trọng, thân thiện, chuyên gia..."
                onChange={e => setConfig({ ...config, personaStyle: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label className="admin-input-label">Tính cách (Personality)</label>
              <textarea className="admin-input" rows={2} value={config.personality} disabled={!canEdit}
                placeholder="Mô tả tính cách của AI..."
                onChange={e => setConfig({ ...config, personality: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label className="admin-input-label">Phạm vi Kiến thức (Knowledge Base)</label>
              <textarea className="admin-input" rows={3} value={config.knowledge} disabled={!canEdit}
                placeholder="Nhập các kiến thức mà AI cần biết..."
                onChange={e => setConfig({ ...config, knowledge: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label className="admin-input-label">Kỹ năng (Skills)</label>
              <textarea className="admin-input" rows={3} value={config.skills} disabled={!canEdit}
                placeholder="AI có thể làm gì? (Tư vấn, báo giá, so sánh...)"
                onChange={e => setConfig({ ...config, skills: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Rules & Prompts */}
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}><ShieldAlert size={20} color="#ef4444" /> Quy định & Prompts Hệ thống</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
            <div className="admin-input-group">
              <label className="admin-input-label">Quy định bắt buộc (RULES)</label>
              <textarea className="admin-input" rows={3} value={config.rules} disabled={!canEdit}
                placeholder="Các quy tắc AI không được vi phạm..."
                onChange={e => setConfig({ ...config, rules: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label className="admin-input-label">System Prompt (Chỉ dẫn hệ thống cốt lõi)</label>
              <textarea className="admin-input" rows={4} value={config.systemPrompt} disabled={!canEdit}
                style={{ fontFamily: 'monospace', fontSize: 13, background: '#f8fafc' }}
                onChange={e => setConfig({ ...config, systemPrompt: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label className="admin-input-label">User Prompt Template</label>
              <textarea className="admin-input" rows={2} value={config.userPrompt} disabled={!canEdit}
                style={{ fontFamily: 'monospace', fontSize: 13, background: '#f8fafc' }}
                onChange={e => setConfig({ ...config, userPrompt: e.target.value })} />
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Sử dụng {'{{message}}'} để đại diện cho tin nhắn của khách hàng.</div>
            </div>
          </div>
        </div>

        {!canEdit && (
          <div style={{ background: '#fef9e7', borderRadius: 12, padding: 16, border: '1px solid #fde68a', fontSize: 14, color: '#92400e' }}>
            ⚠️ Bạn không có quyền chỉnh sửa cấu hình AI. Liên hệ quản trị viên để được cấp quyền.
          </div>
        )}
      </form>
    </AdminLayout>
  )
}
