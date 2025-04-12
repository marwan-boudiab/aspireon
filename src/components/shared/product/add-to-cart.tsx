// 'use client';

// import { Button } from '@/components/ui/button';
// import { ToastAction } from '@/components/ui/toast';
// import { useToast } from '@/hooks/use-toast';
// import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
// import { Cart, CartItem } from '@/types';
// import { Loader, Minus, Plus } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useTransition } from 'react';

// export default function AddToCart({ cart, item }: { cart?: Cart; item: Omit<CartItem, 'cartId'> }) {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isPending, startTransition] = useTransition();
//   // const existItem = cart && cart.items.find((x) => x.productId === item.productId);
//   const existItem = cart && cart.items.find((x) => x.productId === item.productId && x.size === item.size);
//   return existItem ? (
//     <div>
//       <Button
//         type="button"
//         size="icon"
//         variant="outline"
//         disabled={isPending}
//         onClick={() => {
//           startTransition(async () => {
//             const res = await removeItemFromCart(item);
//             toast({
//               title: res.success ? 'Item removed from cart' : 'Unable to remove item from cart',
//               variant: res.success ? 'default' : 'destructive',
//               description: res.message,
//             });
//             return;
//           });
//         }}
//       >
//         {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
//       </Button>
//       <span className="px-2">{existItem.qty}</span>
//       <Button
//         type="button"
//         size="icon"
//         variant="outline"
//         disabled={isPending}
//         onClick={() => {
//           startTransition(async () => {
//             const res = await addItemToCart(item);
//             toast({
//               title: res.success ? 'Item added to cart' : 'Unable to add item to cart',
//               variant: res.success ? 'default' : 'destructive',
//               description: res.message,
//             });
//             return;
//           });
//         }}
//       >
//         {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
//       </Button>
//     </div>
//   ) : (
//     <Button
//       className="w-full"
//       type="button"
//       disabled={isPending}
//       onClick={() => {
//         startTransition(async () => {
//           const res = await addItemToCart(item);
//           if (!res.success) {
//             toast({
//               title: 'Unable to add item to cart',
//               variant: 'destructive',
//               description: res.message,
//             });
//             return;
//           }
//           toast({
//             title: 'Item added to cart',
//             description: `${item.name} added to the cart`,
//             action: (
//               <ToastAction className="bg-primary" onClick={() => router.push('/cart')} altText="Go to cart">
//                 Go to cart
//               </ToastAction>
//             ),
//           });
//         });
//       }}
//     >
//       {isPending ? <Loader className="animate-spin" /> : <Plus />}
//       &nbsp;&nbsp;Add to cart
//     </Button>
//   );
// }

'use client';

import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useSizeStore } from '@/store';
import { Cart, CartItem } from '@/types';
import { Loader, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function AddToCart({ cart, item }: { cart?: Cart; item: Omit<CartItem, 'cartId'> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { activeSize } = useSizeStore();

  const itemWithSize = {
    ...item,
    size: activeSize,
  };

  const existItem = cart && cart.items.find((x) => x.productId === item.productId && x.size === activeSize);

  return existItem ? (
    <div>
      <Button
        type="button"
        size="icon"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await removeItemFromCart(itemWithSize);
            toast({
              title: res.success ? 'Item removed from cart' : 'Unable to remove item from cart',
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          });
        }}
      >
        {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        size="icon"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await addItemToCart(itemWithSize);
            toast({
              title: res.success ? 'Item added to cart' : 'Unable to add item to cart',
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          });
        }}
      >
        {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await addItemToCart(itemWithSize);
          if (!res.success) {
            toast({
              title: 'Unable to add item to cart',
              variant: 'destructive',
              description: res.message,
            });
            return;
          }
          toast({
            title: 'Item added to cart',
            description: `${item.name} added to the cart`,
            action: (
              <ToastAction className="bg-primary" onClick={() => router.push('/cart')} altText="Go to cart">
                Go to cart
              </ToastAction>
            ),
          });
        });
      }}
    >
      {isPending ? <Loader className="animate-spin" /> : <Plus />}
      &nbsp;&nbsp;Add to cart
    </Button>
  );
}
