import { AppHeader } from '@/components/ui/app-header';
import { RouteNavigation } from '@/components/ui/route-navigation';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  ClipboardPlusIcon, FileChartColumnIcon,
  FileStackIcon,
  GaugeIcon,
  GraduationCapIcon,
  UsersIcon,
} from 'lucide-react';
import { ReactNode } from 'react';

const tabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <GaugeIcon size={20} />,
    href: '/dashboard',
  },
  {
    id: 'forms',
    label: 'Forms',
    icon: <FileStackIcon size={20} />,
    href: '/forms',
  },
  {
    id: 'assessments',
    label: 'Assessments',
    icon: <FileChartColumnIcon size={20} />,
    href: '/assessments',
  },
  {
    id: 'Evaluate',
    label: 'Evaluate',
    icon: <ClipboardPlusIcon size={20} />,
    href: '/evaluate',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <UsersIcon size={20} />,
    href: '/reports',
  },
  {
    id: 'programs',
    label: 'Programs',
    icon: <GraduationCapIcon size={20} />,
    href: '/programs',
  },
];

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-row h-screen bg-primary overflow-clip">
      <RouteNavigation tabs={tabs} />
      <ReactQueryDevtools />
      <div className="flex flex-col flex-1">
        <AppHeader />
        <main className="flex-1 rounded-tl outline bg-neutral-50 outline-accent-secondary flex flex-grow overflow-hidden h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
