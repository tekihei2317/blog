import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="px-4 pb-24 bg-my-black min-h-screen">
      <header className=" h-20 flex justify-between items-center">
        <strong>
          <Link className="text-2xl text-white cursor-pointer" href="/">
            tekihei2317's blog
          </Link>
        </strong>
        <nav className="nav"></nav>
      </header>
      {children}
    </div>
  );
};
