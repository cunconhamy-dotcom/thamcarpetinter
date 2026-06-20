import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { fetchGlobalResources, type ResourceLink } from '../../lib/collections'

const resourceLabels: Record<ResourceLink['type'], string> = {
  brochure: 'Brochure',
  spec: 'Thông số',
  guide: 'Hướng dẫn',
  portfolio: 'Portfolio',
}

export function PortfolioResources() {
  const [resources, setResources] = useState<ResourceLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGlobalResources().then((data) => {
      setResources(data)
      setLoading(false)
    })
  }, [])

  return (
    <section className="w-full bg-[#fafaf8] py-16 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-[30px] border border-black/8 bg-white p-6 shadow-sm space-y-4">
          <div className="text-base uppercase tracking-[0.22em] text-[#e8720c] font-semibold">Tài liệu tổng hợp</div>
          <h3 className="text-2xl font-light text-[#1a1a1a] sm:text-3xl">Portfolio hỗ trợ khách hàng</h3>
          <p className="text-base leading-7 text-black/70">
            Mỗi bộ sưu tập mang đến giải pháp thẩm mỹ rõ ràng cho từng kiểu không gian, giúp khách hàng dễ hình dung hiệu quả
            hoàn thiện, nâng chất lượng cảm nhận và tạo giá trị sử dụng bền vững cho công trình.
          </p>
        </div>

        <div className="grid gap-3">
          {loading ? (
            <>
              <div className="animate-pulse h-16 rounded-[24px] bg-black/5" />
              <div className="animate-pulse h-16 rounded-[24px] bg-black/5" />
            </>
          ) : resources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-[24px] border border-black/8 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#e8720c]/40 hover:shadow-md hover:bg-[#fafaf8]"
            >
              <div>
                <div className="text-base font-medium text-[#1a1a1a]">{resource.label}</div>
                <div className="mt-1 text-sm uppercase tracking-[0.2em] text-[#e8720c] font-semibold">{resourceLabels[resource.type]}</div>
              </div>
              <span className="rounded-full border border-[#e8720c]/30 bg-[#e8720c]/5 p-2 text-[#e8720c] transition duration-200">
                <ArrowRight size={16} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
