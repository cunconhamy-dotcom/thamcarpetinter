import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { contactInfo } from '../../lib/collections';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Bộ Sưu Tập', path: '/collections' },
    { name: 'Liên Hệ', path: '/lien-he' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#120b08]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="font-serif text-2xl font-semibold text-[#f29d38] tracking-wider">
              CARPETS INTER
            </span>
            <span className="text-xs text-white/50 tracking-[0.2em] uppercase">
              Vietnam
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm uppercase tracking-wider font-medium transition-colors hover:text-[#f29d38]',
                  location.pathname === link.path
                    ? 'text-[#f29d38]'
                    : 'text-white/70'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Contact CTA */}
          <div className="hidden md:block">
            <a
              href={`tel:${contactInfo.hotline.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center px-4 py-2 border border-[#f29d38]/50 rounded-full text-sm font-medium text-[#f29d38] hover:bg-[#f29d38] hover:text-white transition-all"
            >
              {contactInfo.hotline}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#120b08] border-b border-white/5">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'block px-3 py-4 text-base font-medium uppercase tracking-wider border-b border-white/5',
                  location.pathname === link.path
                    ? 'text-[#f29d38]'
                    : 'text-white/70 hover:text-white'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 px-3">
              <a
                href={`tel:${contactInfo.hotline.replace(/[^0-9]/g, '')}`}
                className="w-full flex justify-center items-center px-4 py-3 border border-[#f29d38]/50 rounded-full text-sm font-medium text-[#f29d38] hover:bg-[#f29d38] hover:text-white transition-all"
              >
                Gọi {contactInfo.hotline}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
