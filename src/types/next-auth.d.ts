import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  export interface Session {
    user: {
      phone: string;
      role: string;
    } & DefaultSession['user'];
  }
}
