import { AppHeader } from '@/components/ui/app-header';
import { RouteNavigation } from '@/components/ui/route-navigation';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  ClipboardPlusIcon,
  FileStackIcon,
  GaugeIcon,
  GraduationCapIcon,
  UsersIcon,
} from 'lucide-react';
import { ReactNode } from 'react';

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen bg-primary overflow-clip">
      <AppHeader />
      <ReactQueryDevtools />
      <div className="flex flex-1">
        <RouteNavigation tabs={tabs} />
        <main className="flex-1 rounded-tl outline bg-white outline-accent-secondary flex flex-grow overflow-hidden h-full">
          {children}
        </main>
      </div>
    </div>
  );
}

const tabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <GaugeIcon size={20} />,
    href: '/dashboard',
  },
  {
    id: 'Evaluate',
    label: 'Evaluate',
    icon: <ClipboardPlusIcon size={20} />,
    href: '/evaluate',
  },
  {
    id: 'forms',
    label: 'Forms',
    icon: <FileStackIcon size={20} />,
    href: '/forms',
  },
  {
    id: 'programs',
    label: 'Reports',
    icon: <UsersIcon size={20} />,
    href: '/programs',
  },
  {
    id: 'programs',
    label: 'Programs',
    icon: <GraduationCapIcon size={20} />,
    href: '/reports',
  },
];
