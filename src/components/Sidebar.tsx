// components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinkItem = { href: string; label: string; roles?: string[] };

const mainLinks: LinkItem[] = [
  { href: '/',             label: 'Dashboard' },
  { href: '/drivers',      label: 'Drivers',   roles: ['DRIVER','VENDOR','ADMIN','SUPER_ADMIN'] },
  { href: '/vehicles',      label: 'Vehicles',   roles: ['DRIVER','VENDOR','ADMIN','SUPER_ADMIN'] },
  
  { href: '/bookings',     label: 'Bookings',  roles: ['ADMIN','SUPER_ADMIN'] },
  { href: '/users',        label: 'Users',     roles: ['ADMIN','SUPER_ADMIN'] },
  { href: '/addresses',    label: 'Addresses', roles: ['ADMIN','SUPER_ADMIN'] },
];

const masterLinks: LinkItem[] = [
  { href: '/cities',     label: 'Cities'     },
  { href: '/trip-types', label: 'Trip Types' },

];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const isDev   = process.env.NEXT_PUBLIC_DEV === 'true';

  const render = (links: LinkItem[]) =>
    links
      .filter(l => isDev || !l.roles || l.roles.includes(role))
      .map(l => (
        <li key={l.href} className={pathname.startsWith(l.href) ? 'font-bold' : ''}>
          <Link href={l.href}>{l.label}</Link>
        </li>
      ));

  return (
    <aside className="p-4 w-60 bg-gray-100">
      <ul className="space-y-2">{render(mainLinks)}</ul>
      <hr className="my-4" />
      <h3 className="text-sm uppercase text-gray-500 mb-2">Master Data</h3>
      <ul className="space-y-2">{render(masterLinks)}</ul>
    </aside>
  );
}
