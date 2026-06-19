import { useState } from 'react'
import { Phone, Mail, MessageCircle, Send, ExternalLink } from 'lucide-react'
import { type CollectionItem } from '../../lib/collections'
import { useSiteConfig } from '../../hooks/useSiteConfig'

interface PublicFooterProps {
  activeCollection?: CollectionItem
}

export function PublicFooter({ activeCollection }: PublicFooterProps) {
  const { config } = useSiteConfig()
  const contact = config.contact_info
  const social = config.social_links

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<string>('')

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const subject = encodeURIComponent(`Yêu cầu tư vấn collection - ${formData.project || activeCollection?.name || 'Carpet Inter'}`)
    const body = encodeURIComponent(
      [
        `Họ tên: ${formData.name}`,
        `Điện thoại: ${formData.phone}`,
        `Email/Công ty: ${formData.email}`,
        `Dự án/Bộ sưu tập: ${formData.project}`,
        '',
        formData.message,
      ].join('\n'),
    )

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
    setFormStatus('Yêu cầu đã được mở trong ứng dụng email của bạn để gửi trực tiếp.')
  }

  const hotline = contact.hotline || contact.phone || '0908314939'
  const facebookUrl = social.facebook || 'https://www.facebook.com/noithatcongcong'

  return (
    <footer id="lien-he-nhanh" className="relative w-full bg-[#fafaf8] text-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        
        {/* Info Side */}
        <div className="rounded-[30px] border border-white/10 bg-[#262626] p-6 backdrop-blur-md space-y-6">
          <div>
            <div className="text-base uppercase tracking-[0.22em] text-[#e8720c] font-medium">Thông tin liên hệ</div>
            <h3 className="mt-3 text-2xl font-light text-white sm:text-3xl">Kết nối tư vấn dự án và lựa chọn collection phù hợp</h3>
          </div>
          
          <div className="space-y-4 text-base text-white/80">
            <div className="flex items-start gap-3">
              <span className="rounded-full bg-[#e8720c]/20 p-2 text-[#e8720c]"><Phone size={16} /></span>
              <div>
                <div className="text-white font-medium font-sans">Điện thoại / Zalo / Viber / WhatsApp</div>
                <div className="mt-1 text-white/70">{hotline}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="rounded-full bg-[#e8720c]/20 p-2 text-[#e8720c]"><Mail size={16} /></span>
              <div>
                <div className="text-white font-medium font-sans">Email</div>
                <div className="mt-1 text-white/70">{contact.email}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <div className="text-white font-medium font-sans">{contact.company || config.site_info.name}</div>
              <div className="mt-2 leading-7 text-white/70 font-sans">Địa chỉ: {contact.address}</div>
              {contact.hours && (
                <div className="mt-1 leading-7 text-white/60 font-sans">{contact.hours}</div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/40 shadow-inner">
            <iframe
              title="Bản đồ văn phòng"
              src={`https://www.google.com/maps?q=${encodeURIComponent(contact.address || 'G04-L04 An Quy Villa KDT Moi Duong Noi Ha Noi')}&z=17&output=embed`}
              className="h-[280px] w-full border-0 opacity-85 hover:opacity-100 transition duration-300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form Side */}
        <div className="space-y-6">
          <div className="rounded-[30px] border border-white/10 bg-[#262626] p-6 backdrop-blur-md space-y-6">
            <div>
              <div className="text-base uppercase tracking-[0.22em] text-[#e8720c] font-medium font-sans">Yêu cầu của khách hàng</div>
              <h3 className="mt-3 text-2xl font-light text-white">Gửi nhu cầu để nhận đề xuất bộ sưu tập phù hợp</h3>
            </div>
            <form className="grid gap-4 md:grid-cols-2">
              <input value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c]" placeholder="Họ và tên" />
              <input value={formData.phone} onChange={(e) => handleFormChange('phone', e.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c]" placeholder="Số điện thoại" />
              <input value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c] md:col-span-2" placeholder="Email / công ty" />
              <input value={formData.project} onChange={(e) => handleFormChange('project', e.target.value)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c] md:col-span-2" placeholder="Dự án quan tâm / bộ sưu tập mong muốn" />
              <textarea value={formData.message} onChange={(e) => handleFormChange('message', e.target.value)} className="min-h-36 rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-[#e8720c] md:col-span-2" placeholder="Mô tả yêu cầu: diện tích, phong cách, mức độ sang trọng, tiến độ thi công..." />
              <button type="button" onClick={handleSubmit} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8720c] px-6 py-3 text-base font-medium text-white shadow-[0_12px_30px_rgba(232,114,12,0.35)] transition duration-200 hover:bg-[#ff8a24] md:col-span-2 md:w-fit cursor-pointer">
                Gửi yêu cầu tư vấn
                <Send size={16} />
              </button>
              {formStatus ? <div className="text-base text-[#e8720c] md:col-span-2">{formStatus}</div> : null}
            </form>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#262626] p-6 backdrop-blur-md space-y-5">
            <div className="text-base uppercase tracking-[0.22em] text-[#e8720c] font-medium font-sans">Liên hệ nhanh đa kênh</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Zalo', href: `https://zalo.me/${hotline}`, icon: MessageCircle },
                { label: 'WhatsApp', href: `https://wa.me/84${hotline.replace(/^0/, '')}`, icon: MessageCircle },
                { label: 'Facebook', href: facebookUrl, icon: MessageCircle },
                { label: 'Điện thoại', href: `tel:${hotline}`, icon: Phone },
              ].map((channel) => {
                const Icon = channel.icon
                return (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-base text-white/80 transition-all duration-200 hover:border-[#e8720c]/50 hover:bg-white/10 hover:text-white"
                  >
                    <span className="inline-flex items-center gap-3 font-sans">
                      <span className="rounded-full bg-[#e8720c]/20 p-2 text-[#ffd891]"><Icon size={16} /></span>
                      {channel.label}
                    </span>
                    <ExternalLink size={14} className="text-[#e8720c]" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
