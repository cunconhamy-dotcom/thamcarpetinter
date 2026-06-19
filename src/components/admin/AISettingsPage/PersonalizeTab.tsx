import { Save, Bot, Trash2 } from 'lucide-react'
import { type AIPersonalization } from './types'

const commonInputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }
const commonLabelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }

interface PersonalizeTabProps {
  canEdit: boolean
  personalization: AIPersonalization
  setPersonalization: (p: AIPersonalization) => void
  isSaving: boolean
  handleSavePersonalization: () => void
}

export function PersonalizeTab({ canEdit, personalization, setPersonalization, isSaving, handleSavePersonalization }: PersonalizeTabProps) {
  return (
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
  )
}
