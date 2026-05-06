import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { contactInfo } from '../lib/collections';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-[#120b08] pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-serif text-white mb-6">Liên Hệ</h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn lựa chọn giải pháp thảm sàn tốt nhất cho dự án của mình. Đội ngũ chuyên gia từ Carpets Inter Vietnam sẽ liên hệ lại ngay khi nhận được yêu cầu.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl font-serif text-white mb-8">{contactInfo.company}</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 mr-4">
                    <MapPin className="text-[#f29d38]" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Showroom</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 mr-4">
                    <Phone className="text-[#f29d38]" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Hotline / Zalo</h3>
                    <a href={`tel:${contactInfo.hotline.replace(/[^0-9]/g, '')}`} className="text-white/60 text-sm hover:text-[#f29d38] transition-colors">
                      {contactInfo.hotline}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 mr-4">
                    <Mail className="text-[#f29d38]" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-white/60 text-sm hover:text-[#f29d38] transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 mr-4">
                    <Clock className="text-[#f29d38]" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Giờ làm việc</h3>
                    <p className="text-white/60 text-sm">{contactInfo.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#19110d] p-8 sm:p-10 rounded-[24px] border border-white/5"
          >
            <h3 className="text-2xl font-serif text-white mb-8">Gửi Yêu Cầu Tư Vấn</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-white/80">Họ tên *</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-[#120b08] border border-white/10 rounded-[8px] px-4 py-3 text-white focus:outline-none focus:border-[#f29d38]/50 transition-colors"
                    placeholder="Tên của bạn"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm text-white/80">Số điện thoại *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full bg-[#120b08] border border-white/10 rounded-[8px] px-4 py-3 text-white focus:outline-none focus:border-[#f29d38]/50 transition-colors"
                    placeholder="09xx xxx xxx"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-white/80">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-[#120b08] border border-white/10 rounded-[8px] px-4 py-3 text-white focus:outline-none focus:border-[#f29d38]/50 transition-colors"
                  placeholder="email@company.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="project" className="text-sm text-white/80">Dự án</label>
                <input 
                  type="text" 
                  id="project" 
                  className="w-full bg-[#120b08] border border-white/10 rounded-[8px] px-4 py-3 text-white focus:outline-none focus:border-[#f29d38]/50 transition-colors"
                  placeholder="Tên hoặc loại hình dự án"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-white/80">Nội dung yêu cầu *</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full bg-[#120b08] border border-white/10 rounded-[8px] px-4 py-3 text-white focus:outline-none focus:border-[#f29d38]/50 transition-colors resize-none"
                  placeholder="Cho chúng tôi biết bạn cần hỗ trợ gì..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#f29d38] text-[#120b08] font-medium py-4 rounded-[8px] hover:bg-[#ffbe63] transition-colors mt-4"
              >
                Gửi Yêu Cầu
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
