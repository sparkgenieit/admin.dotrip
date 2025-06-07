'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]); // re-check token on route change

  const isLoginPage = pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
       <Header />
      <div className="flex flex-1">
        {isLoggedIn && !isLoginPage && <Sidebar />}
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
      {isLoggedIn && !isLoginPage && <Footer />}
    </div>
  );
}
