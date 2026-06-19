import { supabase } from './supabase'

interface AILeadAnalysis {
  tags: string[]
  intent: string
  suggested_budget: string
}

export async function processLeadWithAI(message: string, projectType: string, company: string): Promise<AILeadAnalysis | null> {
  if (!message || message.trim().length < 10) return null

  const prompt = `
Bạn là một chuyên gia CRM phân tích khách hàng tiềm năng.
Hãy đọc thông tin khách hàng để lại qua form liên hệ của website nội thất thảm sàn:
- Công ty/Tổ chức: ${company || 'Không rõ'}
- Loại hình dự án: ${projectType || 'Không rõ'}
- Nội dung yêu cầu: "${message}"

Nhiệm vụ của bạn là phân tích và trả về đúng định dạng JSON chuẩn (không chứa markdown \`\`\`json) với 3 trường sau:
1. "tags": mảng các từ khóa nổi bật (ví dụ: ["cần-gấp", "ngân-sách-cao", "thảm-văn-phòng", "khách-sạn", "hỏi-giá"])
2. "intent": Ý định mua hàng (chọn 1 trong: "Tham khảo giá", "Cần thi công ngay", "Đại lý phân phối", "Cần mẫu thử", "Khác")
3. "suggested_budget": Dự đoán quy mô/ngân sách (chọn 1 trong: "Nhỏ (<50tr)", "Vừa (50-200tr)", "Lớn (>200tr)", "Chưa rõ")

JSON Format:
{
  "tags": [],
  "intent": "",
  "suggested_budget": ""
}
  `

  try {
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    }
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY is not set')
      return null
    }

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    
    if (!aiRes.ok) throw new Error('Gemini API Error')
    
    const aiData = await aiRes.json()
    let text = aiData.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return null

    if (text.startsWith('```json')) {
       text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    }
    
    const extracted = JSON.parse(text)
    return {
      tags: extracted.tags || [],
      intent: extracted.intent || 'Khác',
      suggested_budget: extracted.suggested_budget || 'Chưa rõ'
    }
  } catch (error) {
    console.error('AI Processing error:', error)
    return null
  }
}

/**
 * Lấy một lead và phân tích AI, sau đó cập nhật lại database
 */
export async function analyzeAndUpdateLead(leadId: string, message: string, projectType: string, company: string) {
  const analysis = await processLeadWithAI(message, projectType, company)
  
  if (analysis) {
    await supabase.from('leads').update({
      ai_tags: analysis.tags,
      ai_intent: analysis.intent,
      budget: analysis.suggested_budget // Update predicted budget if the user didn't specify one
    }).eq('id', leadId)
    
    return analysis
  }
  return null
}
