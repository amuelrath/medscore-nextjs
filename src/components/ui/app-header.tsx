'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { breadcrumbsAtom } from '@/store/global-atoms';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import LOGO from 'public/logo-reversed.svg';
import { Fragment } from 'react';

export function AppHeader() {
  const breadcrumbs = useAtomValue(breadcrumbsAtom);

  return (
    <div className="flex bg-gradient-to-r from-primary from-[75%] to-accent-secondary min-h-10  max-h-10 space-x-6 min-w-screen flex-row items-center border-b border-neutral-300 px-2">
      <Image src={LOGO} alt="logo" width={150} height={75} />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.href}>
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {(breadcrumbs.length === 1 ||
                index !== breadcrumbs.length - 1) && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
