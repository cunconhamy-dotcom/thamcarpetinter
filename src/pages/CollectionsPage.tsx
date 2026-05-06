import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collections } from '../lib/collections';

export function CollectionsPage() {
  return (
    <div className="min-h-screen bg-[#120b08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-serif text-white mb-6">Bộ Sưu Tập</h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Khám phá 9 bộ sưu tập thảm sàn tiêu biểu từ Carpets Inter. Mỗi thiết kế là một câu chuyện riêng, được dệt nên từ cam kết bền vững và tư duy thẩm mỹ vượt thời gian.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col bg-[#19110d] rounded-[24px] border border-white/5 overflow-hidden transition-all hover:border-white/10"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={collection.heroImage} 
                  alt={collection.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#f29d38] transition-colors">
                  {collection.name}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8 flex-1">
                  {collection.tagline}
                </p>
                
                <Link 
                  to={`/collections/${collection.id}`}
                  className="inline-flex items-center justify-between w-full border-t border-white/5 pt-6 text-[#f29d38] hover:text-[#ffbe63] transition-colors group-hover:border-white/10"
                >
                  <span className="uppercase tracking-wider text-xs font-medium">Khám phá ngay</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
