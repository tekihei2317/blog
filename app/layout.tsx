import '../styles/global.css';
import { Metadata } from 'next';
import Link from 'next/link';
import { blogTitle, blogUrl } from '../utils/blog';
import { GoogleAnalytics } from '../utils/google-analytics';

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    type: 'article',
    siteName: "tekihei2317's blog",
    title: blogTitle,
    url: blogUrl,
    description: 'tekihei2317のブログ',
  },
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="ja">
      <body>
        <div className="px-4 pb-24 bg-my-black min-h-screen">
          <header className="h-20 flex justify-between items-center max-w-6xl mx-auto">
            <strong>
              <Link className="text-2xl text-white cursor-pointer" href="/">
                {blogTitle}
              </Link>
            </strong>
            <nav className="nav flex gap-4">
              <Link href="/tags" className="text-white text-lg">
                Tags
              </Link>
              <Link href="/about" className="text-white text-lg">
                About
              </Link>
            </nav>
          </header>
          <GoogleAnalytics />
          {children}
        </div>
      </body>
    </html>
  );
}
