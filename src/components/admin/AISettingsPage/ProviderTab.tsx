import { useState } from 'react'
import { EyeOff, Eye, Save, Check, X } from 'lucide-react'
import { PROVIDERS, getModels, testConnection, type AIProviderConfig } from '@/lib/ai-providers'

const commonInputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }
const commonLabelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }

interface ProviderTabProps {
  canEdit: boolean
  providerConfig: AIProviderConfig
  setProviderConfig: (config: AIProviderConfig) => void
  isSaving: boolean
  handleSaveProvider: () => void
}

export function ProviderTab({ canEdit, providerConfig, setProviderConfig, isSaving, handleSaveProvider }: ProviderTabProps) {
  const [showKey, setShowKey] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean, msg: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    const res = await testConnection(providerConfig)
    setTestResult({ success: res.success, msg: res.message })
    setIsTesting(false)
  }

  return (
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
  )
}
