import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileMenuProvider } from '@/contexts/MobileMenuContext';
import { cn } from '@/lib/utils';
import { DailyDealBar } from './DailyDealBar';
import { WhatsAppButton } from './WhatsAppButton';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <MobileMenuProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <DailyDealBar />
        <Header />
        <main
          className={cn(
            'flex-1',
            !isHomePage && 'pt-[calc(var(--daily-deal-bar-height)+6rem)]',
          )}
        >
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <CartDrawer />
      </div>
    </MobileMenuProvider>
  );
}
