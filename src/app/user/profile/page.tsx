import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';
import { APP_NAME } from '@/lib/constants';

import ProfileForm from './profile-form';

export const metadata: Metadata = { title: `Customer Profile - ${APP_NAME}` };

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }
  return (
    <SessionProvider session={session}>
      <div className="mx-auto max-w-md space-y-4">
        <h2 className="h2-bold py-4 text-center">Profile</h2>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
}
