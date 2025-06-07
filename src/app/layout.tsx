'use client';

import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import AuthWrapper from '@/components/AuthWrapper';
import { useUser } from '@/hooks/useUser';   // <— our new hook

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { role } = useUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />

        <AuthWrapper requiredRoles={['SUPER_ADMIN','ADMIN','VENDOR','DRIVER']}>
          <div className="flex flex-1">
            <Sidebar role={role} />
            <main className="flex-1 p-4 overflow-auto">
              {children}
            </main>
          </div>
        </AuthWrapper>

        <Footer />
      </body>
    </html>
  );
}
