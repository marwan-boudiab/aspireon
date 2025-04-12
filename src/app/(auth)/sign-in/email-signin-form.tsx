'use client';

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignInWithEmail } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';
import { emailSchema, signInMagicSchema } from '@/lib/validator';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ZodError, ZodIssue } from 'zod';

export default function EmailSigninForm() {
  const [data, setData] = useState({ message: '', success: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    };

    try {
      // Validate all fields
      signInMagicSchema.parse(values);
      setErrors({});
      setIsSubmitting(true);

      // Call the action with both arguments
      const result = await SignInWithEmail(null, values);
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
      {isSubmitting ? 'sending email...' : 'Sign In with email'}
    </Button>
  );

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="Enter your email" defaultValue={signInDefaultValues.email} onChange={(e) => validateField('email', e.target.value)} />
          {errors.email && <p className="ms-2 text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <SignInButton />
          {!data?.success && <div className="text-center text-destructive">{data?.message}</div>}
        </div>
      </div>
    </form>
  );
}

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { SignInWithEmail } from '@/lib/actions/user.actions';
// import { signInDefaultValues } from '@/lib/constants';
// import { emailSchema, signInMagicSchema } from '@/lib/validator';
// import { useSearchParams } from 'next/navigation';
// import { startTransition, useActionState, useState } from 'react';
// import { useFormStatus } from 'react-dom';
// import { ZodError, ZodIssue } from 'zod';

// export default function EmailSigninForm() {
//   const [data, action] = useActionState(SignInWithEmail, { message: '', success: false });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl') || '/';

//   const validateField = (fieldName: string, value: string) => {
//     try {
//       data.message = '';
//       switch (fieldName) {
//         case 'email':
//           emailSchema.parse(value);
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
//     };

//     try {
//       // Validate all fields
//       signInMagicSchema.parse(values);
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
//         {pending ? 'sending email...' : 'Sign In with email'}
//       </Button>
//     );
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="hidden" name="callbackUrl" value={callbackUrl} />
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" name="email" placeholder="Enter your email" defaultValue={signInDefaultValues.email} onChange={(e) => validateField('email', e.target.value)} />
//           {errors.email && <p className="ms-2 text-destructive">{errors.email}</p>}
//         </div>
//         <div className="space-y-2">
//           <SignInButton />
//           {!data.success && <div className="text-center text-destructive">{data.message}</div>}
//         </div>
//       </div>
//     </form>
//   );
// }

/*

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignInWithEmail } from '@/lib/actions/user.actions';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { useState } from 'react';
import { ZodError, z } from 'zod';

// Define your email validation schema
const emailSchema = z.string().email("Invalid email format");

export default function EmailSigninForm() {
  const [data, action] = useActionState(SignInWithEmail, { success: false, message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { pending } = useFormStatus();

  const validateEmail = (value: string) => {
    try {
      emailSchema.parse(value);
      setErrors((prevErrors) => ({ ...prevErrors, email: '' })); // Clear error if validation passes
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: error.errors[0].message,
        }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    // Validate email before proceeding
    try {
      emailSchema.parse(email);
      setErrors({});
      action({ email });
    } catch (error) {
      if (error instanceof ZodError) {
        const errorObject: Record<string, string> = {};
        error.errors.forEach((curr) => {
          if (!errorObject[curr.path[0]]) {
            errorObject[curr.path[0]] = curr.message;
          }
        });
        setErrors(errorObject);
      }
    }
  };

  const SignInButton = () => (
    <Button disabled={pending} className="w-full" variant="default">
      {pending ? 'Sending email...' : 'Sign In with email'}
    </Button>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="user_email">Email</Label>
          <Input
            id="user_email"
            name="email"
            placeholder="name@gmail.com"
            type="email"
            onChange={(e) => validateEmail(e.target.value)}
          />
          {errors.email && <div className="ms-2 text-destructive">{errors.email}</div>}
        </div>
        <div className="space-y-2">
          <SignInButton />
        </div>
        {!data.success && <div className="text-center text-destructive">{data.message}</div>}
      </div>
    </form>
  );
}


*/
