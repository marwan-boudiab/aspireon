import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';

import CredentialsSignInForm from './credentials-signin-form';
// import EmailSigninForm from './email-signin-form';
import GoogleSignInForm from './google-signin-form';
import { auth } from '@/auth';

export const metadata: Metadata = { title: `Sign In - ${APP_NAME}` };

// export default async function SignIn({
//   searchParams: { callbackUrl },
// }: {
//   searchParams: { callbackUrl: string };
// }) {
//   const session = await auth();
//   if (session) return redirect(callbackUrl || "/");

interface PageProps {
  searchParams?: Promise<Record<string, string | undefined>>; // Handle potential async resolution
}

export default async function SignIn({ searchParams }: PageProps) {
  // Resolve the searchParams if it is a promise
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const callbackUrl = resolvedSearchParams.callbackUrl ?? '/';

  // Authenticate the session
  const session = await auth();

  if (session) {
    // Use optional chaining to safely access callbackUrl
    redirect(callbackUrl || '/');
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image src="/assets/icons/logo.png" width={512} height={512} alt={`${APP_NAME} logo`} className="h-10 w-10" />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Select a method to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleSignInForm />
          <SeparatorWithOr />
          {/* <EmailSigninForm />
          <SeparatorWithOr /> */}
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
}

const SeparatorWithOr = () => {
  return (
    <div className="my-5 h-5 border-b border-muted-foreground text-center text-2xl">
      <span className="border-muted-foreground bg-card px-5 text-sm">or</span>
    </div>
  );
};
