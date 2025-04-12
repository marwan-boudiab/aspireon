'use client';

import { Check, Loader } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { createOrder } from '@/lib/actions/order.actions';

export default function PlaceOrderForm() {
  const [data, action] = useFormState(createOrder, { success: false, message: '' });

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        &nbsp;&nbsp;Place Order
      </Button>
    );
  };

  return (
    <form action={action} className="w-full">
      <PlaceOrderButton />
      {!data.success && data.message && <p className="py-4 text-destructive">{data.message}</p>}
    </form>
  );
}
