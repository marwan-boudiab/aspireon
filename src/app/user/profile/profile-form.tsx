'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/lib/actions/user.actions';
import { updateProfileSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ProfileForm = () => {
  const { data: session, update } = useSession();
  // console.log('Session data:', session); // Add this to debug
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    defaultValues: { name: session?.user.name!, email: session?.user.email!, phone: session?.user.phone! },
    // defaultValues: { name: session?.user.name, email: session?.user.email },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name!,
        email: session.user.email!,
        phone: session.user.phone!,
      });
    }
  }, [session, form]);

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    // console.log(values);
    const res = await updateProfile(values);
    if (!res.success) return toast({ title: 'Unable to update profile', variant: 'destructive', description: res.message });

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
        phone: values.phone,
      },
    };
    await update(newSession);
    // console.log('Updated session', newSession);
    toast({ title: 'Profile updated', description: res.message });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled placeholder="Enter email" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting} className="button col-span-2 w-full">
          {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
