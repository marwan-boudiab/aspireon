'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { formatCurrency } from '@/lib/utils';
import { Cart } from '@/types';
import { ArrowRight, Loader, Minus, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function CartForm({ cart }: { cart?: Cart }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  return (
    <div className="ss_wrapper min-h-[65vh] flex-1">
      <h1 className="h2-bold py-4 text-center">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="mx-auto mb-4 h-24 w-24" />
            <h1 className="mb-2 text-2xl font-bold text-primary">Your cart is empty</h1>
            <p className="mb-8">Looks like you have not added any items to your cart yet.</p>
            <Button className="inline-flex items-center">
              <Link href="/" className="flex items-center">
                Go Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-8">
          <div className="col-span-1 overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Size</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
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
                    <TableCell className="text-center">{item.size}</TableCell>
                    <TableCell>
                      <div className="flex-center gap-2">
                        <Button
                          disabled={isPending}
                          variant="outline"
                          className="h-7 w-7"
                          type="button"
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeItemFromCart(item);
                              if (!res.success) {
                                toast({
                                  title: 'Unable to remove item from cart',
                                  variant: 'destructive',
                                  description: res.message,
                                });
                              }
                            })
                          }
                        >
                          {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
                        </Button>
                        <span>{item.qty}</span>
                        <Button
                          disabled={isPending}
                          variant="outline"
                          className="h-7 w-7"
                          type="button"
                          onClick={() =>
                            startTransition(async () => {
                              const res = await addItemToCart(item);
                              if (!res.success) {
                                toast({
                                  title: 'Unable to add item to cart',
                                  variant: 'destructive',
                                  description: res.message,
                                });
                              }
                            })
                          }
                        >
                          {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="col-span-2 md:col-span-1">
            <Card>
              <CardContent className="gap-4 p-3">
                <div className="flex justify-between pb-3 text-xl">
                  <p>
                    Subtotal<span className="ms-2 rounded-full border-2 bg-primary px-[0.5rem]">{cart.items.reduce((a, c) => a + c.qty, 0)}</span>
                  </p>
                  <p>{formatCurrency(cart.itemsPrice)}</p>
                </div>
                <Button onClick={() => startTransition(() => router.push('/shipping-address'))} className="w-full" disabled={isPending}>
                  {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  &nbsp;&nbsp;Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
