import { useState, useRef, useEffect } from 'react'
import { Send, User, Loader2, MessageCircle, ChevronDown, Maximize2, Minimize2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [aiConfig, setAiConfig] = useState<any>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch AI Config on mount
  useEffect(() => {
    async function loadConfig() {
      let config = null
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'ai_settings')
          .maybeSingle()
        
        if (data?.value) {
          config = data.value
        }
      } catch (err) {
        console.warn('[AIChatbot] Failed to load AI config from database, will use offline fallback:', err)
      }

      // If Supabase fetch failed or returned nothing, try localStorage fallback
      if (!config) {
        try {
          const saved = localStorage.getItem('ci_ai_settings')
          if (saved) config = JSON.parse(saved)
        } catch { /* ignore */ }
      }

      // If still no config, use hardcoded Vietnamese consulting defaults
      if (!config) {
        config = {
          assistantName: 'Hà Trần Carpets',
          greeting: 'Chào bạn, mình là Hà Trần Carpets. Bạn đang tìm thảm cho không gian nào vậy?',
          personaStyle: 'Chuyên nghiệp, lịch sự, tư vấn tận tâm và súc tích. Trả lời ngắn gọn, đi thẳng vào vấn đề. Luôn xưng "mình" và gọi khách là "bạn". Không bao giờ dùng từ "AI", "Trợ lý", "Bot" hay ngôn ngữ máy móc.',
          personality: 'Nhiệt tình, hiểu biết sâu về thảm sàn, luôn hướng tới giải pháp tốt nhất cho khách hàng. Trả lời ngắn gọn như một người tư vấn thật.',
          knowledge: 'Carpets Inter, EcoSoft, EcoSquare, thảm văn phòng cao cấp, thảm khách sạn.',
          skills: 'Tư vấn chọn thảm, báo giá sơ bộ, hướng dẫn kỹ thuật thi công.',
          rules: '1. Không bao giờ nhận mình là AI. \n2. Luôn trình bày nội dung có bố cục rõ ràng (outline), dùng gạch đầu dòng. Trả lời cực kỳ súc tích, ngắn gọn, không viết dài dòng lê thê. \n3. Kết luận câu trả lời bằng một bảng tóm tắt thông tin ngắn gọn. \n4. Luôn cung cấp các link trích dẫn theo ĐÚNG CHUẨN MARKDOWN để khách click cuộn đến khu vực liên quan. KHÔNG BAO GIỜ viết link dưới dạng text trần. \nCác ID bắt buộc phải dùng: [Tài liệu & Chứng nhận](#tai-lieu), [Tin tức chuyên ngành](#news), [Liên hệ tư vấn chi tiết](#lien-he-nhanh). \nĐối với các bộ sưu tập cụ thể, bắt buộc thêm tham số tìm kiếm vào link. LƯU Ý QUAN TRỌNG: KHÔNG ĐƯỢC để khoảng trắng trong phần link URL, phải thay khoảng trắng bằng dấu cộng (+). Ví dụ: [Xem bộ sưu tập thảm văn phòng](#collections?q=văn+phòng), [Xem thảm khách sạn](#collections?q=khách+sạn). \nTuyệt đối dùng ngoặc vuông cho văn bản và ngoặc đơn cho URL (ví dụ: [Liên hệ tư vấn](#lien-he-nhanh)).',
          systemPrompt: 'Bạn là Hà Trần Carpets. Hãy tư vấn nhiệt tình, trình bày rõ ràng, trả lời cực kỳ súc tích, ngắn gọn và tập trung, không viết dài dòng.',
          userPrompt: 'Câu hỏi của khách hàng: {{message}}',
        }
      }

      setAiConfig(config)
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: config.greeting,
          timestamp: new Date()
        }
      ])
    }
    loadConfig()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isTyping, isOpen])

  const callGeminiAPI = async (history: Message[], userText: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('Thiếu API Key Gemini')
    }

    let systemText = aiConfig?.systemPrompt || 'Bạn là tư vấn viên.'
    if (aiConfig) {
       systemText = `
Tên bạn là: ${aiConfig.assistantName}
Phong cách: ${aiConfig.personaStyle}
Tính cách: ${aiConfig.personality}
Kiến thức: ${aiConfig.knowledge}
Kỹ năng: ${aiConfig.skills}
Luật bắt buộc: ${aiConfig.rules}
System Prompt: ${aiConfig.systemPrompt}
       `.trim()
    }

    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))

    contents.push({
      role: 'user',
      parts: [{ text: userText }]
    })

    // Models to try in sequence in case of 503/429 or other request errors
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
    let lastError: any = null

    for (const model of models) {
      try {
        console.log(`[AIChatbot] Sending request to model: ${model}`)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            system_instruction: {
              parts: { text: systemText }
            },
            contents: contents,
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          const errMsg = errorData.error?.message || `Lỗi gọi API ${model}`
          throw new Error(errMsg)
        }

        const data = await response.json()
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.log(`[AIChatbot] Successfully generated content using model: ${model}`)
          return data.candidates[0].content.parts[0].text
        } else {
          throw new Error(`Phản hồi trống từ model ${model}`)
        }
      } catch (err: any) {
        console.warn(`[AIChatbot] Model ${model} failed, trying fallback:`, err.message || err)
        lastError = err
      }
    }

    throw lastError || new Error('Tất cả các model Gemini đều gặp lỗi.')
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const responseText = await callGeminiAPI(messages, userMessage.content)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, hiện tại hệ thống đang bận. Bạn vui lòng liên hệ qua Zalo hoặc Hotline nhé.',
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  const assistantName = aiConfig?.assistantName || 'Hà Trần Carpets'
  const initials = assistantName.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8720c] text-white shadow-[0_12px_24px_rgba(232,114,12,0.4)] transition-transform hover:scale-110 active:scale-95"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    )
  }

  if (!aiConfig && messages.length === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-[calc(100%-48px)] rounded-[24px] border border-white/10 bg-[#1a1a1a] shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col transition-all duration-300 ${isExpanded ? 'h-[750px] max-h-[90vh] max-w-[700px] sm:w-[40vw]' : 'h-[600px] max-h-[85vh] max-w-[360px] sm:w-[380px]'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#262626] p-4 backdrop-blur-md shrink-0">
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e8720c] to-[#f29d38] text-white font-bold text-lg shadow-sm">
            {initials}
          </div>
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#262626] bg-green-500"></span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white leading-tight">{assistantName}</h3>
          <p className="text-xs text-white/50 font-medium mt-0.5">Đang trực tuyến</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            title={isExpanded ? "Thu nhỏ" : "Mở rộng"}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            title="Đóng chat"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1f1f1f]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[90%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="shrink-0 mt-1">
                {msg.role === 'assistant' ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#e8720c] to-[#f29d38] text-white text-[10px] font-bold shadow-sm">
                    {initials}
                  </div>
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 text-[10px]">
                    <User size={14} />
                  </div>
                )}
              </div>
              <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-full overflow-hidden`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm overflow-hidden ${
                    msg.role === 'user'
                      ? 'bg-[#e8720c] text-white rounded-tr-sm'
                      : 'bg-[#2a2a2a] text-white/90 rounded-tl-sm border border-white/5'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1" {...props} />,
                          h3: ({node, ...props}) => <h3 className="font-bold text-white mb-2 mt-4 text-base" {...props} />,
                          h4: ({node, ...props}) => <h4 className="font-semibold text-white mb-2 mt-3" {...props} />,
                          table: ({node, ...props}) => (
                            <div className="overflow-x-auto mb-3 mt-2 rounded-lg border border-white/10">
                              <table className="w-full text-left text-sm border-collapse" {...props} />
                            </div>
                          ),
                          th: ({node, ...props}) => <th className="border-b border-white/10 px-3 py-2 bg-white/5 font-semibold text-white whitespace-nowrap" {...props} />,
                          td: ({node, ...props}) => <td className="border-b border-white/5 px-3 py-2" {...props} />,
                          a: ({node, href, ...props}) => (
                            <a 
                              href={href} 
                              className="text-[#e8720c] hover:text-[#f29d38] hover:underline font-medium inline-flex items-center gap-1 transition-colors"
                              onClick={(e) => {
                                // If it's a hash link, handle smooth scrolling and potential search queries
                                if (href?.startsWith('#')) {
                                  e.preventDefault();
                                  
                                  const [hash, qs] = href.split('?');
                                  
                                  // Dispatch search event if there's a query parameter
                                  if (qs) {
                                    const params = new URLSearchParams(qs);
                                    const q = params.get('q');
                                    if (q) {
                                      window.dispatchEvent(new CustomEvent('ai-search-collections', { detail: { q } }));
                                    }
                                  }

                                  const target = document.querySelector(hash);
                                  if (target) {
                                    target.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }
                              }}
                              {...props} 
                            />
                          ),
                          strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-white/30 px-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[85%] gap-2 flex-row">
              <div className="shrink-0 mt-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#e8720c] to-[#f29d38] text-white text-[10px] font-bold shadow-sm">
                  {initials}
                </div>
              </div>
              <div className="flex items-center rounded-2xl bg-[#2a2a2a] px-4 py-3 rounded-tl-sm border border-white/5">
                <Loader2 size={16} className="animate-spin text-[#e8720c]" />
                <span className="ml-2 text-sm text-white/60">Đang trả lời...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/5 bg-[#262626] shrink-0">
        <div className="relative flex items-end gap-2 rounded-[20px] bg-[#1a1a1a] p-1.5 border border-white/10 focus-within:border-[#e8720c]/50 transition-colors shadow-inner">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Nhắn tin cho ${assistantName}...`}
            className="w-full resize-none bg-transparent px-3 py-2 text-[15px] text-white outline-none placeholder:text-white/30 max-h-32"
            rows={1}
            style={{ minHeight: '40px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8720c] text-white transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <Send size={18} className={input.trim() ? "translate-x-[2px] translate-y-[1px]" : "translate-y-[1px]"} />
          </button>
        </div>
      </div>
    </div>
  )
}
