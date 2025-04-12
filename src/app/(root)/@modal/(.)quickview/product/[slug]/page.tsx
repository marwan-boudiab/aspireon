import ProductPrice from '@/components/shared/product/product-price';
import QuickViewModalWrapper from '@/components/shared/product/quickview-modal-wrapper';
import Rating from '@/components/shared/product/rating';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ReloadButton from './reload-button';
import { getMyCart } from '@/lib/actions/cart.actions';
import ProductImages from '@/components/shared/product/product-images';
import AddToCart from '@/components/shared/product/add-to-cart';
import SizeSelector from '@/app/(root)/product/[slug]/size-selector';
import { round2 } from '@/lib/utils';

// export default async function StorefrontProductQuickView(props: { params: { slug: string } }) {
export default async function StorefrontProductQuickView({ params: { slug } }: { params: { slug: string } }) {
  const product = await getProductBySlug(slug);
  if (!product) return notFound();
  const { id, name, images, sizes, stock, salePercentage, rating } = product;
  const price = parseFloat(product.price);
  const discountedPrice = parseFloat((salePercentage > 0 ? price * (1 - salePercentage / 100) : price).toFixed(2));
  const cart = await getMyCart();
  return (
    <QuickViewModalWrapper>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center justify-start gap-8 md:grid md:grid-cols-9 md:items-start">
          <div className="w-full md:col-span-5">
            <ProductImages images={images!} />
            {/* <div className="mt-0 hidden lg:mt-4 lg:flex">
              <SizeSelector sizes={product.sizes} currentSize={size} productSlug={slug} />
            </div> */}
          </div>

          <div className="flex w-full flex-col gap-2 md:col-span-4">
            <h3 className="h4-bold">{name}</h3>
            <div className="flex items-center gap-4">
              <Rating value={Number(rating)} />
              {stock > 0 ? (
                // <ProductPrice value={discountedPrice} />
                <div className="flex gap-3 sm:flex-row sm:items-center">
                  {/* <div className="flex gap-3">
                  <ProductPrice value={Number(price)} className="p-bold-20 rounded-full border-2 bg-[#41B3A2] px-3 py-1 text-white" />
                </div> */}
                  <div className="flex-row items-center justify-end">
                    {salePercentage > 0 && (
                      <div className="me-2">
                        <p className="text-xs font-medium text-[#68686b] line-through sm:text-sm">${Number(price).toFixed(2)}</p>
                      </div>
                    )}
                    <ProductPrice value={discountedPrice} />
                  </div>
                  {salePercentage > 0 && <p className="bg-tertiary my-auto h-fit w-fit rounded-full border-2 bg-primary px-2 py-1 text-center text-xs font-medium text-white sm:text-sm">{salePercentage}% OFF</p>}
                </div>
              ) : (
                <p className="rounded-full border-2 bg-destructive px-2 py-1 text-xs font-semibold text-white">Out of Stock</p>
              )}
            </div>
            <div className="my-2">
              <SizeSelector sizes={sizes} productSlug={slug} />
            </div>
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
              {stock !== 0 && (
                <div className="flex-center">
                  <AddToCart cart={cart} item={{ productId: id, name: name, slug: slug, price: round2(discountedPrice), qty: 1, image: images![0] }} />
                </div>
              )}

              <div className="">
                <ReloadButton />
              </div>
            </div>
          </div>
        </div>
        {/* <p>{product.description}</p> */}
      </div>
    </QuickViewModalWrapper>
  );
}
