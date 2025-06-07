import { ReactNode } from 'react';

export const metadata = {
  title: 'CIties | DoTrip Admin',
  description: 'Manage your cities.',
};

export default function CitiesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
