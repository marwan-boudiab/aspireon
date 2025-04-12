'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/lib/actions/user.actions';
import { ZodError, ZodIssue } from 'zod';
import { nameSchema, emailSchema, passwordSchema, confirmPasswordSchema, signUpFormSchema } from '@/lib/validator';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUpForm() {
  const [data, setData] = useState({ success: false, message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const validateField = (fieldName: string, value: string) => {
    try {
      setData((prev) => ({ ...prev, message: '' }));
      // Use individual field schemas for validation
      switch (fieldName) {
        case 'name':
          nameSchema.parse(value);
          break;
        case 'email':
          emailSchema.parse(value);
          break;
        case 'password':
          passwordSchema.parse(value);
          break;
        case 'confirmPassword':
          confirmPasswordSchema.parse(value);
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
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    try {
      signUpFormSchema.parse(values);
      setErrors({});
      setIsSubmitting(true);

      // Call the action
      const result = await signUp(null, values);
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

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Enter your name" type="text" onChange={(e) => validateField('name', e.target.value)} />
          {errors.name && <div className="ms-2 text-destructive">{errors.name}</div>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="Enter your email" type="email" onChange={(e) => validateField('email', e.target.value)} />
          {errors.email && <div className="ms-2 text-destructive">{errors.email}</div>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" name="password" placeholder="Enter your password" type={showPassword ? 'text' : 'password'} onChange={(e) => validateField('password', e.target.value)} />
            <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && <div className="ms-2 text-destructive">{errors.password}</div>}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" type={showConfirmPassword ? 'text' : 'password'} onChange={(e) => validateField('confirmPassword', e.target.value)} />
            <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.confirmPassword && <div className="ms-2 text-destructive">{errors.confirmPassword}</div>}
        </div>

        <div className="space-y-2 pt-2">
          <Button disabled={isSubmitting} className="w-full" variant="default">
            {isSubmitting ? 'Submitting...' : 'Sign Up'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href={`/sign-in?callbackUrl=${callbackUrl}`} className="link">
              Sign In
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
// import { startTransition, useState } from 'react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { signUp } from '@/lib/actions/user.actions';
// import { useActionState } from 'react';
// import { ZodError, ZodIssue } from 'zod';
// import { nameSchema, emailSchema, passwordSchema, confirmPasswordSchema, signUpFormSchema } from '@/lib/validator';
// import { Eye, EyeOff } from 'lucide-react';

// export default function SignUpForm() {
//   const [data, action] = useActionState(signUp, { success: false, message: '' });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl') || '/';

//   const validateField = (fieldName: string, value: string) => {
//     try {
//       data.message = '';
//       // Use individual field schemas for validation
//       switch (fieldName) {
//         case 'name':
//           nameSchema.parse(value);
//           break;
//         case 'email':
//           emailSchema.parse(value);
//           break;
//         case 'password':
//           passwordSchema.parse(value);
//           break;
//         case 'confirmPassword':
//           confirmPasswordSchema.parse(value);
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
//       name: formData.get('name') as string,
//       email: formData.get('email') as string,
//       password: formData.get('password') as string,
//       confirmPassword: formData.get('confirmPassword') as string,
//     };

//     try {
//       signUpFormSchema.parse(values);
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

//   const SignUpButton = () => {
//     const { pending } = useFormStatus();
//     return (
//       <Button disabled={pending} className="w-full" variant="default">
//         {pending ? 'Submitting...' : 'Sign Up'}
//       </Button>
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="hidden" name="callbackUrl" value={callbackUrl} />
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="name">Name</Label>
//           <Input id="name" name="name" placeholder="Enter your name" type="text" onChange={(e) => validateField('name', e.target.value)} />
//           {/* <Input id="name" name="name" placeholder="Enter your name" type="text" onBlur={(e) => validateField('name', e.target.value)} /> */}
//           {errors.name && <div className="ms-2 text-destructive">{errors.name}</div>}
//         </div>

//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" name="email" placeholder="Enter your email" type="email" onChange={(e) => validateField('email', e.target.value)} />
//           {/* <Input id="email" name="email" placeholder="Enter your email" type="email" onBlur={(e) => validateField('email', e.target.value)} /> */}
//           {errors.email && <div className="ms-2 text-destructive">{errors.email}</div>}
//         </div>

//         <div>
//           <Label htmlFor="password">Password</Label>
//           {/* <Input id="password" name="password" placeholder="Enter your password" type="password" onChange={(e) => validateField('password', e.target.value)} /> */}
//           {/* <Input id="password" name="password" placeholder="Enter your password" type="password" onBlur={(e) => validateField('password', e.target.value)} /> */}
//           <div className="relative">
//             <Input id="password" name="password" placeholder="Enter your password" type={showPassword ? 'text' : 'password'} onChange={(e) => validateField('password', e.target.value)} />
//             <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>
//           {errors.password && <div className="ms-2 text-destructive">{errors.password}</div>}
//         </div>

//         <div>
//           <Label htmlFor="confirmPassword">Confirm Password</Label>
//           {/* <Input id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" type="password" onChange={(e) => validateField('confirmPassword', e.target.value)} /> */}
//           {/* <Input id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" type="password" onBlur={(e) => validateField('confirmPassword', e.target.value)} /> */}
//           <div className="relative">
//             <Input id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" type={showConfirmPassword ? 'text' : 'password'} onChange={(e) => validateField('confirmPassword', e.target.value)} />
//             <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
//               {showConfirmPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>
//           {errors.confirmPassword && <div className="ms-2 text-destructive">{errors.confirmPassword}</div>}
//         </div>
//         <div className="space-y-2 pt-2">
//           <SignUpButton />
//           <div className="text-center text-sm text-muted-foreground">
//             Already have an account?{' '}
//             <Link href={`/sign-in?callbackUrl=${callbackUrl}`} className="link">
//               Sign In
//             </Link>
//           </div>
//           {!data.success && <div className="text-center text-destructive">{data.message}</div>}
//         </div>
//       </div>
//     </form>
//   );
// }
