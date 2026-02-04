import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { HeaderTime } from './HeaderTime';
import { MobileMenuProvider } from '@/contexts/MobileMenuContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <MobileMenuProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <HeaderTime />
        <main className="flex-1 md:pt-[calc(3rem+5rem)]">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </MobileMenuProvider>
  );
}
