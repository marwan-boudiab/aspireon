import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit-latin' });
export const metadata: Metadata = { title: `${APP_NAME}` };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', outfit.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
