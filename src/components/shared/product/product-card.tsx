// import Image from 'next/image';
// import Link from 'next/link';

// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/button';
// import ProductPrice from './product-price';
// import Rating from './rating';

// const ProductCard = ({ product }: { product: Product }) => {
//   return (
//     <Card className="flex h-full w-full max-w-sm flex-col rounded-lg sm:max-w-xs">
//       <CardHeader className="rounded-lg p-0">
//         <Link href={`/product/${product.slug}`} className="rounded-lg">
//           <div className="relative aspect-square w-full rounded-lg">
//             <Image alt={product.name} className="rounded-md object-cover" src={product.images[0]} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
//           </div>
//         </Link>
//       </CardHeader>
//       <CardContent className="flex flex-grow flex-col p-2 sm:p-4">
//         <div className="grid gap-1 sm:gap-2">
//           <div>
//             <p className="mb-1 text-xs text-foreground">{product.brand}</p>
//           </div>
//           <div>
//             <Link href={`/product/${product.slug}`}>
//               <h2 className="text-[0.7rem] font-medium text-foreground sm:text-sm">{product.name}</h2>
//             </Link>
//           </div>
//         </div>
//         <div className="mt-auto grid gap-1 pt-1 sm:gap-2 sm:pt-2">
//           <div className="flex h-[2rem] items-center justify-between gap-4">
//             <Rating value={Number(product.rating)} responsive />
//             {product.stock > 0 ? <ProductPrice value={Number(product.price)} /> : <p className="text-[0.7rem] text-destructive sm:text-sm">Out of Stock</p>}
//           </div>
//           <Link href={`/quickview/product/${product.slug}`} className="w-full">
//             <Button variant="outline" className="flex h-8 w-full gap-2 text-xs text-foreground sm:h-10 sm:text-sm">
//               <span>Quick View</span>
//             </Button>
//           </Link>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductCard;

import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import ProductPrice from './product-price';
import Rating from './rating';

const ProductCard = ({ product, resize = false }: { product: Product; resize?: boolean }) => {
  const { images, name, slug, brand, rating, stock, salePercentage } = product;
  const price = parseFloat(product.price);
  const discountedPrice = parseFloat((salePercentage > 0 ? price * (1 - salePercentage / 100) : price).toFixed(2));

  return (
    <Card className="relative flex h-full w-full max-w-sm flex-col rounded-[1.2rem] sm:max-w-xs">
      <CardHeader className="rounded-lg p-0">
        <Link href={`/product/${slug}`} className="rounded-lg">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {/* Container for the image */}
            <div className="image-container relative h-full w-full">
              <Image alt={name} className="transform rounded-md object-cover transition-transform duration-300 ease-in-out hover:scale-110" src={images[0]} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col p-2 sm:p-4">
        <div className="grid gap-1 sm:gap-2">
          <div>
            <p className="mb-1 text-xs text-foreground">{brand}</p>
          </div>
          <div>
            <Link href={`/product/${slug}`}>
              <h2 className={`text-[0.71rem] font-medium text-foreground ${!resize ? 'sm:text-sm' : 'xl:text-sm'}`}>{name}</h2>
            </Link>
          </div>
        </div>
        <div className="mt-auto grid gap-1 pt-1 sm:gap-2 sm:pt-2">
          <Rating value={Number(rating)} responsive />
          {stock > 0 ? (
            <div className="ms-auto flex items-center justify-end">
              {salePercentage > 0 && (
                <div className="me-2">
                  <p className="text-xs font-medium text-[#c9c9ce] line-through dark:text-[#68686b] sm:text-sm">${Number(price).toFixed(2)}</p>
                  <p className="bg-tertiary absolute left-2 top-2 ml-auto rounded-full border-2 bg-primary px-2 py-1 text-xs font-medium text-white sm:left-4 sm:top-4 sm:text-sm">{salePercentage}% OFF</p>
                </div>
              )}
              <ProductPrice value={discountedPrice} />
            </div>
          ) : (
            <p className="ms-auto rounded-full border-2 bg-destructive px-2 py-1 text-xs font-semibold text-white">Out of Stock</p>
          )}
          <Link href={`/quickview/product/${slug}`} className="w-full" scroll={false}>
            <Button variant="outline" className="flex h-8 w-full gap-2 text-xs text-foreground sm:h-10 sm:text-sm">
              <span>Quick View</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
