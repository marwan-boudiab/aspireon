import Pagination from '@/components/shared/pagination';
import ProductCard from '@/components/shared/product/product-card';
// import { Button } from '@/components/ui/button';
import { getAllCategories, getAllProducts } from '@/lib/actions/product.actions';
import { APP_NAME } from '@/lib/constants';
// import Link from 'next/link';
import FilterSelections from './filterSelections';
import { PackageX } from 'lucide-react';

export async function generateMetadata({ searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' } }: { searchParams: { q: string; category: string; price: string; rating: string; sort: string; page: string } }) {
  if ((q !== 'all' && q !== '') || category !== 'all' || rating !== 'all' || price !== 'all') {
    return {
      title: `Search ${q !== 'all' ? q : ''} ${category !== 'all' ? ` : Category ${category}` : ''} ${price !== 'all' ? ` : Price ${price}` : ''} ${rating !== 'all' ? ` : Rating ${rating}` : ''} - ${APP_NAME}`,
    };
  } else {
    return {
      title: `Search Products - ${APP_NAME}`,
    };
  }
}

export default async function SearchPage({ searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all', sort = 'newest', page = '1' } }: { searchParams: { q: string; category: string; price: string; rating: string; sort: string; page: string } }) {
  // const getFilterUrl = ({ c, s, p, r, pg }: { c?: string; s?: string; p?: string; r?: string; pg?: string }) => {
  //   const params = { q, category, price, rating, sort, page };
  //   if (c) params.category = c;
  //   if (p) params.price = p;
  //   if (r) params.rating = r;
  //   if (pg) params.page = pg;
  //   if (s) params.sort = s;
  //   return `/store?${new URLSearchParams(params).toString()}`;
  // };
  const categories = await getAllCategories();
  let products = await getAllProducts({ category, query: q, price, rating, page: Number(page), sort });

  // If the requested page has no products but is greater than 1, fetch from page 1
  if (products.data.length === 0 && Number(page) > 1) {
    products = await getAllProducts({ category, query: q, price, rating, page: 1, sort });
  }

  return (
    <div className="ss_wrapper flex flex-col gap-x-3 md:flex-row">
      {/* Sidebar Filters */}
      <div className="mx-2 mt-4 h-fit rounded-lg border-2 bg-secondary p-3 sm:mx-0 md:sticky md:top-2 md:w-1/5">
        <FilterSelections q={q} categories={categories} currentCategory={category} currentPrice={price} currentRating={rating} currentSort={sort} />
      </div>

      {/* Main Content */}
      <div className="my-3 w-full md:w-3/4">
        {/* Create a container for sticky pagination */}
        <div className="sticky top-2 z-50 bg-transparent">
          {/* <div className="flex-between flex-col gap-y-2 py-4 md:flex-row">
            {q !== 'all' && q !== '' && 'Query : ' + q}
            {category !== 'all' && category !== '' && '   Category : ' + category}
            {price !== 'all' && '    Price: ' + price}
            {rating !== 'all' && '    Rating: ' + rating + ' & up'}
            &nbsp;
            {(q !== 'all' && q !== '') || (category !== 'all' && category !== '') || rating !== 'all' || price !== 'all' ? (
              <Button className="" variant={'link'} asChild>
                <Link href="/store">Clear</Link>
              </Button>
            ) : null}
          </div> */}
          {/* <div>{products!.totalPages! > 1 && <Pagination page={page} totalPages={products!.totalPages} />}</div> */}
          {products!.totalPages! > 1 && (
            <div className="sticky top-0 z-10 mx-auto mb-3 w-fit rounded-full border-2 bg-secondary p-1">
              <Pagination page={page} totalPages={products!.totalPages} />
            </div>
          )}
          {/* <div className="rounded-lg border-2 bg-secondary p-2 text-white">
            Sort by
            {sortOrders.map((s) => (
              <Link key={s} className={`mx-2 ${sort == s && 'text-primary'} `} href={getFilterUrl({ s })}>
                {s}
              </Link>
            ))}
          </div> */}
        </div>

        <div className="grid grid-cols-2 justify-items-center gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products!.data.length === 0 && (
            <div className="col-span-full mt-12 flex flex-col items-center justify-center">
              <div className="w-full text-center">
                <PackageX className="mx-auto mb-4 h-24 w-24" />
                <h1 className="mb-2 text-2xl font-bold text-primary">No Products Found</h1>
                {/* <p className="mb-8"></p> */}
              </div>
            </div>
          )}
          {products!.data.map((product) => (
            <ProductCard key={product.id} product={product} resize />
          ))}
        </div>
      </div>
    </div>
  );
}
