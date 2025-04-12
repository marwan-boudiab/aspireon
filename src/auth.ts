/* eslint-disable @typescript-eslint/no-explicit-any */
import { DrizzleAdapter } from '@auth/drizzle-adapter'; // Import the Drizzle adapter for NextAuth to integrate with Drizzle ORM database
import { compareSync } from 'bcrypt-ts'; // Import bcrypt compare function for password verification (edge-compatible version)
import { eq } from 'drizzle-orm'; // Import equality operator from Drizzle ORM for database queries
import type { NextAuthConfig } from 'next-auth'; // Import NextAuth configuration type for TypeScript support
import NextAuth from 'next-auth'; // Import the main NextAuth library
import CredentialsProvider from 'next-auth/providers/credentials'; // Import the credentials provider for email/password authentication
import Resend from 'next-auth/providers/resend'; // Import the Resend provider for email-based authentication
import Google from 'next-auth/providers/google'; // Import the Google provider for OAuth authentication

import db from '@/db/drizzle'; // Import the configured database instance
import { users, carts } from '@/db/schema'; // Import database schema definitions for users and carts
import { cookies } from 'next/headers'; // Import Next.js cookies utility for handling cookies
import { NextResponse } from 'next/server'; // Import Next.js response utility for handling HTTP responses
import { APP_NAME, SENDER_EMAIL } from '@/lib/constants'; // Import application constants

// Export the NextAuth configuration object
export const config = {
  // Configure custom pages for authentication
  pages: {
    signIn: '/sign-in', // Set custom sign-in page route
    error: '/sign-in', // Set custom error page route (same as sign-in in this case)
  },
  // Configure session handling
  session: {
    strategy: 'jwt', // Use JWT strategy for session management
    maxAge: 30 * 24 * 60 * 60, // Set session maximum age to 30 days (in seconds)
  },
  // Set the database adapter to Drizzle
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  // Configure authentication providers
  providers: [
    // Configure credentials provider (email/password)
    CredentialsProvider({
      // Define required credentials
      credentials: {
        email: { type: 'email' }, // Email field configuration
        password: { type: 'password' }, // Password field configuration
      },
      // Authorization function for credentials validation
      async authorize(credentials) {
        // Return null if no credentials provided
        if (credentials == null) return null;

        // Find user in database by email
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });
        // If user exists and has password
        if (user && user.password) {
          // Compare provided password with stored hash
          const isMatch = compareSync(credentials.password as string, user.password);
          // If passwords match, return user data
          if (isMatch) {
            return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
          }
        }
        // Return null if authentication fails
        return null;
      },
    }),
    // Configure Resend provider for email authentication
    Resend({
      name: 'Email', // Set provider display name
      from: `${APP_NAME} <${SENDER_EMAIL}>`, // Configure sender email address
      id: 'email', // Set provider ID
      apiKey: process.env.AUTH_RESEND_KEY,
    }),
    // Configure Google OAuth provider
    Google({
      // Allow linking accounts with same email address
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  // Configure authentication callbacks
  callbacks: {
    // JWT token manipulation callback
    jwt: async ({ token, user, trigger, session }: any) => {
      // If user object exists (during sign in/up)
      if (user) {
        // If user has no name, generate one from email
        if (user.name === 'NO_NAME') {
          // Set token name to email username part
          token.name = user.email!.split('@')[0];
          // Update user name in database
          await db.update(users).set({ name: token.name }).where(eq(users.id, user.id));
        }
        // Set user phone in token
        token.phone = user.phone;
        // Set user role in token
        token.role = user.role;
        // Handle cart merging during sign in/up
        if (trigger === 'signIn' || trigger === 'signUp') {
          // Get session cart ID from cookies
          const sessionCartId = (await cookies()).get('sessionCartId')?.value;
          // Throw error if no session cart exists
          if (!sessionCartId) throw new Error('Session Cart Not Found');
          // Find session cart in database
          const sessionCartExists = await db.query.carts.findFirst({
            where: eq(carts.sessionCartId, sessionCartId),
          });
          // If session cart exists and has no user ID
          if (sessionCartExists && !sessionCartExists.userId) {
            // Check if user already has a cart
            const userCartExists = await db.query.carts.findFirst({
              where: eq(carts.userId, user.id),
            });
            // If user has existing cart
            if (userCartExists) {
              (await cookies()).set('beforeSigninSessionCartId', sessionCartId);
              (await cookies()).set('sessionCartId', userCartExists.sessionCartId);
            } else {
              // Link session cart to user
              db.update(carts).set({ userId: user.id }).where(eq(carts.id, sessionCartExists.id));
            }
          }
        }
      }
      // Update token name if session update triggered
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
        // Add this to handle phone updates
        if (session.user.phone) {
          token.phone = session.user.phone;
        }
      }
      // Return modified token
      return token;
    },
    // Session manipulation callback
    session: async ({ session, user, trigger, token }: any) => {
      session.user.id = token.sub; // Set user ID in session
      session.user.role = token.role; // Set user role in session
      if (trigger === 'update') session.user.name = user.name; // Update session name if triggered
      session.user.phone = token.phone;
      return session; // Return modified session
    },
    // Authorization callback for protected routes
    authorized({ request, auth }: any) {
      // Define protected path patterns
      const protectedPaths = [/\/shipping-address/, /\/payment-method/, /\/place-order/, /\/profile/, /\/user\/(.*)/, /\/order\/(.*)/, /\/admin/];
      // Get requested pathname
      const { pathname } = request.nextUrl;
      // Block access to protected paths if not authenticated
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;
      // Handle session cart creation
      if (!request.cookies.get('sessionCartId')) {
        // Generate new session cart ID
        const sessionCartId = crypto.randomUUID();
        // Create new request headers
        const newRequestHeaders = new Headers(request.headers);
        // Create response with modified headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        // Set session cart ID cookie
        response.cookies.set('sessionCartId', sessionCartId);
        // Return modified response
        return response;
      } else {
        // Allow access if session cart exists
        return true;
      }
    },
  },
  // Satisfy TypeScript configuration type
} satisfies NextAuthConfig;
// Export NextAuth handlers and utilities
export const { handlers, auth, signIn, signOut } = NextAuth(config);
