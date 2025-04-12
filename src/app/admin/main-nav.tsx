'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const links = [
  { title: 'Overview', href: '/admin/overview' },
  { title: 'Products', href: '/admin/products' },
  { title: 'Orders', href: '/admin/orders' },
  { title: 'Users', href: '/admin/users' },
  // {
  //   title: 'Settings',
  //   href: '/admin/settings',
  // },
];

export default function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const router = useRouter(); // Use useRouter for navigation

  const handleSelectChange = (value: string) => {
    router.push(value); // Programmatically navigate to the selected page
  };

  return (
    <nav className={cn('flex items-center', className)} {...props}>
      {/* Select for small screens */}
      <div className="sm:hidden">
        <Select onValueChange={handleSelectChange} name="menu">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Menu" />
          </SelectTrigger>
          <SelectContent>
            {links.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Regular links for larger screens */}
      <div className="hidden items-center space-x-4 sm:flex lg:space-x-6">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className={cn('text-sm font-medium transition-colors hover:text-primary', pathname.includes(item.href) ? 'text-primary' : 'text-muted-foreground')}>
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
