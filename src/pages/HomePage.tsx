import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collections } from '../lib/collections';

export function HomePage() {
  const featuredCollections = collections.slice(0, 3); // Pick first 3

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#120b08] via-[#120b08]/80 to-transparent z-10" />
          <img 
            src={collections[0]?.heroImage} 
            alt="Carpets Inter Hero" 
            className="w-full h-full object-cover object-center opacity-60"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
              Elevate Spaces,<br />
              <span className="text-[#f29d38] italic">Empower Living.</span>
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-xl leading-relaxed">
              Giải pháp thảm sàn modular tile cao cấp từ Carpets Inter. Sự kết hợp hoàn hảo giữa thiết kế đương đại, hiệu suất vượt trội và cam kết phát triển bền vững.
            </p>
            <Link 
              to="/collections" 
              className="inline-flex items-center space-x-2 bg-[#f29d38] text-[#120b08] px-8 py-4 rounded-full font-medium transition-all hover:bg-[#ffbe63] hover:shadow-[0_0_20px_rgba(242,157,56,0.3)]"
            >
              <span>Khám Phá Bộ Sưu Tập</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-[#19110d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-serif text-white">Di Sản Hơn 40 Năm<br/>Kiến Tạo Không Gian</h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Thuộc TCM Corporation Plc., Carpets Inter tự hào là một trong những nhà sản xuất thảm lớn nhất Đông Nam Á. Chúng tôi không chỉ tạo ra vật liệu lát sàn, mà kiến tạo nền tảng cho sự thành công.
                </p>
                <p>
                  Với hơn 1 tỷ chai nhựa PET đã được tái chế thành đế thảm EcoSoft®, mỗi dự án sử dụng Carpets Inter là một lời khẳng định mạnh mẽ về trách nhiệm môi trường và phát triển bền vững.
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-[#120b08] p-8 rounded-[24px] border border-white/5">
                  <h3 className="text-[#f29d38] text-4xl font-serif mb-2">1B+</h3>
                  <p className="text-white/60 text-sm uppercase tracking-wider">Chai PET Tái Chế</p>
                </div>
                <div className="bg-[#120b08] p-8 rounded-[24px] border border-white/5">
                  <h3 className="text-[#f29d38] text-4xl font-serif mb-2">40+</h3>
                  <p className="text-white/60 text-sm uppercase tracking-wider">Năm Kinh Nghiệm</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-[#120b08] p-8 rounded-[24px] border border-white/5">
                  <h3 className="text-[#f29d38] text-4xl font-serif mb-2">Eco</h3>
                  <p className="text-white/60 text-sm uppercase tracking-wider">Soft® & Square®</p>
                </div>
                <div className="bg-[#120b08] p-8 rounded-[24px] border border-white/5">
                  <h3 className="text-[#f29d38] text-4xl font-serif mb-2">Top</h3>
                  <p className="text-white/60 text-sm uppercase tracking-wider">Chất Lượng ĐNA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-[#120b08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">Bộ Sưu Tập Nổi Bật</h2>
              <p className="text-white/60 max-w-xl">Những thiết kế biểu tượng làm nên tên tuổi Carpets Inter, sẵn sàng kiến tạo điểm nhấn cho dự án của bạn.</p>
            </div>
            <Link to="/collections" className="hidden sm:flex items-center space-x-2 text-[#f29d38] hover:text-[#ffbe63] transition-colors">
              <span className="uppercase tracking-wider text-sm font-medium">Xem tất cả</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-[24px] overflow-hidden bg-[#19110d] border border-white/5"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={collection.heroImage} 
                    alt={collection.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120b08] to-transparent opacity-80" />
                </div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <p className="text-[#f29d38] text-xs uppercase tracking-widest font-medium mb-2">
                    Collection
                  </p>
                  <h3 className="text-2xl font-serif text-white mb-2">{collection.name}</h3>
                  <p className="text-white/70 text-sm line-clamp-2 mb-6">
                    {collection.tagline}
                  </p>
                  
                  <Link 
                    to={`/collections/${collection.id}`}
                    className="inline-flex items-center space-x-2 text-white hover:text-[#f29d38] transition-colors w-fit"
                  >
                    <span className="uppercase tracking-wider text-xs font-medium">Chi tiết</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
             <Link to="/collections" className="inline-flex items-center space-x-2 text-[#f29d38] hover:text-[#ffbe63] transition-colors">
              <span className="uppercase tracking-wider text-sm font-medium">Xem tất cả bộ sưu tập</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
