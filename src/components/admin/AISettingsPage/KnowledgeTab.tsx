import { Save, Upload, FileText, Trash2 } from 'lucide-react'
import { type KnowledgeDocument } from '@/lib/knowledge-api'
import { type MCPConfig } from './types'

const commonInputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }
const commonLabelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }

interface KnowledgeTabProps {
  canEdit: boolean
  manualKnowledge: string
  setManualKnowledge: (v: string) => void
  mcpConfig: MCPConfig
  setMcpConfig: (v: MCPConfig) => void
  isSaving: boolean
  handleSaveKnowledge: () => void
  documents: KnowledgeDocument[]
  isUploading: boolean
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDeleteDoc: (doc: KnowledgeDocument) => void
}

export function KnowledgeTab({
  canEdit, manualKnowledge, setManualKnowledge, mcpConfig, setMcpConfig,
  isSaving, handleSaveKnowledge, documents, isUploading, handleFileUpload, handleDeleteDoc
}: KnowledgeTabProps) {
  return (
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
  )
}
