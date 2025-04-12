import { auth } from '@/auth';
import DeleteDialog from '@/components/shared/admin/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions';
import { APP_NAME } from '@/lib/constants';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Captions, Package } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: `Admin Orders - ${APP_NAME}` };

export default async function OrdersPage({ searchParams: { page = '1' } }: { searchParams: { page: string } }) {
  // GET SESSION
  const session = await auth();
  // CHECK IF USER IS ADMIN
  if (session?.user.role !== 'admin') throw new Error('admin permission required');
  // GET ORDERS PAGINATED
  const orders = await getAllOrders({ page: Number(page) });

  return (
    <>
      <h1 className="h2-bold py-4 text-center">Orders</h1>
      {!orders || orders.data.length === 0 ? (
        <>
          <div className="mt-12 flex flex-col items-center justify-center">
            <div className="text-center">
              <Package className="mx-auto mb-4 h-24 w-24" />
              <h1 className="mb-2 text-2xl font-bold text-primary">There are no orders</h1>
              <p className="mb-8">Looks like no orders have been placed yet.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          {orders.totalPages > 1 && (
            <div className="sticky top-0 z-50">
              <div className="flex-center py-2">
                <div className="w-fit rounded-full border-2 bg-secondary p-1">
                  <Pagination page={page} totalPages={orders?.totalPages} />
                </div>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>BUYER</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>PAID</TableHead>
                  <TableHead>DELIVERED</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{formatId(order.id)}</TableCell>
                    <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                    <TableCell>{order.user ? order.user.name : 'Deleted user'}</TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'not paid'}</TableCell>
                    <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'not delivered'}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-start gap-2">
                        <Link href={`/order/${order.id}`}>
                          <Button size="icon" variant="outline">
                            <Captions />
                          </Button>
                        </Link>
                        <DeleteDialog id={order.id} action={deleteOrder} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* {orders.totalPages > 1 && <Pagination page={page} totalPages={orders?.totalPages!} />} */}
            {/* {orders.totalPages > 1 && <Pagination page={page} totalPages={orders?.totalPages} />} */}
          </div>
        </div>
      )}
    </>
  );
}
