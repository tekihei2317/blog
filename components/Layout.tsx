import Head from 'next/head';
import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href="favicon.png" />
      </Head>
      <div className="px-4 pb-24 bg-my-black min-h-screen">
        <header className="h-20 flex justify-between items-center max-w-6xl mx-auto">
          <strong>
            <Link className="text-2xl text-white cursor-pointer" href="/">
              tekihei2317's blog
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
