'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { formUrlQuery } from '@/lib/utils';

import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = { page: number | string; totalPages: number; urlParamName?: string };

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({ params: searchParams.toString(), key: urlParamName || 'page', value: pageValue.toString() });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      <Button size="icon" variant="outline" onClick={() => onClick('prev')} disabled={Number(page) <= 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button size={'icon'}>
        {page}/{totalPages}
      </Button>
      <Button size="icon" variant="outline" onClick={() => onClick('next')} disabled={Number(page) >= totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
