'use client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCarousel({ data }: { data: Product[] }) {
  return (
    <Carousel className="w-full rounded-lg" opts={{ loop: true }} plugins={[Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })]}>
      <CarouselContent>
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative w-full pt-[56.25%]">
                <Image
                  alt={product.name}
                  src={product.banner!}
                  fill // Makes the image fill the parent container
                  // objectFit="cover" // Ensures the image covers the entire container without distortion
                  className="rounded-lg border-2 object-cover"
                />
                {/* <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent" /> */}
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
