import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MainNav from './main-nav';
import Menu from '@/components/shared/header/menu';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrapper">
      <div className="ss_wrapper">
        <div className="border-b">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex-start">
              <Image src="/assets/icons/logo.png" width={512} height={512} alt={`${APP_NAME} logo`} className="h-10 w-10" />
              {/* {APP_NAME.slice(1)} */}
            </Link>
            <MainNav className="ms-6 md:ms-24" />
            <div className="ml-auto flex items-center">
              <Menu />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 pt-6">{children}</div>
      </div>
    </div>
  );
}
