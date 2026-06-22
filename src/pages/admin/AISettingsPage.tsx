import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { saveSiteConfig } from '@/lib/admin-api'
import { type AIProviderConfig } from '@/lib/ai-providers'
import { uploadKnowledgeDocument, fetchKnowledgeDocuments, deleteKnowledgeDocument, type KnowledgeDocument } from '@/lib/knowledge-api'
import { Settings, Sliders, Database, Check, X } from 'lucide-react'

import { type AIPersonalization, type MCPConfig } from '@/components/admin/AISettingsPage/types'
import { ProviderTab } from '@/components/admin/AISettingsPage/ProviderTab'
import { PersonalizeTab } from '@/components/admin/AISettingsPage/PersonalizeTab'
import { KnowledgeTab } from '@/components/admin/AISettingsPage/KnowledgeTab'

export function AISettingsPage() {
  const { isDemoMode, hasPermission } = useAuth()
  const canEdit = hasPermission('ai.settings')
  
  const [activeTab, setActiveTab] = useState<'provider' | 'personalize' | 'knowledge'>('provider')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // -- State for Tab 1: Provider --
  const [providerConfig, setProviderConfig] = useState<AIProviderConfig>({
    provider: 'gemini', apiKey: '', model: 'gemini-2.5-flash', customEndpoint: ''
  })

  // -- State for Tab 2: Personalization --
  const [personalization, setPersonalization] = useState<AIPersonalization>({
    assistantName: 'Hà Trần Carpets',
    greeting: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
    personaStyle: 'Chuyên gia tư vấn',
    personality: 'Lịch sự, chuyên nghiệp',
    tone: 'professional',
    language: 'vi',
    knowledge: '',
    skills: '',
    rules: '1. Không bao giờ nhận mình là AI. \n2. Luôn trình bày nội dung có bố cục rõ ràng (outline), dùng gạch đầu dòng. Trả lời cực kỳ súc tích, ngắn gọn, không viết dài dòng lê thê. \n3. Kết luận câu trả lời bằng một bảng tóm tắt thông tin ngắn gọn. \n4. Luôn cung cấp các link trích dẫn theo ĐÚNG CHUẨN MARKDOWN để khách click cuộn đến khu vực liên quan. KHÔNG BAO GIỜ viết link dưới dạng text trần. \nCác ID bắt buộc phải dùng: [Tài liệu & Chứng nhận](#tai-lieu), [Tin tức chuyên ngành](#news), [Liên hệ tư vấn chi tiết](#lien-he-nhanh). \nĐối với các bộ sưu tập cụ thể, bắt buộc thêm tham số tìm kiếm vào link. LƯU Ý QUAN TRỌNG: KHÔNG ĐƯỢC để khoảng trắng trong phần link URL, phải thay khoảng trắng bằng dấu cộng (+). Ví dụ: [Xem bộ sưu tập thảm văn phòng](#collections?q=văn+phòng), [Xem thảm khách sạn](#collections?q=khách+sạn). \nTuyệt đối dùng ngoặc vuông cho văn bản và ngoặc đơn cho URL (ví dụ: [Liên hệ tư vấn](#lien-he-nhanh)).',
    topicRestrictions: '',
    closingTemplate: '',
    systemPrompt: '',
    userPrompt: '',
    faqs: []
  })

  // -- State for Tab 3: Knowledge --
  const [manualKnowledge, setManualKnowledge] = useState('')
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [mcpConfig, setMcpConfig] = useState<MCPConfig>({ enabled: false, endpoint: '', apiKey: '' })
  const [isUploading, setIsUploading] = useState(false)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // -- Fetch Data --
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        if (isDemoMode) {
          const storedProv = localStorage.getItem('ci_ai_provider')
          if (storedProv) setProviderConfig(JSON.parse(storedProv))
          
          const storedPers = localStorage.getItem('ci_ai_settings')
          if (storedPers) setPersonalization({ ...personalization, ...JSON.parse(storedPers) })
          
          const storedKn = localStorage.getItem('ci_ai_knowledge')
          if (storedKn) setManualKnowledge(storedKn)

          const storedMcp = localStorage.getItem('ci_ai_mcp')
          if (storedMcp) setMcpConfig(JSON.parse(storedMcp))
        } else {
          // Fetch site config
          const { data } = await supabase.from('site_config').select('*').in('key', ['ai_provider', 'ai_settings', 'ai_knowledge', 'ai_mcp'])
          if (data) {
            data.forEach(row => {
              if (row.key === 'ai_provider') setProviderConfig({ ...providerConfig, ...row.value })
              if (row.key === 'ai_settings') setPersonalization({ ...personalization, ...row.value })
              if (row.key === 'ai_knowledge') setManualKnowledge(row.value.text || '')
              if (row.key === 'ai_mcp') setMcpConfig({ ...mcpConfig, ...row.value })
            })
          }
        }
        // Always fetch docs from knowledge-api (handles demo inside)
        const docs = await fetchKnowledgeDocuments()
        setDocuments(docs)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [isDemoMode])

  // -- Handlers --
  const handleSaveProvider = async () => {
    setIsSaving(true)
    if (isDemoMode) {
      localStorage.setItem('ci_ai_provider', JSON.stringify(providerConfig))
    } else {
      await saveSiteConfig('ai_provider', providerConfig as any)
    }
    setIsSaving(false)
    showNotification('success', 'Đã lưu cấu hình nhà cung cấp')
  }

  const handleSavePersonalization = async () => {
    setIsSaving(true)
    if (isDemoMode) {
      localStorage.setItem('ci_ai_settings', JSON.stringify(personalization))
    } else {
      await saveSiteConfig('ai_settings', personalization as any)
    }
    setIsSaving(false)
    showNotification('success', 'Đã lưu cấu hình cá nhân hóa')
  }

  const handleSaveKnowledge = async () => {
    setIsSaving(true)
    if (isDemoMode) {
      localStorage.setItem('ci_ai_knowledge', manualKnowledge)
      localStorage.setItem('ci_ai_mcp', JSON.stringify(mcpConfig))
    } else {
      await saveSiteConfig('ai_knowledge', { text: manualKnowledge })
      await saveSiteConfig('ai_mcp', mcpConfig as any)
    }
    setIsSaving(false)
    showNotification('success', 'Đã lưu cấu hình kho tri thức')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const { data, error } = await uploadKnowledgeDocument(file)
    if (error) showNotification('error', `Lỗi tải lên: ${error}`)
    if (data) {
      setDocuments([data, ...documents])
      showNotification('success', 'Tải lên tài liệu thành công')
    }
    setIsUploading(false)
  }

  const handleDeleteDoc = async (doc: KnowledgeDocument) => {
    if (!confirm(`Xóa tài liệu ${doc.fileName}?`)) return
    const { error } = await deleteKnowledgeDocument(doc.id, doc.filePath)
    if (error) {
      showNotification('error', `Lỗi xóa: ${error}`)
    } else {
      setDocuments(documents.filter(d => d.id !== doc.id))
      showNotification('success', 'Đã xóa tài liệu')
    }
  }

  return (
    <AdminLayout title="Trợ lý AI" breadcrumb={['Quản trị', 'Hệ thống', 'Trợ lý AI']}>
      {notification && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 100,
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

      {isLoading ? (
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>Đang tải...</div>
      ) : (
        <div style={{ maxWidth: 1000 }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
            {[
              { id: 'provider', label: 'Nhà cung cấp', icon: Settings },
              { id: 'personalize', label: 'Cá nhân hóa', icon: Sliders },
              { id: 'knowledge', label: 'Kho tri thức (RAG)', icon: Database },
            ].map(tab => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                    background: isActive ? '#fff' : 'transparent',
                    border: `1px solid ${isActive ? '#e2e8f0' : 'transparent'}`,
                    borderBottom: isActive ? '1px solid #fff' : '1px solid transparent',
                    borderRadius: '8px 8px 0 0',
                    color: isActive ? '#f29d38' : '#64748b',
                    fontWeight: isActive ? 600 : 500,
                    marginBottom: -17, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              )
            })}
          </div>

          {activeTab === 'provider' && (
            <ProviderTab 
              canEdit={canEdit}
              providerConfig={providerConfig}
              setProviderConfig={setProviderConfig}
              isSaving={isSaving}
              handleSaveProvider={handleSaveProvider}
            />
          )}

          {activeTab === 'personalize' && (
            <PersonalizeTab 
              canEdit={canEdit}
              personalization={personalization}
              setPersonalization={setPersonalization}
              isSaving={isSaving}
              handleSavePersonalization={handleSavePersonalization}
            />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeTab 
              canEdit={canEdit}
              manualKnowledge={manualKnowledge}
              setManualKnowledge={setManualKnowledge}
              mcpConfig={mcpConfig}
              setMcpConfig={setMcpConfig}
              isSaving={isSaving}
              handleSaveKnowledge={handleSaveKnowledge}
              documents={documents}
              isUploading={isUploading}
              handleFileUpload={handleFileUpload}
              handleDeleteDoc={handleDeleteDoc}
            />
          )}

        </div>
      )}
    </AdminLayout>
  )
}
