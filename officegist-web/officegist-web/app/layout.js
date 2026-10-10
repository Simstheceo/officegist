import './globals.css';
import { Manrope } from 'next/font/google';
import Header from '@/components/Header';
import { SITE } from '@/lib/format';

const font = Manrope({ subsets: ['latin'], weight: ['400', '600', '800'], variable: '--font', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'OfficeGist: The workplace, unfiltered.', template: '%s | OfficeGist' },
  description: 'Know the workplace before you join. Anonymous employee reviews, salaries and interview experiences in Nigeria.',
  openGraph: { siteName: 'OfficeGist', type: 'website', locale: 'en_NG' },
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en-NG" className={font.variable}>
      <body>
        {/* Shown while seeded companies are fictional. Remove when real data replaces them. */}
        {process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER !== 'false' && <div className="demo">Early access: sample companies are fictional demo data.</div>}
        <Header />
        <main className="w">{children}</main>
        <footer className="ft w">OfficeGist · Anonymous, employee-powered workplace intelligence for Nigeria</footer>
      </body>
    </html>
  );
}
