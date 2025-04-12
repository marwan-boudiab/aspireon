'use client';

import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { approvePayPalOrder, createPayPalOrder, deliverOrder, updateOrderToPaidByCOD } from '@/lib/actions/order.actions';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import StripePayment from './stripe-payment';
import CancelOrderButton from '@/components/shared/checkout/cancel-order-button';

export default function OrderDetailsForm({ order, paypalClientId, isAdmin, stripeClientSecret }: { order: Order; paypalClientId: string; isAdmin: boolean; stripeClientSecret: string | null }) {
  const { shippingAddress, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentMethod, isPaid, paidAt, isDelivered, deliveredAt } = order;

  const { toast } = useToast();

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    if (!isPending && !isRejected) return null;
    const status = isPending ? 'Loading PayPal' : 'Error in loading PayPal';
    const className = `rounded-full border-2 px-2 py-1 ${isRejected ? 'bg-destructive' : ''}`;
    return <div className={className}>{status}</div>;
  }
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);
    if (!res.success) return toast({ title: 'Unable to create PayPal order', description: res.message, variant: 'destructive' });
    return res.data;
  };
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);
    toast({ title: res.success ? 'PayPal order approved' : 'Unable to approve PayPal order', description: res.message, variant: res.success ? 'default' : 'destructive' });
  };

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidByCOD(order.id);
            toast({ title: res.success ? 'Order Marked As Paid' : 'Unable to mark order as paid', variant: res.success ? 'default' : 'destructive', description: res.message });
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Paid'}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            toast({ title: res.success ? 'Order Delivered' : 'Unable to mark order as delivered', variant: res.success ? 'default' : 'destructive', description: res.message });
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Delivered'}
      </Button>
    );
  };

  const isOrderCancelable = () => {
    if (isPaid || isDelivered) return false;
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursPassed = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    return hoursPassed <= 24;
  };

  return (
    <div className="ss_wrapper">
      <h1 className="py-4 text-2xl"> Order {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-4">
        <div className="space-y-4 overflow-x-auto md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="gap-4 p-4">
                <h2 className="pb-4 text-xl">Payment Method</h2>
                <p>{paymentMethod}</p>
                <div className="mt-2">{isPaid ? <Badge variant="secondary">Paid at {formatDateTime(paidAt!).dateTime}</Badge> : <Badge variant="destructive">Not paid</Badge>}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="gap-4 p-4">
                <h2 className="pb-4 text-xl">Shipping Address</h2>
                <p>{shippingAddress.fullName}</p>
                <p>
                  {shippingAddress.streetAddress}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}{' '}
                </p>
                <div className="mt-2 flex flex-col gap-y-2">
                  <Button asChild variant="outline">
                    <a target="_new" href={`https://maps.google.com?q=${shippingAddress.lat},${shippingAddress.lng}`}>
                      Show on Map
                    </a>
                  </Button>

                  <div className="mt-auto">{isDelivered ? <Badge variant="secondary">Delivered at {formatDateTime(deliveredAt!).dateTime}</Badge> : <Badge variant="destructive">Not delivered</Badge>}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`} className="flex items-center">
                          <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-lg" />
                          <span className="hidden px-2 sm:table-cell">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>
                        <span>{item.qty}</span>
                      </TableCell>
                      <TableCell>${item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="pt-4 md:pt-0">
          <Card>
            <CardContent className="gap-4 space-y-2 p-4">
              <h2 className="pb-4 text-xl">Order Summary</h2>
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {!isPaid && paymentMethod === 'PayPal' && (
                <div className="flex justify-center">
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons createOrder={handleCreatePayPalOrder} onApprove={handleApprovePayPalOrder} />
                  </PayPalScriptProvider>
                </div>
              )}
              {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && <StripePayment priceInCents={Number(order.totalPrice) * 100} orderId={order.id} clientSecret={stripeClientSecret} />}
              {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                <div className="flex justify-center">
                  <MarkAsPaidButton />
                </div>
              )}
              <div className="flex justify-center">{isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}</div>
              <div className="flex justify-center">
                {isOrderCancelable() && (
                  <div className="mt-4">
                    <CancelOrderButton orderId={order.id} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
