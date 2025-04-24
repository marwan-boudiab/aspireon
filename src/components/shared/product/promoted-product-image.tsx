'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PromotedProductImageProps {
  src: string;
  alt: string;
  salePercentage: number;
}

const PromotedProductImage = ({ src, alt, salePercentage }: PromotedProductImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex flex-col items-center">
      {isLoading && (
        <Skeleton className="h-[19rem] w-[300px] rounded-full" />
      )}
      <Image 
        className={`max-h-[19rem] rounded-full border-2 object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`} 
        alt={alt} 
        width={300} 
        height={200} 
        src={src}
        onLoad={() => setIsLoading(false)}
      />
      <p className="bg-tertiary absolute left-2 top-2 ml-auto rounded-full border-2 bg-primary px-2 py-1 text-xs font-medium text-white sm:left-4 sm:top-4 sm:text-sm">{salePercentage}% OFF</p>
    </div>
  );
};

export default PromotedProductImage;