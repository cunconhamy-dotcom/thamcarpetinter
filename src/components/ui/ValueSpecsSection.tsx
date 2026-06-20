import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CollectionItem, Product } from '@/lib/collections'
import { useSiteConfig } from '@/hooks/useSiteConfig'

interface ValueSpecsSectionProps {
  collection: CollectionItem
  selectedProduct: Product | undefined
}

export function ValueSpecsSection({ collection, selectedProduct }: ValueSpecsSectionProps) {
  const { config } = useSiteConfig()
  const [valuePoints, setValuePoints] = useState<string[]>([])
  const [productSpec, setProductSpec] = useState<any>(null)
  const [loadingPoints, setLoadingPoints] = useState(false)
  const [loadingSpec, setLoadingSpec] = useState(false)

  // Fetch Value Points
  useEffect(() => {
    if (!collection?.dbId) return
    const fetchPoints = async () => {
      setLoadingPoints(true)
      try {
        const { data, error } = await supabase
          .from('collection_value_points')
          .select('point_text')
          .eq('collection_id', collection.dbId)

        if (error) {
          console.error('Error fetching value points:', error)
          // Fallback to static if error
          setValuePoints(collection.valuePoints)
        } else if (data && data.length > 0) {
          setValuePoints(data.map((row) => row.point_text))
        } else {
          setValuePoints(collection.valuePoints)
        }
      } catch (err) {
        console.error(err)
        setValuePoints(collection.valuePoints)
      } finally {
        setLoadingPoints(false)
      }
    }
    fetchPoints()
  }, [collection])

  // Fetch Product Specs
  useEffect(() => {
    if (!selectedProduct?.id) {
      setProductSpec(null)
      return
    }

    const fetchSpec = async () => {
      setLoadingSpec(true)
      try {
        const { data, error } = await supabase
          .from('product_specs')
          .select('*')
          .eq('product_id', selectedProduct.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching product specs:', error)
          setProductSpec(selectedProduct.spec)
        } else if (data) {
          setProductSpec(data)
        } else {
          setProductSpec(selectedProduct.spec)
        }
      } catch (err) {
        console.error(err)
        setProductSpec(selectedProduct.spec)
      } finally {
        setLoadingSpec(false)
      }
    }
    fetchSpec()
  }, [selectedProduct])

  // Mapping DB spec names to UI labels
  const getSpecValue = (key: string, dbKey: string) => {
    if (productSpec && productSpec[dbKey]) return productSpec[dbKey]
    if (selectedProduct?.spec && (selectedProduct.spec as any)[key]) return (selectedProduct.spec as any)[key]
    return 'N/A'
  }

  return (
    <section className="w-full bg-[#fafaf8] py-16 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-2">
        {/* GIÁ TRỊ NỔI BẬT */}
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#262626] shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#e8720c]/20 p-2 text-[#e8720c]">
              <Check size={14} />
            </span>
            <div className="text-base uppercase tracking-[0.25em] text-[#e8720c] font-semibold">Giá trị nổi bật mang lại</div>
          </div>
          
          <div className="space-y-3">
            {loadingPoints ? (
              <div className="animate-pulse flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 h-14" />
            ) : (
              valuePoints.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10 hover:shadow-sm">
                  <span className="mt-0.5 shrink-0 rounded-full bg-[#e8720c]/20 p-1.5 text-[#e8720c]">
                    <Check size={13} />
                  </span>
                  <div className="text-base leading-7 text-white/80">{item}</div>
                </div>
              ))
            )}
          </div>
          
          <div className="rounded-2xl border border-[#e8720c]/30 bg-[#e8720c]/10 p-4 text-base leading-7 text-[#e8720c] font-medium">
            {config.brand_info.cta_text}
          </div>
        </div>

        {/* THÔNG SỐ KỸ THUẬT */}
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#262626] shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-6 lg:p-8">
          {selectedProduct ? (
            <>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm uppercase tracking-[0.25em] text-[#e8720c] font-semibold">Thông số kỹ thuật sản phẩm</div>
                  <h3 className="mt-2 text-2xl font-light text-white sm:text-3xl">
                    {selectedProduct.code} · {selectedProduct.name}
                  </h3>
                </div>
                <div className="h-3 w-3 shrink-0 rounded-full mt-2" style={{ backgroundColor: collection.accent }} />
              </div>

              {loadingSpec ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-white/5 rounded-xl"></div>
                  <div className="h-12 bg-white/5 rounded-xl"></div>
                  <div className="h-12 bg-white/5 rounded-xl"></div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Bộ sưu tập', collection.name],
                    ['Số mã hiển thị', String(collection.products.length)],
                    ['Cấu trúc sợi', getSpecValue('pile', 'pile_type')],
                    ['Kết cấu', getSpecValue('construction', 'construction')],
                    ['Đế thảm', getSpecValue('backing', 'backing')],
                    ['Kích thước', getSpecValue('size', 'size')],
                    ['Phù hợp', getSpecValue('useCase', 'use_case')],
                    ['Lắp đặt', getSpecValue('installation', 'installation')],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-[#e8720c] font-semibold">{label}</div>
                      <div className="mt-1 text-base leading-6 text-white/80">{value}</div>
                    </div>
                  ))}
                  {collection.applications.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:col-span-2">
                      <div className="text-xs uppercase tracking-[0.18em] text-[#e8720c] font-semibold">Ứng dụng</div>
                      <div className="mt-1 text-base leading-6 text-white/80">{collection.applications.join(' · ')}</div>
                    </div>
                  )}
                  {selectedProduct.colors?.length ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:col-span-2">
                      <div className="text-xs uppercase tracking-[0.18em] text-[#e8720c] font-semibold">Sắc độ gợi ý</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedProduct.colors.map((c) => (
                          <span key={c} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white/70 font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-base text-white/40">
              Chọn sản phẩm để xem thông số kỹ thuật
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
