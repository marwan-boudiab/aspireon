import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { APP_NAME } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Shop the latest fashion trends with our premium selection of clothing and accessories.',
  keywords: ['fashion', 'clothing', 'online shopping', 'accessories', 'premium brands'],
  authors: [{ name: 'Your Company Name' }],
  creator: 'Your Company Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aspireon-lake.vercel.app',
    siteName: APP_NAME,
    title: APP_NAME,
    description: 'Shop the latest fashion trends with our premium selection of clothing and accessories.',
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: 'Shop the latest fashion trends with our premium selection of clothing and accessories.',
    images: ['/assets/images/og-image.png'],
    creator: '@yourTwitterHandle',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <div className="wrapper flex min-h-dvh flex-col">
      <div className="px-2 md:px-0">
        <Header />
      </div>
      <main>{children}</main>
      {modal}
      <Footer />
    </div>
  );
}
