/**
 * AI Providers — provider definitions, model lists, and connection testing.
 * Used by AISettingsPage to configure AI chatbot backend.
 */

export interface AIProviderConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'openrouter'
  apiKey: string
  model: string
  customEndpoint?: string
}

export interface ProviderInfo {
  id: AIProviderConfig['provider']
  name: string
  description: string
  icon: string
  models: { id: string; name: string; description: string }[]
  defaultModel: string
  keyPrefix: string  // For masking (e.g., "sk-", "AIza")
  docsUrl: string
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Mô hình AI của Google DeepMind',
    icon: '🔷',
    models: [
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Nhanh, tiết kiệm chi phí' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Mạnh mẽ nhất, reasoning tốt' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Thế hệ trước, ổn định' },
    ],
    defaultModel: 'gemini-2.5-flash',
    keyPrefix: 'AIza',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/api-key',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'ChatGPT và các mô hình GPT',
    icon: '🟢',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Mạnh nhất, đa phương thức' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Nhanh, tiết kiệm' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Phiên bản trước, context 128K' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Kinh tế nhất' },
    ],
    defaultModel: 'gpt-4o-mini',
    keyPrefix: 'sk-',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    description: 'Claude — AI an toàn và hữu ích',
    icon: '🟠',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'Mới nhất, mạnh mẽ' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Cân bằng tốt' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Nhanh nhất, tiết kiệm' },
    ],
    defaultModel: 'claude-3-5-sonnet-20241022',
    keyPrefix: 'sk-ant-',
    docsUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Truy cập nhiều mô hình qua 1 API',
    icon: '🔀',
    models: [
      { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash (via OR)', description: 'Google qua OpenRouter' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (via OR)', description: 'Anthropic qua OpenRouter' },
      { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (via OR)', description: 'OpenAI qua OpenRouter' },
      { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', description: 'Meta, mã nguồn mở' },
    ],
    defaultModel: 'google/gemini-2.5-flash',
    keyPrefix: 'sk-or-',
    docsUrl: 'https://openrouter.ai/keys',
  },
]

/** Get provider info by ID */
export function getProvider(id: string): ProviderInfo | undefined {
  return PROVIDERS.find(p => p.id === id)
}

/** Get models for a provider */
export function getModels(providerId: string) {
  return getProvider(providerId)?.models ?? []
}

/** Mask an API key for display */
export function maskApiKey(key: string): string {
  if (!key || key.length < 10) return '••••••••'
  return key.slice(0, 6) + '••••••••' + key.slice(-4)
}

/** Build the API endpoint URL for a provider */
function getApiEndpoint(provider: AIProviderConfig['provider'], customEndpoint?: string): string {
  switch (provider) {
    case 'gemini':
      return 'https://generativelanguage.googleapis.com/v1beta'
    case 'openai':
      return 'https://api.openai.com/v1'
    case 'anthropic':
      return 'https://api.anthropic.com/v1'
    case 'openrouter':
      return customEndpoint || 'https://openrouter.ai/api/v1'
    default:
      return ''
  }
}

/** Test connection to an AI provider — sends a simple "Hello" and checks for a valid response */
export async function testConnection(
  config: AIProviderConfig,
): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  const start = Date.now()

  try {
    const endpoint = getApiEndpoint(config.provider, config.customEndpoint)

    if (config.provider === 'gemini') {
      const url = `${endpoint}/models/${config.model}:generateContent?key=${config.apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say "Connection OK" in exactly 2 words.' }] }],
          generationConfig: { maxOutputTokens: 20 },
        }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, message: data.error?.message || `HTTP ${res.status}` }
      return { success: true, message: 'Kết nối thành công!', latencyMs: Date.now() - start }
    }

    if (config.provider === 'openai' || config.provider === 'openrouter') {
      const url = `${endpoint}/chat/completions`
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      }
      if (config.provider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin
        headers['X-Title'] = 'Carpets Inter Admin'
      }
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: 'Say "Connection OK" in exactly 2 words.' }],
          max_tokens: 20,
        }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, message: data.error?.message || `HTTP ${res.status}` }
      return { success: true, message: 'Kết nối thành công!', latencyMs: Date.now() - start }
    }

    if (config.provider === 'anthropic') {
      const url = `${endpoint}/messages`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: 20,
          messages: [{ role: 'user', content: 'Say "Connection OK" in exactly 2 words.' }],
        }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, message: data.error?.message || `HTTP ${res.status}` }
      return { success: true, message: 'Kết nối thành công!', latencyMs: Date.now() - start }
    }

    return { success: false, message: 'Provider không được hỗ trợ.' }
  } catch (err) {
    return { success: false, message: `Lỗi kết nối: ${(err as Error).message}` }
  }
}

/** Default provider config */
export const DEFAULT_PROVIDER_CONFIG: AIProviderConfig = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.5-flash',
}
