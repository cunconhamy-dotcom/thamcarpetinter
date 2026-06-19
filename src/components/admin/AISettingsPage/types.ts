export interface AIPersonalization {
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

export interface MCPConfig {
  enabled: boolean
  endpoint: string
  apiKey: string
}
