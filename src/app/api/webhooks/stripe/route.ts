import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { updateOrderToPaid } from '@/lib/actions/order.actions';

let stripe: Stripe;

try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
  }
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
  // console.error('Failed to initialize Stripe:', error);
}

// export async function POST(req: NextRequest) {
//   const event = await stripe.webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') as string, process.env.STRIPE_WEBHOOK_SECRET as string);
//   if (event.type === 'charge.succeeded') {
//     const { object } = event.data;
//     await updateOrderToPaid({
//       orderId: object.metadata.orderId,
//       paymentResult: {
//         id: object.id,
//         status: 'COMPLETED',
//         email_address: object.billing_details.email!,
//         pricePaid: (object.amount / 100).toFixed(),
//       },
//     });
//     return NextResponse.json({
//       message: 'updateOrderToPaid was successful',
//     });
//   }
//   return NextResponse.json({
//     message: 'event is not charge.succeeded',
//   });
// }

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET as string);

    if (event.type === 'charge.succeeded') {
      const { object } = event.data as { object: Stripe.Charge };
      await updateOrderToPaid({
        orderId: object.metadata.orderId,
        paymentResult: {
          id: object.id,
          status: 'COMPLETED',
          email_address: object.billing_details.email!,
          pricePaid: (object.amount / 100).toFixed(),
        },
      });
      return NextResponse.json({
        message: 'updateOrderToPaid was successful',
      });
    }

    return NextResponse.json({
      message: 'event is not charge.succeeded',
    });
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    return NextResponse.json({ message: 'Error handling webhook' }, { status: 400 });
  }
}
