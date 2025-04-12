import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMyOrders } from '@/lib/actions/order.actions';
import { APP_NAME } from '@/lib/constants';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ArrowRight, Captions, Package } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: `My Orders - ${APP_NAME}` };
export default async function OrdersPage({ searchParams }: { searchParams: { page: string } }) {
  const page = Number(searchParams.page) || 1;
  const orders = await getMyOrders({ page, limit: 6 });
  return (
    <>
      <h2 className="h2-bold py-4 text-center">Orders</h2>

      {!orders || orders.data.length === 0 ? (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <Package className="mx-auto mb-4 h-24 w-24" />
              <h1 className="mb-2 text-2xl font-bold text-primary">You have no orders</h1>
              <p className="mb-8">Looks like you haven&apos;t placed any orders yet.</p>
              <Button className="inline-flex items-center">
                <Link href="/" className="flex items-center">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="overflow-x-auto">
          <Table className="whitespace-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PAID</TableHead>
                <TableHead>DELIVERED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id.substring(20, 24)}</TableCell>
                  <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'not paid'}</TableCell>
                  <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'not delivered'}</TableCell>
                  <TableCell>
                    <Link href={`/order/${order.id}`}>
                      <Button size="icon" variant="outline">
                        <Captions />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* {orders.totalPages > 1 && <Pagination page={page} totalPages={orders?.totalPages!} />} */}
          {orders.totalPages > 1 && <Pagination page={page} totalPages={orders?.totalPages} />}
        </div>
      )}
    </>
  );
}
