'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
    } else {
      setCheckingAuth(false); // allow content rendering
    }
  }, []);

  if (checkingAuth) return null; // or a loader

  return (
    <div>
      {/* Protected content goes here */}
      <h1>Welcome to the Dashboard</h1>
    </div>
  );
}
