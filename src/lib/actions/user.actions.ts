/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';

import { formatError } from '../utils';
import db from '@/db/drizzle';
import { users } from '@/db/schema';
import { hashSync } from 'bcrypt-ts';
import { auth, signIn, signOut } from '@/auth';
import { ShippingAddress } from '@/types';
import { paymentMethodSchema, shippingAddressSchema, updateUserSchema } from '../validator';
import { revalidatePath } from 'next/cache';
import { count, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { PAGE_SIZE } from '../constants';

// USER
export async function signUp(prevState: unknown, { name, email, password, confirmPassword }: { name: string; email: string; password: string; confirmPassword: string }) {
  try {
    const user = { name, email, confirmPassword, password };
    const values = {
      id: crypto.randomUUID(),
      ...user,
      password: hashSync(user.password, 10),
    };
    await db.insert(users).values(values);
    await signIn('credentials', {
      email: user.email,
      password: user.password,
    });
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error).includes('duplicate key value violates unique constraint "user_email_idx"') ? 'Email already exist' : formatError(error),
    };
  }
}

export async function signInWithCredentials(prevState: unknown, { email, password }: { email: string; password: string }) {
  try {
    await signIn('credentials', { email, password });
    return { success: true, message: 'Sign in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid email or password' };
  }
}

export async function SignInWithEmail(prevState: unknown, { email }: { email: string }) {
  try {
    await signIn('email', { email });
    return { success: true, message: 'Sign in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      // throw error;
      // return { success: false, message: 'Redirect Error' };
      return { success: false, message: 'Invalid email' };
    }
    return { success: false, message: 'Invalid email' };
  }
}

export const SignInWithGoogle = async () => {
  await signIn('google');
};

export const SignOut = async () => {
  await signOut();
};

// GET
export async function getAllUsers({ limit = PAGE_SIZE, page }: { limit?: number; page: number }) {
  const data = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
    limit,
    offset: (page - 1) * limit,
  });
  const dataCount = await db.select({ count: count() }).from(users);
  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

export async function getUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });
  if (!user) throw new Error('User not found');
  return user;
}

// DELETE
export async function deleteUser(id: string) {
  try {
    await db.delete(users).where(eq(users.id, id));
    revalidatePath('/admin/users');
    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// UPDATE
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await db
      .update(users)
      .set({
        name: user.name,
        phone: user.phone,
        role: user.role,
      })
      .where(eq(users.id, user.id));
    revalidatePath('/admin/users');
    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await db.query.users.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      where: (users, { eq }) => eq(users.id, session?.user.id!),
    });
    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);
    await db.update(users).set({ address }).where(eq(users.id, currentUser.id));
    revalidatePath('/place-order');
    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
  try {
    const session = await auth();
    const currentUser = await db.query.users.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      where: (users, { eq }) => eq(users.id, session?.user.id!),
    });
    if (!currentUser) throw new Error('User not found');
    const paymentMethod = paymentMethodSchema.parse(data);
    await db.update(users).set({ paymentMethod: paymentMethod.type }).where(eq(users.id, currentUser.id));
    revalidatePath('/place-order');
    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProfile(user: { name: string; email: string; phone?: string }) {
  try {
    const session = await auth();
    const currentUser = await db.query.users.findFirst({
      // where: (users, { eq }) => eq(users.id, session?.user.id!),
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      where: (users, { eq }) => eq(users.id, session?.user.id!),
    });
    if (!currentUser) throw new Error('User not found');
    await db
      .update(users)
      .set({
        name: user.name,
        phone: user.phone,
      })
      .where(eq(users.id, currentUser.id));

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
