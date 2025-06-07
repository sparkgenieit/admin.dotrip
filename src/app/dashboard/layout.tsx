import { ReactNode } from 'react';

export const metadata = {
  title: 'Dashboard  | eCom Furniture Admin',
  description: 'View Dashboard.',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
