import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

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
