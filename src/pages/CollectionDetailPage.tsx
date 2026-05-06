import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Check } from 'lucide-react';
import { collections } from '../lib/collections';

export function CollectionDetailPage() {
  const { id } = useParams();
  const collection = collections.find((c) => c.id === id);

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Không tìm thấy bộ sưu tập</h2>
          <Link to="/collections" className="text-[#f29d38] hover:underline">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#120b08]">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div className="absolute inset-0">
          <img 
            src={collection.heroImage} 
            alt={collection.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120b08] via-[#120b08]/50 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <Link 
              to="/collections" 
              className="inline-flex items-center space-x-2 text-white/60 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm uppercase tracking-wider">Trở về</span>
            </Link>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-white mb-6">
                {collection.name}
              </h1>
              <p className="text-xl sm:text-2xl text-white/80 max-w-3xl font-light leading-relaxed">
                {collection.tagline}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_380px] gap-16">
            {/* Main Column */}
            <div className="space-y-16">
              {/* Intro */}
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-white/80 leading-relaxed">{collection.summary}</p>
                <p className="text-white/60 leading-relaxed mt-4">{collection.detail}</p>
              </div>

              {/* Products Grid */}
              <div>
                <h2 className="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4">Các Mã Sản Phẩm</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {collection.products.map((product) => (
                    <div key={product.code} className="bg-[#19110d] p-6 rounded-[16px] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-serif text-white">{product.name}</h3>
                        <span className="text-xs font-mono text-[#f29d38] bg-[#f29d38]/10 px-2 py-1 rounded">
                          {product.code}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {product.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start text-sm text-white/60">
                            <span className="mr-2 text-[#f29d38] mt-0.5">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <h2 className="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4">Thư Viện Ảnh</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {collection.gallery.slice(0, 6).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-[12px] overflow-hidden bg-white/5">
                      <img 
                        src={img} 
                        alt={`${collection.name} gallery ${idx + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Facts */}
              <div className="bg-[#19110d] p-8 rounded-[24px] border border-white/5">
                <h3 className="text-lg uppercase tracking-wider text-white font-medium mb-6">Đặc Điểm Nổi Bật</h3>
                <ul className="space-y-4">
                  {collection.quickFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check size={20} className="text-[#f29d38] shrink-0 mr-3 mt-0.5" />
                      <span className="text-sm text-white/70">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Applications */}
              <div className="bg-[#19110d] p-8 rounded-[24px] border border-white/5">
                <h3 className="text-lg uppercase tracking-wider text-white font-medium mb-6">Ứng Dụng Đề Xuất</h3>
                <div className="flex flex-wrap gap-2">
                  {collection.applications.map((app, idx) => (
                    <span key={idx} className="bg-[#120b08] border border-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-[#19110d] p-8 rounded-[24px] border border-white/5">
                <h3 className="text-lg uppercase tracking-wider text-white font-medium mb-6">Tài Liệu</h3>
                <div className="space-y-3">
                  {collection.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-[#120b08] rounded-[12px] hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                        {res.label}
                      </span>
                      <Download size={16} className="text-white/40 group-hover:text-[#f29d38] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-gradient-to-br from-[#f29d38] to-[#e08b26] p-8 rounded-[24px] text-[#120b08]">
                <h3 className="text-xl font-serif font-bold mb-3">Tư vấn dự án</h3>
                <p className="text-sm mb-6 opacity-90">
                  Liên hệ với chuyên gia của chúng tôi để nhận mẫu thực tế và báo giá chi tiết cho dự án của bạn.
                </p>
                <Link 
                  to="/lien-he"
                  className="block text-center w-full bg-[#120b08] text-white py-3 rounded-full text-sm font-medium hover:bg-black transition-colors"
                >
                  Liên Hệ Ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
