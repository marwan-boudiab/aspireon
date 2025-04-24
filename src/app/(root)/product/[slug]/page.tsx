import { notFound } from 'next/navigation';
import ProductImages from '@/components/shared/product/product-images';
import ProductPrice from '@/components/shared/product/product-price';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { APP_NAME } from '@/lib/constants';
import AddToCart from '@/components/shared/product/add-to-cart';
import { getMyCart } from '@/lib/actions/cart.actions';
import { round2 } from '@/lib/utils';
import ReviewList from './review-list';
import { auth } from '@/auth';
import Rating from '@/components/shared/product/rating';
import SizeSelector from './size-selector';
import TruncatedDescription from '@/components/shared/product/truncated-description';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Product not found' };
  }
  return {
    title: `${product.name} - ${APP_NAME}`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ${APP_NAME}`,
      description: product.description,
      images: product.images && product.images.length > 0 ? [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${APP_NAME}`,
      description: product.description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

const ProductDetails = async ({ params: { slug } }: { params: { slug: string } }) => {
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const { id, brand, name, category, images, sizes, description, stock, salePercentage, rating, numReviews } = product;
  const price = parseFloat(product.price);
  const discountedPrice = parseFloat((salePercentage > 0 ? price * (1 - salePercentage / 100) : price).toFixed(2));
  const cart = await getMyCart();
  const session = await auth();

  return (
    <div className="px-5 md:px-0">
      <section className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Sticky Product Images (Only on large screens and above) */}
          <div className="col-span-2 self-start lg:sticky lg:top-4">
            <ProductImages images={images!} />
          </div>

          <div className="col-span-3">
            <div className="flex w-full flex-col gap-x-2 gap-y-4 pb-5 pl-0 pt-5 sm:flex-row lg:pl-6 lg:pt-0">
              <div className="flex flex-col gap-6">
                <p className="p-medium-16 bg-grey-500/10 text-grey-500 w-fit rounded-full border-2 bg-secondary p-2">
                  {brand} {category}
                </p>
                <h1 className="h3-bold max-w-md">{name}</h1>
                <Rating value={Number(rating)} caption={`${numReviews} reviews`} />

                <div className="flex gap-3 sm:flex-row sm:items-center">
                  {/* <div className="flex gap-3">
                    <ProductPrice value={Number(price)} className="p-bold-20 rounded-full border-2 bg-[#41B3A2] px-3 py-1 text-white" />
                  </div> */}
                  <div className="flex-row items-center justify-end">
                    {salePercentage > 0 && (
                      <div className="me-2">
                        <p className="text-xs font-medium text-[#c9c9ce] line-through dark:text-[#68686b] sm:text-sm">${Number(price).toFixed(2)}</p>
                      </div>
                    )}
                    <ProductPrice value={discountedPrice} />
                  </div>
                  {salePercentage > 0 && <p className="bg-tertiary h-fit rounded-full border-2 bg-primary px-2 py-1 text-xs font-medium text-white sm:text-sm">{salePercentage}% OFF</p>}
                </div>
                <SizeSelector sizes={sizes} productSlug={slug} />
              </div>

              {/* Sticky Card (Only on large screens and above) */}
              <div className="mx-auto w-full min-w-52 self-start sm:mr-0 sm:w-auto lg:sticky lg:top-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 flex justify-between">
                      <div>Price</div>
                      <div>
                        <ProductPrice value={discountedPrice} />
                      </div>
                    </div>
                    <div className="mb-2 flex justify-between">
                      <div>Status</div>
                      {stock > 0 ? <Badge variant="outline">In stock</Badge> : <Badge variant="destructive">Unavailable</Badge>}
                    </div>
                    {stock !== 0 && (
                      <div className="flex-center">
                        <AddToCart cart={cart} item={{ productId: id, name: name, slug: slug, price: round2(discountedPrice), qty: 1, image: images![0] }} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="pl-0 lg:pl-6">
              <TruncatedDescription description={description} />
            </div>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold mb-5">Customer Reviews</h2>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain */}
        <ReviewList productId={id} productSlug={slug} userId={session?.user.id!} />
      </section>
    </div>
  );
};

export default ProductDetails;
