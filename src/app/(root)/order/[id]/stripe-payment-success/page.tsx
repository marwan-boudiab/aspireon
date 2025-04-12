import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';

import { Button } from '@/components/ui/button';
import { getOrderById } from '@/lib/actions/order.actions';
import { APP_NAME } from '@/lib/constants';

// Create a function to initialize Stripe only if the key is available
const initializeStripe = () => {
  try {
    return process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY as string) : null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.error('Failed to initialize Stripe:', error);
    return null;
  }
};

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const metadata: Metadata = { title: `Stripe Payment Success - ${APP_NAME}` };

export default async function SuccessPage({ searchParams, params: { id } }: { params: { id: string }; searchParams: { payment_intent: string } }) {
  const order = await getOrderById(id);
  if (!order) notFound();

  // Initialize Stripe with error handling
  const stripe = initializeStripe();

  // If Stripe is not initialized, handle the error gracefully
  if (!stripe) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="h1-bold">Payment Verification Unavailable</h1>
          <div>We cannot verify your payment at the moment. Please contact support.</div>
          <Button asChild>
            <Link href={`/order/${id}`}>View order</Link>
          </Button>
        </div>
      </div>
    );
  }
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent);
    if (paymentIntent.metadata.orderId == null || paymentIntent.metadata.orderId !== order.id.toString()) return notFound();

    const isSuccess = paymentIntent.status === 'succeeded';
    if (!isSuccess) return redirect(`/order/${id}`);
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="h1-bold">Thanks for your purchase</h1>
          <div>We are now processing your order.</div>
          <Button asChild>
            <Link href={`/order/${id}`}>View order</Link>
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="h1-bold">Payment Verification Failed</h1>
          <div>We encountered an issue verifying your payment. Please contact support.</div>
          <Button asChild>
            <Link href={`/order/${id}`}>View order</Link>
          </Button>
        </div>
      </div>
    );
  }
}
