type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="px-4 pb-24 bg-my-black min-h-screen">
      <header className=" h-20 flex justify-between items-center">
        <strong>
          <div className="text-2xl text-white">tekihei2317のブログ</div>
        </strong>
        <nav className="nav"></nav>
      </header>
      {children}
    </div>
  );
};
