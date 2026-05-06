import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function PageLayout() {
  return (
    <div className="min-h-screen bg-[#120b08] flex flex-col font-sans text-white/90 selection:bg-[#f29d38]/30">
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
