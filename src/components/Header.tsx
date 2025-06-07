'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <header className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between flex-wrap">
      <h1 className="text-lg font-bold">DoTrip Admin</h1>
      <button
        className="md:hidden text-white ml-auto"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
<div className={`${menuOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto mt-2 md:mt-0`}>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded block md:inline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
