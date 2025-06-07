'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinkItem = { href: string; label: string; roles?: string[] };

const mainLinks: LinkItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/drivers',   label: 'Drivers',     roles: ['DRIVER','VENDOR','ADMIN','SUPER_ADMIN'] },
  { href: '/admin/bookings',  label: 'Bookings',    roles: ['ADMIN','SUPER_ADMIN'] },
  { href: '/admin/users',     label: 'Users',       roles: ['ADMIN','SUPER_ADMIN'] },
  { href: '/admin/addresses', label: 'Addresses',   roles: ['ADMIN','SUPER_ADMIN'] },
  // …etc…
];

const masterLinks: LinkItem[] = [
  { href: '/admin/cities',     label: 'Cities'     },
  { href: '/admin/trip-types', label: 'Trip Types' },
  { href: '/admin/vehicles',   label: 'Vehicles'   },
  // …etc…
];

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  // toggle this on in .env.local: NEXT_PUBLIC_DEV=true
  const isDev = process.env.NEXT_PUBLIC_DEV === 'true';

  const renderLinks = (links: LinkItem[]) =>
    links
      .filter(link =>
        // always show everything in dev, otherwise fall back to role-based
        isDev || !link.roles || link.roles.includes(role)
      )
      .map(link => (
        <li
          key={link.href}
          className={pathname?.startsWith(link.href) ? 'font-bold' : ''}
        >
          <Link href={link.href}>{link.label}</Link>
        </li>
      ));

  return (
    <aside className="p-4 w-60 bg-gray-100">
      <ul className="space-y-2">{renderLinks(mainLinks)}</ul>
      <hr className="my-4" />
      <h3 className="text-sm uppercase text-gray-500 mb-2">Master Data</h3>
      <ul className="space-y-2">{renderLinks(masterLinks)}</ul>
    </aside>
  );
}
