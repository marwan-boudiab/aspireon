import { Button } from '@/components/ui/button';
import { getClosestPromotedProduct } from '@/lib/actions/product.actions';
import { Gift, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import CountdownTimer from './promotion-countdown';
import PromotedProductImage from './promoted-product-image';

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
          <PromotedProductImage 
            src={product.images[0]} 
            alt={product.name} 
            salePercentage={product.salePercentage} 
          />
        ) : (
          <p>Loading promoted product...</p>
        )}
      </div>
    </section>
  );
};

export default ProductPromotion;
