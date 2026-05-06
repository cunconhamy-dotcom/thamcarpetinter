import { Link } from 'react-router-dom';
import { contactInfo } from '../../lib/collections';

export function Footer() {
  return (
    <footer className="bg-[#0a0604] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex flex-col">
              <span className="font-serif text-2xl font-semibold text-[#f29d38] tracking-wider">
                CARPETS INTER
              </span>
              <span className="text-xs text-white/50 tracking-[0.2em] uppercase">
                Vietnam
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Đại diện phân phối chính thức thương hiệu thảm sàn modular tile cao cấp Carpets Inter tại Việt Nam.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-sm">Khám Phá</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/60 hover:text-[#f29d38] text-sm transition-colors">Trang Chủ</Link></li>
              <li><Link to="/collections" className="text-white/60 hover:text-[#f29d38] text-sm transition-colors">Bộ Sưu Tập</Link></li>
              <li><Link to="/lien-he" className="text-white/60 hover:text-[#f29d38] text-sm transition-colors">Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-sm">Thông Tin Liên Hệ</h4>
            <ul className="space-y-4">
              <li className="text-white/60 text-sm">
                <strong className="block text-white/80 mb-1">Công ty</strong>
                {contactInfo.company}
              </li>
              <li className="text-white/60 text-sm">
                <strong className="block text-white/80 mb-1">Địa chỉ</strong>
                {contactInfo.address}
              </li>
              <li className="grid grid-cols-2 gap-4">
                <div className="text-white/60 text-sm">
                  <strong className="block text-white/80 mb-1">Hotline</strong>
                  {contactInfo.hotline}
                </div>
                <div className="text-white/60 text-sm">
                  <strong className="block text-white/80 mb-1">Email</strong>
                  {contactInfo.email}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} {contactInfo.company}. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Thương hiệu Carpets Inter thuộc sở hữu của TCM Corporation Plc.
          </p>
        </div>
      </div>
    </footer>
  );
}
