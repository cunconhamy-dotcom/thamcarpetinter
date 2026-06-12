/**
 * API for managing AI Knowledge Base (RAG documents).
 */
import { supabase } from '@/lib/supabase'

export interface KnowledgeDocument {
  id: string
  title: string
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
  status: 'pending' | 'ready' | 'error'
  createdAt: string
}

const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL

// Fake data for demo mode
let demoDocs: KnowledgeDocument[] = []

/** Map DB row to TS interface */
function mapDoc(row: any): KnowledgeDocument {
  return {
    id: row.id,
    title: row.title,
    fileName: row.file_name,
    filePath: row.file_path,
    fileType: row.file_type,
    fileSize: row.file_size,
    status: row.status,
    createdAt: row.created_at,
  }
}

/** Fetch all uploaded knowledge documents */
export async function fetchKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  if (IS_DEMO) return demoDocs

  const { data, error } = await supabase
    .from('knowledge_documents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchKnowledgeDocuments error:', error)
    return []
  }
  return data.map(mapDoc)
}

/** 
 * Basic text extraction logic. In a real production app, 
 * PDF extraction should be done server-side or via an Edge Function using pdf-parse.
 * For this MVP, we simulate it.
 */
async function extractTextFromFile(file: File): Promise<string> {
  // If text file, we can read it directly
  if (file.type === 'text/plain') {
    return await file.text()
  }
  
  // For PDF or DOCX, client-side extraction is heavy. 
  // We will simulate a successful extraction string for the MVP.
  return `Đây là nội dung mô phỏng được trích xuất từ file ${file.name}. \n\nTrong thực tế, bạn cần tích hợp một thư viện như pdf.js hoặc sử dụng Supabase Edge Function để đọc text từ PDF.`
}

/** Upload a new document to the knowledge base */
export async function uploadKnowledgeDocument(file: File): Promise<{ data: KnowledgeDocument | null; error: string | null }> {
  if (IS_DEMO) {
    const fakeDoc: KnowledgeDocument = {
      id: `demo-doc-${Date.now()}`,
      title: file.name,
      fileName: file.name,
      filePath: `demo/${file.name}`,
      fileType: file.name.split('.').pop() || 'txt',
      fileSize: file.size,
      status: 'ready',
      createdAt: new Date().toISOString()
    }
    demoDocs = [fakeDoc, ...demoDocs]
    return { data: fakeDoc, error: null }
  }

  try {
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `knowledge/${timestamp}_${safeName}`

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('knowledge')
      .upload(storagePath, file, { cacheControl: '3600', upsert: false })

    if (uploadError) return { data: null, error: uploadError.message }

    // 2. Extract text (Simulated for PDF/DOCX, real for TXT)
    const textContent = await extractTextFromFile(file)

    // 3. Insert into DB
    const { data: record, error: insertError } = await supabase
      .from('knowledge_documents')
      .insert({
        title: file.name,
        file_name: file.name,
        file_path: storagePath,
        file_type: file.name.split('.').pop() || 'txt',
        file_size: file.size,
        content_text: textContent,
        status: 'ready' // Set to ready since we extracted immediately
      })
      .select()
      .single()

    if (insertError) return { data: null, error: insertError.message }
    return { data: mapDoc(record), error: null }
  } catch (err) {
    return { data: null, error: (err as Error).message }
  }
}

/** Delete a knowledge document */
export async function deleteKnowledgeDocument(id: string, filePath: string): Promise<{ error: string | null }> {
  if (IS_DEMO) {
    demoDocs = demoDocs.filter(d => d.id !== id)
    return { error: null }
  }

  try {
    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from('knowledge')
      .remove([filePath])

    if (storageError) console.warn('Storage delete warning:', storageError)

    // 2. Delete from DB
    const { error: dbError } = await supabase
      .from('knowledge_documents')
      .delete()
      .eq('id', id)

    return { error: dbError?.message ?? null }
  } catch (err) {
    return { error: (err as Error).message }
  }
}
