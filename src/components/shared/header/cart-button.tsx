import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMyCart } from '@/lib/actions/cart.actions';
import { ShoppingCartIcon } from 'lucide-react';

export default async function CartButton() {
  const cart = await getMyCart();
  return (
    <Button asChild size={'icon'} variant="ghost">
      <Link href="/cart" className="relative">
        <ShoppingCartIcon />
        {cart && cart.items.length > 0 && <Badge className="absolute -right-2.5 -top-2">{cart.items.reduce((a, c) => a + c.qty, 0)}</Badge>}
      </Link>
    </Button>
  );
}
