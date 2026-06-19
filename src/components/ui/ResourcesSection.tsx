import { useEffect, useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CollectionItem } from '@/lib/collections'

const resourceLabels: Record<string, string> = {
  brochure: 'Brochure',
  spec: 'Thông số',
  specification: 'Thông số',
  guide: 'Hướng dẫn',
  installation: 'Hướng dẫn',
  portfolio: 'Portfolio',
}

interface ResourcesSectionProps {
  collection: CollectionItem
}

interface DbResource {
  label: string
  resource_type: string
  file_url: string
}

export function ResourcesSection({ collection }: ResourcesSectionProps) {
  const [resources, setResources] = useState<DbResource[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!collection?.dbId) return
    const fetchResources = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('collection_resources')
          .select('*')
          .eq('collection_id', collection.dbId)

        if (error) {
          console.error('Error fetching resources:', error)
          // map local fallback
          setResources(collection.resources.map(r => ({
            label: r.label,
            resource_type: r.type,
            file_url: r.url
          })))
        } else if (data && data.length > 0) {
          setResources(data)
        } else {
          setResources(collection.resources.map(r => ({
            label: r.label,
            resource_type: r.type,
            file_url: r.url
          })))
        }
      } catch (err) {
        console.error(err)
        setResources(collection.resources.map(r => ({
          label: r.label,
          resource_type: r.type,
          file_url: r.url
        })))
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [collection])

  if (!loading && resources.length === 0) return null

  return (
    <section id="tai-lieu" className="w-full bg-[#fafaf8] py-16 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-black/8 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-5 lg:p-7 space-y-5">
          <div className="flex items-center gap-2 text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">
            <FileText size={16} />
            Brochure · Spec · Hướng dẫn
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-6 h-6 border-2 border-[#e8720c] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resources.map((resource) => (
                <a
                  key={resource.file_url}
                  href={resource.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-black/8 bg-[#f5f3f0] p-4 shadow-sm transition-all duration-200 hover:border-[#e8720c]/40 hover:shadow-md hover:bg-white"
                >
                  <div>
                    <div className="text-base font-medium text-[#1a1a1a]">{resource.label}</div>
                    <div className="mt-1 text-sm uppercase tracking-[0.18em] text-[#e8720c] font-semibold">
                      {resourceLabels[resource.resource_type] || resource.resource_type}
                    </div>
                  </div>
                  <span className="rounded-full bg-[#e8720c] p-2 text-white shadow-[0_6px_16px_rgba(232,114,12,0.22)]">
                    <Download size={15} />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
