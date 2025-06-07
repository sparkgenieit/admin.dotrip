'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token && pathname !== '/login') {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [pathname]);

  if (!ready && pathname !== '/login') {
    return null; // Or show loader here
  }

  return <>{children}</>;
}
