import { getFeaturedProducts, getLatestProducts, getOnSaleProducts } from '@/lib/actions/product.actions';
import { Button } from '@/components/ui/button';
import { APP_SUBTITLE, APP_TITLE } from '@/lib/constants';
import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import ProductPromotion from '@/components/shared/product/product-promotion';
import EcommerceFeatures from '@/components/shared/product/ecommerce-features';
import Link from 'next/link';

export default async function Home() {
  // GET FEATURED PRODUCTS
  const featuredProducts = await getFeaturedProducts();
  // GET LATEST PRODUCTS
  const latestProducts = await getLatestProducts();
  // GET ON SALE PRODUCTS
  const onSaleProducts = await getOnSaleProducts();
  return (
    <div className="ss_wrapper mt-10 md:mt-24">
      <section className="w-full">
        <div className="grid items-center gap-6 text-left lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">{APP_TITLE}</h1>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">{APP_SUBTITLE}</p>
            <Link href="/store" className="inline-block">
              <Button>Shop Now</Button>
            </Link>
          </div>
          <div>{featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}</div>
        </div>
      </section>
      <>
        <ProductList title="Newest Arrivals" data={latestProducts} />
        <ProductPromotion />
        <ProductList title="Special Discounts" data={onSaleProducts} />
        <EcommerceFeatures />
      </>
    </div>
  );
}
