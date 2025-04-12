import Stripe from 'stripe';
import { getOrderById } from '@/lib/actions/order.actions';
import { APP_NAME } from '@/lib/constants';
import { notFound } from 'next/navigation';
import OrderDetailsForm from './order-details-form';
import { auth } from '@/auth';

export const metadata = {
  title: `Order Details - ${APP_NAME}`,
};

const OrderDetailsPage = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await auth();
  const order = await getOrderById(id);
  if (!order) notFound();

  let client_secret = null;
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(Number(order.totalPrice) * 100),
          currency: 'USD',
          metadata: { orderId: order.id },
        });

        client_secret = paymentIntent.client_secret;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // console.error('Error creating Stripe PaymentIntent:', error);
        // console.error('Error creating Stripe PaymentIntent');
      }
    } else {
      // console.warn('Stripe secret key is missing. Skipping Stripe PaymentIntent creation.');
    }
  }

  return <OrderDetailsForm order={order} paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'} isAdmin={session?.user.role === 'admin' || false} stripeClientSecret={client_secret} />;
};

export default OrderDetailsPage;
