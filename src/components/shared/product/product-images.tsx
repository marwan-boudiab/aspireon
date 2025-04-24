'use client';
import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = React.useState(0);
  const [imagesLoaded, setImagesLoaded] = React.useState<boolean[]>(new Array(images.length).fill(false));

  const handleImageLoad = (index: number) => {
    const newLoadedState = [...imagesLoaded];
    newLoadedState[index] = true;
    setImagesLoaded(newLoadedState);
  };

  return (
    <div className="flex gap-4">
      {images.length > 1 && (
        <div className="flex-col">
          {images.map((image, index) => (
            <div key={image} className={cn('xs:w-16 xs:h-16 relative mb-3 h-14 w-14 cursor-pointer overflow-hidden rounded-lg border-2 hover:border-primary sm:h-16 sm:w-16 md:h-24 md:w-24 lg:h-16 lg:w-16 xl:h-16 xl:w-16', current === index && 'border-primary')} onClick={() => setCurrent(index)}>
              {!imagesLoaded[index] && <Skeleton className="absolute inset-0 h-full w-full" />}
              <Image 
                src={image} 
                alt={'image'} 
                fill 
                className="object-cover object-center" 
                onLoad={() => handleImageLoad(index)}
                style={{ opacity: imagesLoaded[index] ? 1 : 0 }}
              />
            </div>
          ))}
        </div>
      )}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2">
        {!imagesLoaded[current] && <Skeleton className="absolute inset-0 h-full w-full" />}
        <Image 
          src={images[current]} 
          alt="product image" 
          fill 
          className="object-cover object-center" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
          onLoad={() => handleImageLoad(current)}
          style={{ opacity: imagesLoaded[current] ? 1 : 0 }}
        />
      </div>
    </div>
  );
}
