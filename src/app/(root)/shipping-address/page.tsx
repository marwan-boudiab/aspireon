import { auth } from '@/auth';
import ShippingAddressForm from '@/components/shared/checkout/shipping-address-form';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { APP_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CheckForPhone from './checkForPhone';

export const metadata: Metadata = { title: `Shipping Address - ${APP_NAME}` };

export default async function ShippingPage() {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    console.error('User ID is not available');
    return null;
  }
  const user = await getUserById(userId);

  if (!user.phone || user.phone === '') {
    // Return a flag to trigger the toast in the client-side component
    return <CheckForPhone />;
  }

  return <ShippingAddressForm address={user.address} />;
}
