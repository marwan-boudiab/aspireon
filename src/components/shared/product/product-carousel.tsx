'use client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCarousel({ data }: { data: Product[] }) {
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  const handleImageLoad = (productId: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  return (
    <Carousel className="w-full rounded-lg" opts={{ loop: true }} plugins={[Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })]}>
      <CarouselContent>
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative rounded-lg border-2 w-full pt-[56.25%]">
                {!imagesLoaded[product.id] && (
                  <Skeleton className="absolute inset-0 h-full w-full rounded-lg" />
                )}
                <Image
                  alt={product.name}
                  src={product.banner!}
                  fill
                  className="rounded-lg object-cover"
                  onLoad={() => handleImageLoad(product.id)}
                  style={{ opacity: imagesLoaded[product.id] ? 1 : 0 }}
                />
                <div className="absolute bottom-2 left-2 right-4 w-auto rounded-full border-2 bg-secondary p-2 opacity-80">
                  <h2 className="sm:text-md truncate text-center text-xs font-bold text-white">{product.name}</h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}
