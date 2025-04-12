import { Button } from '@/components/ui/button';
import { getClosestPromotedProduct } from '@/lib/actions/product.actions';
import { Gift, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from './promotion-countdown';

const ProductPromotion = async () => {
  const data = await getClosestPromotedProduct();
  if (!data) return null;
  const { product, promotion } = data;

  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);

  if (startDate > new Date() || endDate < new Date()) return null;

  return (
    <section className="mt-10 grid grid-cols-1 md:mt-24 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-2">
        <h3 className="text-3xl font-bold">Deal of the Month</h3>
        <p>
          {/* Get ready for a shopping experience like never before with our Deals of the Month! Every purchase comes with exclusive perks and offers, making this month a celebration of savvy choices and amazing deals.{' '} */}
          {promotion.description}
          <span className="flex gap-2">
            <Gift />
            <ShoppingCart />
          </span>
        </p>
        <CountdownTimer endDate={endDate} />
        <div className="mb-6 text-center md:mb-0">
          <Button asChild>
            <Link href={`/product/${product.slug}`}>View product</Link>
          </Button>
        </div>
      </div>

      <div className="ms-0 flex justify-center rounded-lg md:ms-auto">
        {product ? (
          <div className="relative flex flex-col items-center">
            <Image className="max-h-[19rem] rounded-full border-2 object-cover" alt={product.name} width={300} height={200} src={product.images[0]} />
            <p className="bg-tertiary absolute left-2 top-2 ml-auto rounded-full border-2 bg-primary px-2 py-1 text-xs font-medium text-white sm:left-4 sm:top-4 sm:text-sm">{product.salePercentage}% OFF</p>
          </div>
        ) : (
          <p>Loading promoted product...</p>
        )}
      </div>
    </section>
  );
};

export default ProductPromotion;
