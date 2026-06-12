import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { saveSiteConfig } from '@/lib/admin-api'
import { PROVIDERS, getModels, maskApiKey, testConnection, type AIProviderConfig } from '@/lib/ai-providers'
import { uploadKnowledgeDocument, fetchKnowledgeDocuments, deleteKnowledgeDocument, type KnowledgeDocument } from '@/lib/knowledge-api'
import { 
  Bot, Settings, Upload, Trash2, Check, X, FileText, 
  MessageSquare, Sliders, Database, EyeOff, Eye, Save
} from 'lucide-react'

// --- Types ---
interface AIPersonalization {
  assistantName: string
  greeting: string
  personaStyle: string
  personality: string
  tone: 'professional' | 'friendly' | 'formal' | 'playful'
  language: 'vi' | 'en' | 'bilingual'
  knowledge: string
  skills: string
  rules: string
  topicRestrictions: string
  closingTemplate: string
  systemPrompt: string
  userPrompt: string
  faqs: { q: string, a: string }[]
}

interface MCPConfig {
  enabled: boolean
  endpoint: string
  apiKey: string
}

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
  const [showKey, setShowKey] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean, msg: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

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
    rules: '',
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

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    const res = await testConnection(providerConfig)
    setTestResult({ success: res.success, msg: res.message })
    setIsTesting(false)
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

  const commonInputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }
  const commonLabelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }

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

          {/* TAB 1: PROVIDER */}
          {activeTab === 'provider' && (
            <div className="admin-card" style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 18, color: '#1e293b' }}>Cấu hình API Nhà cung cấp</h3>
              
              <div style={{ display: 'grid', gap: 20 }}>
                <div>
                  <label style={commonLabelStyle}>Nhà cung cấp (Provider)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    {PROVIDERS.map(prov => (
                      <div 
                        key={prov.id}
                        onClick={() => {
                          if (!canEdit) return
                          setProviderConfig({ ...providerConfig, provider: prov.id, model: prov.defaultModel })
                        }}
                        style={{
                          padding: 16, border: `2px solid ${providerConfig.provider === prov.id ? '#f29d38' : '#e2e8f0'}`,
                          borderRadius: 12, cursor: canEdit ? 'pointer' : 'default', background: providerConfig.provider === prov.id ? '#fffcf8' : '#fff',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{prov.icon}</div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{prov.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{prov.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={commonLabelStyle}>API Key</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showKey ? 'text' : 'password'}
                      value={providerConfig.apiKey}
                      onChange={e => setProviderConfig({ ...providerConfig, apiKey: e.target.value })}
                      style={commonInputStyle}
                      placeholder="Nhập API Key..."
                      disabled={!canEdit}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {providerConfig.provider === 'openrouter' && (
                  <div>
                    <label style={commonLabelStyle}>Custom Endpoint (Tùy chọn)</label>
                    <input 
                      type="text"
                      value={providerConfig.customEndpoint || ''}
                      onChange={e => setProviderConfig({ ...providerConfig, customEndpoint: e.target.value })}
                      style={commonInputStyle}
                      placeholder="https://openrouter.ai/api/v1"
                      disabled={!canEdit}
                    />
                  </div>
                )}

                <div>
                  <label style={commonLabelStyle}>Mô hình (Model)</label>
                  {providerConfig.provider === 'openrouter' ? (
                     <input 
                       type="text"
                       value={providerConfig.model}
                       onChange={e => setProviderConfig({ ...providerConfig, model: e.target.value })}
                       style={commonInputStyle}
                       placeholder="Nhập tên model OpenRouter (vd: google/gemini-2.5-flash)"
                       disabled={!canEdit}
                     />
                  ) : (
                    <select 
                      value={providerConfig.model}
                      onChange={e => setProviderConfig({ ...providerConfig, model: e.target.value })}
                      style={commonInputStyle}
                      disabled={!canEdit}
                    >
                      {getModels(providerConfig.provider).map(m => (
                        <option key={m.id} value={m.id}>{m.name} — {m.description}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10 }}>
                  <button className="admin-btn" style={{ background: '#f1f5f9' }} onClick={handleTestConnection} disabled={!providerConfig.apiKey || isTesting}>
                    {isTesting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
                  </button>
                  <button className="admin-btn admin-btn-primary" onClick={handleSaveProvider} disabled={isSaving || !canEdit}>
                    <Save size={16} /> Lưu cấu hình
                  </button>
                  {testResult && (
                    <span style={{ fontSize: 14, fontWeight: 500, color: testResult.success ? '#22c55e' : '#ef4444' }}>
                      {testResult.success ? <Check size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> : <X size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} />}
                      {' '}{testResult.msg}
                    </span>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: PERSONALIZE */}
          {activeTab === 'personalize' && (
            <div className="admin-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: '#1e293b' }}>Cá nhân hóa Trợ lý AI</h3>
                <button className="admin-btn admin-btn-primary" onClick={handleSavePersonalization} disabled={isSaving || !canEdit}>
                  <Save size={16} /> Lưu thay đổi
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Left Col - Forms */}
                <div style={{ display: 'grid', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={commonLabelStyle}>Tên Trợ lý</label>
                      <input type="text" value={personalization.assistantName} onChange={e => setPersonalization({...personalization, assistantName: e.target.value})} style={commonInputStyle} disabled={!canEdit} />
                    </div>
                    <div>
                      <label style={commonLabelStyle}>Ngôn ngữ ưu tiên</label>
                      <select value={personalization.language} onChange={e => setPersonalization({...personalization, language: e.target.value as any})} style={commonInputStyle} disabled={!canEdit}>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                        <option value="bilingual">Song ngữ (Tự động)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={commonLabelStyle}>Câu chào mở đầu (Greeting)</label>
                    <input type="text" value={personalization.greeting} onChange={e => setPersonalization({...personalization, greeting: e.target.value})} style={commonInputStyle} disabled={!canEdit} />
                  </div>

                  <div>
                    <label style={commonLabelStyle}>Tone giọng (Tone of voice)</label>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {[
                        { id: 'professional', label: 'Chuyên nghiệp' },
                        { id: 'friendly', label: 'Thân thiện' },
                        { id: 'formal', label: 'Trang trọng' },
                        { id: 'playful', label: 'Vui vẻ' },
                      ].map(t => (
                        <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input type="radio" name="tone" checked={personalization.tone === t.id} onChange={() => setPersonalization({...personalization, tone: t.id as any})} disabled={!canEdit} />
                          {t.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={commonLabelStyle}>Tính cách & Phong cách (Personality)</label>
                    <textarea value={personalization.personality} onChange={e => setPersonalization({...personalization, personality: e.target.value})} style={{ ...commonInputStyle, minHeight: 60 }} disabled={!canEdit} />
                  </div>

                  <div>
                    <label style={commonLabelStyle}>Giới hạn chủ đề (Những gì AI KHÔNG ĐƯỢC trả lời)</label>
                    <textarea value={personalization.topicRestrictions} onChange={e => setPersonalization({...personalization, topicRestrictions: e.target.value})} style={{ ...commonInputStyle, minHeight: 60 }} placeholder="VD: Không tư vấn về chính trị, không tư vấn sản phẩm của đối thủ..." disabled={!canEdit} />
                  </div>

                  <div>
                    <label style={commonLabelStyle}>Kịch bản hỏi đáp thường gặp (FAQ Templates)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {personalization.faqs?.map((faq, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <input type="text" value={faq.q} placeholder="Câu hỏi" onChange={e => {
                              const newFaqs = [...personalization.faqs]
                              newFaqs[i].q = e.target.value
                              setPersonalization({...personalization, faqs: newFaqs})
                            }} style={commonInputStyle} disabled={!canEdit} />
                            <input type="text" value={faq.a} placeholder="Câu trả lời mẫu" onChange={e => {
                              const newFaqs = [...personalization.faqs]
                              newFaqs[i].a = e.target.value
                              setPersonalization({...personalization, faqs: newFaqs})
                            }} style={commonInputStyle} disabled={!canEdit} />
                          </div>
                          {canEdit && (
                            <button className="admin-btn" style={{ background: '#fee2e2', color: '#ef4444', height: 'fit-content' }} onClick={() => {
                              setPersonalization({...personalization, faqs: personalization.faqs.filter((_, idx) => idx !== i)})
                            }}><Trash2 size={16} /></button>
                          )}
                        </div>
                      ))}
                      {canEdit && (
                        <button className="admin-btn" style={{ alignSelf: 'flex-start', background: '#f1f5f9' }} onClick={() => {
                          setPersonalization({...personalization, faqs: [...(personalization.faqs || []), { q: '', a: '' }]})
                        }}>+ Thêm FAQ</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Col - Preview */}
                <div>
                  <div style={{ background: '#111', borderRadius: 16, overflow: 'hidden', color: '#fff' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f29d38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={20} color="white" />
                      </div>
                      <div style={{ fontWeight: 600 }}>{personalization.assistantName || 'Assistant'}</div>
                    </div>
                    <div style={{ padding: 16, minHeight: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f29d38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                          <Bot size={16} color="white" />
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '0 12px 12px 12px', fontSize: 14 }}>
                          {personalization.greeting || 'Xin chào!'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
                        <div style={{ background: '#f29d38', color: 'white', padding: '10px 14px', borderRadius: '12px 12px 0 12px', fontSize: 14 }}>
                          Giá thảm trải sàn văn phòng là bao nhiêu?
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KNOWLEDGE (RAG) */}
          {activeTab === 'knowledge' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div className="admin-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#1e293b' }}>Kiến thức bổ sung (Thủ công)</h3>
                  <button className="admin-btn admin-btn-primary" onClick={handleSaveKnowledge} disabled={isSaving || !canEdit}>
                    <Save size={16} /> Lưu kiến thức
                  </button>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Nhập các thông tin quan trọng như bảng giá, chính sách bảo hành, thông tin công ty để AI học hỏi trực tiếp.</p>
                <textarea 
                  value={manualKnowledge} 
                  onChange={e => setManualKnowledge(e.target.value)} 
                  style={{ ...commonInputStyle, minHeight: 150, fontFamily: 'monospace' }} 
                  placeholder="Ví dụ: Thảm Ecosoft có giá từ 500k/m2..."
                  disabled={!canEdit}
                />
              </div>

              <div className="admin-card" style={{ padding: 24 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#1e293b' }}>Tài liệu Kho tri thức (RAG)</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Tải lên các file PDF, TXT để AI có thể tra cứu khi trả lời khách hàng.</p>
                
                {canEdit && (
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed #cbd5e1', borderRadius: 12, padding: 32, cursor: 'pointer',
                    background: '#f8fafc', transition: 'border 0.2s', marginBottom: 24
                  }}>
                    <Upload size={32} color="#94a3b8" style={{ marginBottom: 12 }} />
                    <span style={{ fontSize: 15, fontWeight: 500, color: '#475569' }}>Kéo thả hoặc click để chọn file</span>
                    <span style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Hỗ trợ PDF, TXT (Tối đa 10MB)</span>
                    <input type="file" accept=".pdf,.txt" style={{ display: 'none' }} onChange={handleFileUpload} disabled={isUploading} />
                    {isUploading && <span style={{ marginTop: 12, color: '#f29d38', fontSize: 13 }}>Đang xử lý tải lên...</span>}
                  </label>
                )}

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Tên tài liệu</th>
                        <th>Kích thước</th>
                        <th>Ngày tải lên</th>
                        <th>Trạng thái</th>
                        {canEdit && <th style={{ textAlign: 'right' }}>Thao tác</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {documents.length > 0 ? documents.map(doc => (
                        <tr key={doc.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <FileText size={18} color="#f29d38" />
                              <span style={{ fontWeight: 500, color: '#1e293b' }}>{doc.title}</span>
                            </div>
                          </td>
                          <td style={{ color: '#64748b' }}>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</td>
                          <td style={{ color: '#64748b' }}>{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <span style={{
                              display: 'inline-flex', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                              background: doc.status === 'ready' ? '#dcfce7' : doc.status === 'error' ? '#fee2e2' : '#fef3c7',
                              color: doc.status === 'ready' ? '#166534' : doc.status === 'error' ? '#991b1b' : '#92400e'
                            }}>
                              {doc.status === 'ready' ? 'Sẵn sàng' : doc.status === 'error' ? 'Lỗi' : 'Đang xử lý'}
                            </span>
                          </td>
                          {canEdit && (
                            <td>
                              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="admin-btn" style={{ color: '#ef4444' }} onClick={() => handleDeleteDoc(doc)}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      )) : (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>Chưa có tài liệu nào trong kho tri thức</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, color: '#1e293b' }}>NotebookLM / MCP</h3>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Tích hợp Model Context Protocol để kết nối với kho tri thức nâng cao.</p>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{mcpConfig.enabled ? 'Đang bật' : 'Đang tắt'}</span>
                    <input 
                      type="checkbox" 
                      checked={mcpConfig.enabled} 
                      onChange={e => setMcpConfig({...mcpConfig, enabled: e.target.checked})} 
                      style={{ width: 18, height: 18, accentColor: '#f29d38' }}
                      disabled={!canEdit}
                    />
                  </label>
                </div>

                {mcpConfig.enabled && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16 }}>
                    <div>
                      <label style={commonLabelStyle}>MCP Endpoint URL</label>
                      <input type="text" value={mcpConfig.endpoint} onChange={e => setMcpConfig({...mcpConfig, endpoint: e.target.value})} style={commonInputStyle} placeholder="https://..." disabled={!canEdit} />
                    </div>
                    <div>
                      <label style={commonLabelStyle}>MCP API Key / Token</label>
                      <input type="password" value={mcpConfig.apiKey} onChange={e => setMcpConfig({...mcpConfig, apiKey: e.target.value})} style={commonInputStyle} disabled={!canEdit} />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}
    </AdminLayout>
  )
}
