import { APP_NAME, DEVELOPERS } from '@/lib/constants';
import { Copyright, Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="ss_wrapper mt-auto">
      <div className="mt-6 rounded-t-xl border-2 border-b-0 bg-secondary">
        {/* Footer content */}
        <div className="flex flex-col items-center justify-center space-y-4 p-5 text-xs md:text-base">
          {/* Copyright Section */}
          <div className="flex items-center justify-center space-x-2">
            <span>
              <Copyright className="size-5" />
            </span>
            <span>
              2024 {APP_NAME}. Developed by {DEVELOPERS}. All Rights Reserved.
            </span>
          </div>

          {/* Links Section */}
          {/* <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-sm transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/contact-us" className="text-sm transition-colors hover:text-primary">
              Contact Us
            </Link>
          </div> */}

          {/* Social Media Icons */}
          <div className="mt-4 flex space-x-6">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <div className="rounded-full border-2 p-2 transition-colors hover:bg-primary">
                <Facebook className="size-5" />
              </div>
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <div className="rounded-full border-2 p-2 transition-colors hover:bg-primary">
                <Instagram className="size-5" />
              </div>
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <div className="rounded-full border-2 p-2 transition-colors hover:bg-primary">
                <Twitter className="size-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import { APP_NAME, DEVELOPERS } from '@/lib/constants';
// import { Copyright } from 'lucide-react';

// const Footer = () => {
//   return (
//     <footer className="mt-auto">
//       <div className="mt-4 rounded-t-xl border-2 border-b-0 bg-secondary">
//         <div className="flex items-center justify-center p-5">
//           <span className="mr-2">
//             <Copyright size={18} />
//           </span>
//           <span>
//             2024 {APP_NAME} Developed by {DEVELOPERS}. All Rights reserved
//           </span>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;