import { auth } from '@/auth';
import CheckoutSteps from '@/components/shared/checkout/checkout-steps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { APP_NAME } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PlaceOrderForm from './place-order-form';
import { Pencil } from 'lucide-react';

export const metadata = { title: `Place Order - ${APP_NAME}` };

export default async function PlaceOrderPage() {
  const cart = await getMyCart();
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const user = await getUserById(session?.user.id!);
  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping-address');
  if (!user.paymentMethod) redirect('/payment-method');

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-center text-2xl">Place Order</h1>
      <div className="ss_wrapper grid md:grid-cols-3 md:gap-4">
        <div className="space-y-4 overflow-x-auto md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="gap-4 p-4">
                <div className="relative">
                  <Link href="/shipping-address" className="absolute right-0 top-0">
                    <Button size={'icon'} variant="outline">
                      <Pencil />
                    </Button>
                  </Link>
                </div>
                <h2 className="pb-4 text-xl">Shipping Address</h2>
                <p>{user.address.fullName}</p>
                <p>
                  {user.address.streetAddress}, {user.address.city}, {user.address.postalCode}, {user.address.country}{' '}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="gap-4 p-4">
                <div className="relative">
                  <Link href="/payment-method" className="absolute right-0 top-0">
                    <Button size={'icon'} variant="outline">
                      <Pencil />
                    </Button>
                  </Link>
                </div>
                <h2 className="pb-4 text-xl">Payment Method</h2>
                <p>{user.paymentMethod}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="gap-4 p-4">
              <div className="relative">
                <Link href="/cart" className="absolute right-0 top-0">
                  <Button size={'icon'} variant="outline">
                    <Pencil />
                  </Button>
                </Link>
              </div>
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
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`} className="flex items-center">
                          <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-lg" />
                          <span className="hidden px-2 sm:table-cell">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
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
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
