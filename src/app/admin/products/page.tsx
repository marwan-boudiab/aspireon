import DeleteDialog from '@/components/shared/admin/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteProduct, getAllProducts } from '@/lib/actions/product.actions';
import { APP_NAME } from '@/lib/constants';
import { formatCurrency, formatId } from '@/lib/utils';
import { PackageX, Pencil } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: `Admin Products - ${APP_NAME}` };

export default async function AdminProductsPage({ searchParams }: { searchParams: { page: string; query: string; category: string } }) {
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';
  const products = await getAllProducts({ query: searchText, category, page });
  return (
    <>
      <h1 className="h2-bold py-4 text-center">Products</h1>
      {!products || products.data.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <PackageX className="mx-auto mb-4 h-24 w-24" />
            <h1 className="mb-2 text-2xl font-bold text-primary">There are no products</h1>
            <p className="mb-8">Looks like you have not added any products yet.</p>
            <Button asChild variant="default">
              <Link href="/admin/products/create">Create Product</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="sticky top-0 z-50">
            <div className="flex-between py-2">
              <Button asChild variant="default">
                <Link href="/admin/products/create">Create Product</Link>
              </Button>
              <div className="w-fit rounded-full border-2 bg-secondary p-1">{products?.totalPages > 1 && <Pagination page={page} totalPages={products?.totalPages} />}</div>
            </div>
          </div>
          {/* <div className="flex-between">
            <Button asChild variant="default">
              <Link href="/admin/products/create">Create Product</Link>
            </Button>
            {products?.totalPages > 1 && <Pagination page={page} totalPages={products?.totalPages} />}
          </div> */}
          {/* {products?.totalPages! > 1 && <Pagination page={page} totalPages={products?.totalPages!} />} */}
          <div>
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead>PRICE</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead>STOCK</TableHead>
                  <TableHead>RATING</TableHead>
                  <TableHead className="w-[100px]">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{formatId(product.id)}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.rating}</TableCell>
                    <TableCell>
                      <div className="flex-start gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button size="icon" variant="outline">
                            <Pencil />
                          </Button>
                        </Link>
                        <DeleteDialog id={product.id} action={deleteProduct} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
