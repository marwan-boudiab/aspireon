'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';
import { ZodError, ZodIssue } from 'zod';
import { emailSchema, passwordSignInSchema, signInFormSchema } from '@/lib/validator';
import { Eye, EyeOff } from 'lucide-react';

export default function CredentialsSignInForm() {
  const [data, setData] = useState({ message: '', success: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const validateField = (fieldName: string, value: string) => {
    try {
      setData((prev) => ({ ...prev, message: '' }));
      switch (fieldName) {
        case 'email':
          emailSchema.parse(value);
          break;
        case 'password':
          passwordSignInSchema.parse(value);
          break;
      }
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' })); // Clear error if validation passes
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: error.errors[0].message,
        }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      // Validate all fields
      signInFormSchema.parse(values);
      setErrors({});
      setIsSubmitting(true);

      // Simulate the action with async logic
      const result = await signInWithCredentials(null, values);
      setData(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorObject: Record<string, string> = {};
        error.errors.forEach((curr: ZodIssue) => {
          if (!errorObject[curr.path[0]]) {
            errorObject[curr.path[0]] = curr.message;
          }
        });
        setErrors(errorObject);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const SignInButton = () => (
    <Button disabled={isSubmitting} className="w-full" variant="default">
      {isSubmitting ? 'Submitting...' : 'Sign In with credentials'}
    </Button>
  );

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="Enter your email" type="email" defaultValue={signInDefaultValues.email} onChange={(e) => validateField('email', e.target.value)} />
          {errors.email && <p className="ms-2 text-destructive">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" name="password" placeholder="Enter your password" type={showPassword ? 'text' : 'password'} onChange={(e) => validateField('password', e.target.value)} />
            <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && <p className="ms-2 text-destructive">{errors.password}</p>}
        </div>
        <div className="space-y-2 pt-2">
          <SignInButton />
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link target="_self" className="link" href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
              Sign Up
            </Link>
          </div>
          {!data?.success && <div className="text-center text-destructive">{data?.message}</div>}
        </div>
      </div>
    </form>
  );
}

// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';
// import { useFormStatus } from 'react-dom';
// import { startTransition, useActionState, useState } from 'react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { signInWithCredentials } from '@/lib/actions/user.actions';
// import { signInDefaultValues } from '@/lib/constants';
// import { ZodError, ZodIssue } from 'zod';
// import { emailSchema, passwordSignInSchema, signInFormSchema } from '@/lib/validator';
// import { Eye, EyeOff } from 'lucide-react';

// export default function CredentialsSignInForm() {
//   const [data, action] = useActionState(signInWithCredentials, { message: '', success: false });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl') || '/';

//   const validateField = (fieldName: string, value: string) => {
//     try {
//       data.message = '';
//       switch (fieldName) {
//         case 'email':
//           emailSchema.parse(value);
//           break;
//         case 'password':
//           passwordSignInSchema.parse(value);
//           break;
//       }
//       setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' })); // Clear error if validation passes
//     } catch (error) {
//       if (error instanceof ZodError) {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [fieldName]: error.errors[0].message,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const values = {
//       email: formData.get('email') as string,
//       password: formData.get('password') as string,
//     };

//     try {
//       // Validate all fields
//       signInFormSchema.parse(values);
//       setErrors({});
//       // Dispatch the action inside startTransition
//       startTransition(() => {
//         action(values);
//       });
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const errorObject: Record<string, string> = {};
//         error.errors.forEach((curr: ZodIssue) => {
//           if (!errorObject[curr.path[0]]) {
//             errorObject[curr.path[0]] = curr.message;
//           }
//         });
//         setErrors(errorObject);
//       }
//     }
//   };

//   const SignInButton = () => {
//     const { pending } = useFormStatus();
//     return (
//       <Button disabled={pending} className="w-full" variant="default">
//         {pending ? 'Submitting...' : 'Sign In with credentials'}
//       </Button>
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="hidden" name="callbackUrl" value={callbackUrl} />
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" name="email" placeholder="Enter your email" type="email" defaultValue={signInDefaultValues.email} onChange={(e) => validateField('email', e.target.value)} />
//           {errors.email && <p className="ms-2 text-destructive">{errors.email}</p>}
//         </div>
//         <div>
//           <Label htmlFor="password">Password</Label>
//           <div className="relative">
//             <Input id="password" name="password" placeholder="Enter your password" type={showPassword ? 'text' : 'password'} onChange={(e) => validateField('password', e.target.value)} />
//             <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>
//           {errors.password && <p className="ms-2 text-destructive">{errors.password}</p>}
//         </div>
//         <div className="space-y-2 pt-2">
//           <SignInButton />
//           <div className="text-center text-sm text-muted-foreground">
//             Don&apos;t have an account?{' '}
//             <Link target="_self" className="link" href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
//               Sign Up
//             </Link>
//           </div>
//           {!data.success && <div className="text-center text-destructive">{data.message}</div>}
//         </div>
//       </div>
//     </form>
//   );
// }

// "use client";
// import { useSearchParams } from "next/navigation";
// import { useActionState } from "react";
// import { useFormStatus } from "react-dom";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { signInWithCredentials } from "@/lib/actions/user.actions";
// import { signInDefaultValues } from "@/lib/constants";
// import Link from "next/link";

// export default function CredentialsSignInForm() {
//   const [data, action] = useActionState(signInWithCredentials, {
//     message: "",
//     success: false,
//   });

//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/";

//   const SignInButton = () => {
//     const { pending } = useFormStatus();
//     return (
//       <Button disabled={pending} className="w-full" variant="default">
//         {pending ? "Submitting..." : "Sign In with credentials"}
//       </Button>
//     );
//   };

//   return (
//     <form action={action}>
//       <input type="hidden" name="callbackUrl" value={callbackUrl} />
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             name="email"
//             placeholder="name@gmail.com"
//             required
//             type="email"
//             defaultValue={signInDefaultValues.email}
//           />
//         </div>
//         <div>
//           <Label htmlFor="password">Password</Label>
//           <Input
//             id="password"
//             name="password"
//             required
//             type="password"
//             defaultValue={signInDefaultValues.password}
//           />
//         </div>
//         <div>
//           <SignInButton />
//         </div>

//         {data && !data.success && (
//           <div className="text-center text-destructive">{data.message}</div>
//         )}
//         {!data && (
//           <div className="text-center text-destructive">
//             Unknown error happened.{" "}
//             <Button onClick={() => window.location.reload()}>
//               Please reload
//             </Button>
//           </div>
//         )}

//         <div className="text-center text-sm text-muted-foreground">
//           Don&apos;t have an account?{" "}
//           <Link
//             target="_self"
//             className="link"
//             href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
//           >
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </form>
//   );
// }

// 'use client';
// import { useSearchParams } from 'next/navigation';
// import { useActionState } from 'react';
// import { useFormStatus } from 'react-dom';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { signInWithCredentials } from '@/lib/actions/user.actions';
// import { signInDefaultValues } from '@/lib/constants';
// import Link from 'next/link';

// export default function CredentialsSignInForm() {
//   const [data, action] = useActionState(signInWithCredentials, {
//     message: '',
//     success: false,
//   });

//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl') || '/';

//   // Parse error messages and handle both validation and auth errors
//   const getFieldErrors = () => {
//     if (!data?.message) return {};

//     // First, try to parse as field-specific validation errors
//     if (data.message.includes(': ')) {
//       const errors: Record<string, string> = {};
//       const messageLines = data.message.split('. ');

//       messageLines.forEach((line) => {
//         const [field, message] = line.split(': ');
//         if (field && message) {
//           if (!errors[field]) {
//             errors[field] = message;
//           }
//         }
//       });
//       return errors;
//     }

//     // If it's a general auth error, return it as a form-level error
//     return { form: data.message };
//   };

//   const fieldErrors = getFieldErrors();

//   const SignInButton = () => {
//     const { pending } = useFormStatus();
//     return (
//       <Button disabled={pending} className="w-full" variant="default">
//         {pending ? 'Submitting...' : 'Sign In with credentials'}
//       </Button>
//     );
//   };

//   return (
//     <form action={action}>
//       <input type="hidden" name="callbackUrl" value={callbackUrl} />
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" name="email" placeholder="name@gmail.com" type="email" defaultValue={signInDefaultValues.email} />
//           {fieldErrors.email && <p className="mt-1 text-sm text-destructive">{fieldErrors.email}</p>}
//         </div>
//         <div>
//           <Label htmlFor="password">Password</Label>
//           <Input id="password" name="password" type="password" defaultValue={signInDefaultValues.password} />
//           {fieldErrors.password && <p className="mt-1 text-sm text-destructive">{fieldErrors.password}</p>}
//         </div>
//         <div>
//           <SignInButton />
//         </div>

//         {/* Display form-level errors (like "Invalid credentials") */}
//         {fieldErrors.form && <div className="text-center text-sm text-destructive">{fieldErrors.form}</div>}

//         <div className="text-center text-sm text-muted-foreground">
//           Don&apos;t have an account?{' '}
//           <Link target="_self" className="link" href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </form>
//   );
// }
