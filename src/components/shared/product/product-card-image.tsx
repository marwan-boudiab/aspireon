'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProductCardImage = ({ src, alt, className = '' }: ProductCardImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <Skeleton className="absolute inset-0 h-full w-full rounded-md" />
      )}
      <Image 
        alt={alt} 
        src={src} 
        fill 
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ProductCardImage;