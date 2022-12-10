import Head from 'next/head';
import Link from 'next/link';
import { blogTitle, blogUrl } from '../utils/blog';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href="favicon.png" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blogTitle} key="og:title" />
        <meta property="og:url" content={blogUrl} />
      </Head>
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
        {children}
      </div>
    </>
  );
};
